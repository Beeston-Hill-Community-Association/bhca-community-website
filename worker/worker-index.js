// worker/index.js
//
// Plain SPAs don't work for social previews: Facebook/Twitter/LinkedIn/WhatsApp/Slack
// crawlers fetch raw HTML and do NOT execute JavaScript, so react-helmet-async's
// injected meta tags are invisible to them. This Worker intercepts requests from
// those specific crawlers and serves correct per-route <title>/description/og:image
// tags server-side, while every normal visitor (and Googlebot, which does run JS)
// gets the untouched SPA exactly as before.
//
// Static pages use a hardcoded lookup table. Dynamic article pages (/events/:slug,
// /news/:slug) query Supabase's REST API directly for the live title/description/image.

const SITE_URL = "https://beestonhill.org.uk"; // must match SEO.jsx and your live domain
const SITE_NAME = "Beeston Hill Community Association";
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Beeston Hill Community Association — events, news, volunteering and local support for residents in Beeston Hill, Leeds.";

// Public anon key — same one already shipped in your browser bundle via
// src/lib/supabaseClient.js. Protection comes from Supabase Row Level Security
// policies on each table, not secrecy of this key.
const SUPABASE_URL = "https://mktwyympnbvvxxvlklwh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdHd5eW1wbmJ2dnh4dmxrbHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDY2NzAsImV4cCI6MjA3NzQyMjY3MH0.gXbLfJ7iBn8FWDRtZfbdKwTROwkDQJKsvkyikXTYpHo";

const SUPABASE_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

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

// Static per-route metadata for non-dynamic pages. Keep in sync with the
// <SEO title=.../description=.../> props used on each page component.
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

function truncate(str, maxLength = 160) {
  if (!str) return "";
  const clean = String(str).trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1).trim()}…` : clean;
}

// Fetch a single event by slug from Supabase REST API
async function fetchEventMeta(slug) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/events?slug=eq.${encodeURIComponent(
        slug
      )}&select=title,description,full_description,image_url&limit=1`,
      { headers: SUPABASE_HEADERS }
    );
    if (!res.ok) return null;

    const rows = await res.json();
    const event = rows[0];
    if (!event) return null;

    return {
      title: `${event.title} | ${SITE_NAME}`,
      description: truncate(event.description || event.full_description) || DEFAULT_DESCRIPTION,
      image: event.image_url || DEFAULT_IMAGE,
    };
  } catch (err) {
    console.error("fetchEventMeta error:", err);
    return null;
  }
}

// Fetch a single news article by slug, then resolve its image via the media table
async function fetchNewsMeta(slug) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/newsletters?slug=eq.${encodeURIComponent(
        slug
      )}&select=title,excerpt,content,image_id&limit=1`,
      { headers: SUPABASE_HEADERS }
    );
    if (!res.ok) return null;

    const rows = await res.json();
    const article = rows[0];
    if (!article) return null;

    let image = DEFAULT_IMAGE;

    if (article.image_id) {
      const mediaRes = await fetch(
        `${SUPABASE_URL}/rest/v1/media?id=eq.${article.image_id}&select=url&limit=1`,
        { headers: SUPABASE_HEADERS }
      );
      if (mediaRes.ok) {
        const mediaRows = await mediaRes.json();
        if (mediaRows[0]?.url) image = mediaRows[0].url;
      }
    }

    return {
      title: `${article.title} | ${SITE_NAME}`,
      description: truncate(article.excerpt || article.content) || DEFAULT_DESCRIPTION,
      image,
    };
  } catch (err) {
    console.error("fetchNewsMeta error:", err);
    return null;
  }
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
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${image}">
  `;

  return result.replace("</head>", `${tags}</head>`);
}
// Handles contact form submissions from the React contact page.
// The browser posts to /api/contact, then this Worker sends the email using
// Resend. The RESEND_API_KEY is stored securely as a Cloudflare Worker secret,
// never in the React frontend.
async function handleContactForm(request, env) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return new Response("Missing required fields", { status: 400 });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BHCA Website <contact@beestonhill.org.uk>",
        to: ["contact@beestonhill.org.uk"],
        reply_to: email,
        subject: `Website enquiry: ${subject}`,
        html: `
          <h2>New website enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error("Resend error:", error);
      return new Response("Email failed", { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response("Bad request", { status: 400 });
  }
}

    export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    return new Response(`Worker reached: ${url.pathname}`, {
  status: 200,
  headers: { "content-type": "text/plain" },
});
    
 if (url.pathname === "/api/contact") {
  return handleContactForm(request, env);
}

    

    // Redirect any legacy/typo .html links (e.g. from an old static site,
    // stale bookmarks, or shared links) to the clean route. React Router
    // has no matching route for these, so without this they silently fall
    // through to the 404 page.
    if (url.pathname.endsWith(".html")) {
      const cleanPath = url.pathname.slice(0, -".html".length) || "/";
      return Response.redirect(`${url.origin}${cleanPath}${url.search}`, 301);
    }

    const userAgent = request.headers.get("User-Agent") || "";
    const isAdmin = url.pathname.startsWith("/admin");

    if (isCrawler(userAgent) && !isAdmin) {
      const pathname = url.pathname.replace(/\/$/, "") || "/";

      let meta = ROUTE_META[pathname];

      if (!meta) {
        const eventMatch = pathname.match(/^\/events\/([^/]+)$/);
        const newsMatch = pathname.match(/^\/news\/([^/]+)$/);

        if (eventMatch) {
          meta = await fetchEventMeta(eventMatch[1]);
        } else if (newsMatch) {
          meta = await fetchNewsMeta(newsMatch[1]);
        }
      }

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
