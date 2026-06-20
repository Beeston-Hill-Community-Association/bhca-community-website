// worker/index.js
//
// Plain SPAs don't work for social previews: Facebook/Twitter/LinkedIn/WhatsApp/Slack
// crawlers fetch raw HTML and do NOT execute JavaScript, so react-helmet-async's
// injected meta tags are invisible to them. This Worker intercepts requests from
// those specific crawlers and serves correct per-route <title>/description/og:image
// tags server-side, while every normal visitor (and Googlebot, which does run JS)
// gets the untouched SPA exactly as before.

const SITE_URL = "https://beestonhill.org.uk"; // must match SEO.jsx and your live domain
const SITE_NAME = "Beeston Hill Community Association";
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Beeston Hill Community Association — events, news, volunteering and local support for residents in Beeston Hill, Leeds.";

// Crawlers that do NOT execute JavaScript and need server-rendered tags.
// Googlebot is deliberately excluded — it renders JS and reads the SPA fine.
const CRAWLER_UA_PATTERNS = [
  /facebookexternalhit/i,
  /Facebot/i,
  /Twitterbot/i,
  /LinkedInBot/i,
  /WhatsApp/i,
  /Slackbot/i,
  /TelegramBot/i,
  /Discordbot/i,
  /Pinterest/i,
  /redditbot/i,
];

// Static per-route metadata. Keep this in sync with the <SEO title=.../description=.../>
// props used on each page component — this is the same content, just available
// server-side for crawlers that can't run the React app.
//
// NOTE: /news/:slug and /events/:slug are NOT included here because their titles
// come from Supabase at runtime. Crawlers hitting those URLs currently fall through
// to the generic homepage tags below. If you want correct previews for individual
// shared articles (likely your most-shared content), this needs extending to fetch
// the article from Supabase inside the Worker — flag if you want that built next.
const ROUTE_META = {
  "/": {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  "/events": {
    title: `Events | ${SITE_NAME}`,
    description:
      "Upcoming community events in Beeston Hill — what's on, when, and how to get involved.",
  },
  "/news": {
    title: `News | ${SITE_NAME}`,
    description: "Latest news and updates from the Beeston Hill Community Association.",
  },
  "/action-plan": {
    title: `Action Plan | ${SITE_NAME}`,
    description: "Our community action plan for Beeston Hill — priorities, projects and progress.",
  },
  "/volunteer": {
    title: `Volunteer | ${SITE_NAME}`,
    description: "Get involved and volunteer with Beeston Hill Community Association.",
  },
  "/contact": {
    title: `Contact | ${SITE_NAME}`,
    description: "Get in touch with Beeston Hill Community Association.",
  },
  "/gallery": {
    title: `Gallery | ${SITE_NAME}`,
    description: "Photos from Beeston Hill community events and activities.",
  },
  "/useful-information": {
    title: `Useful Information | ${SITE_NAME}`,
    description:
      "Useful local information, services, contacts and support for residents in Beeston Hill.",
  },
  "/previous-events": {
    title: `Previous Events | ${SITE_NAME}`,
    description: "A look back at past Beeston Hill community events.",
  },
  "/submit-event": {
    title: `Submit an Event | ${SITE_NAME}`,
    description: "Submit your local event to be featured by Beeston Hill Community Association.",
  },
};

function isCrawler(userAgent) {
  if (!userAgent) return false;
  return CRAWLER_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectMeta(html, meta, canonicalUrl) {
  const { title, description, image = DEFAULT_IMAGE } = meta;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  let result = html.replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`);

  const tags = `
    <meta name="description" content="${safeDescription}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${image}">
  `;

  return result.replace("</head>", `${tags}</head>`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = request.headers.get("User-Agent") || "";
    const isAdmin = url.pathname.startsWith("/admin");

    if (isCrawler(userAgent) && !isAdmin) {
      const pathname = url.pathname.replace(/\/$/, "") || "/";
      const meta = ROUTE_META[pathname];

      if (meta) {
        const assetResponse = await env.ASSETS.fetch(request);
        const html = await assetResponse.text();
        const canonicalUrl = `${SITE_URL}${pathname}`;
        const injected = injectMeta(html, meta, canonicalUrl);

        return new Response(injected, {
          headers: { "content-type": "text/html;charset=UTF-8" },
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
