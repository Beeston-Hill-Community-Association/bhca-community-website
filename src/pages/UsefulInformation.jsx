import {
  AlertTriangle,
  Trash2,
  Siren,
  Home,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Users,
  HeartHandshake,
  Repeat,
} from "lucide-react";
import Button from "../components/ui/Button";

const usefulSections = [
  {
    heading: "Need help now?",
    text: "Emergency contacts and urgent support services.",
    cards: [
      {
        icon: Siren,
        color: "text-blue-700 bg-blue-50",
        title: "West Yorkshire Police",
        qr: "images/qr/wypreportit.png",
        items: [
          { label: "Emergency → 999", link: null },
          { label: "Non-emergency → 101", link: null },
          {
            label: "Report crime / ASB online",
            link: "https://www.westyorkshire.police.uk/report-it",
          },
          {
            label: "Leeds South NPT",
            link: "https://www.westyorkshire.police.uk/my-neighbourhood/leeds/leeds-south",
          },
        ],
      },
      {
        icon: Phone,
        color: "text-purple-600 bg-purple-50",
        title: "Emergency & Support",
        qr: "images/qr/emergency.png",
        items: [
          { label: "NHS non-emergency → 111", link: null },
          { label: "Gas emergency → 0800 111 999", link: null },
          { label: "Yorkshire Water leaks → 0800 573 553", link: null },
          {
            label: "Leeds Women’s Aid",
            link: "https://leedswomensaid.co.uk",
          },
        ],
      },
    ],
  },
  {
    heading: "Report a local issue",
    text: "Quick links for reporting problems with streets, waste, bins and local services.",
    cards: [
      {
        icon: Trash2,
        color: "text-red-600 bg-red-50",
        title: "Report Fly-Tipping",
        qr: "images/qr/flytipping.png",
        items: [
          {
            label: "Report fly-tipping online",
            link: "https://services.leeds.gov.uk/FlyTipping/ServiceRequest/Information?utrn=W34012253181",
          },
          {
            label: "More information",
            link: "https://www.leeds.gov.uk/antisocial-behaviour-and-crime/report-fly-tipping",
          },
        ],
      },
      {
        icon: AlertTriangle,
        color: "text-orange-600 bg-orange-50",
        title: "Missed Bin Collection",
        qr: "images/qr/missedbins.png",
        items: [
          {
            label: "Report a missed bin",
            link: "https://www.leeds.gov.uk/bins-and-recycling/your-bins/bin-collection-problems",
          },
          {
            label: "Check your bin day",
            link: "https://www.leeds.gov.uk/residents/bins-and-recycling/check-your-bin-day",
          },
        ],
      },
      {
        icon: Home,
        color: "text-green-600 bg-green-50",
        title: "Leeds City Council",
        qr: "images/qr/leeds-roads.png",
        items: [
          {
            label: "Main council website",
            link: "https://www.leeds.gov.uk",
          },
          {
            label: "Report potholes",
            link: "https://services.leeds.gov.uk/RoadSurfaceDamage/ServiceRequest/Information?utrn=W74172253201",
          },
          {
            label: "Report lights",
            link: "https://www.lightsoninleeds.co.uk/Public/ReportFault.aspx",
          },
          {
            label: "Report graffiti",
            link: "https://www.leeds.gov.uk/antisocial-behaviour-and-crime/report-graffiti",
          },
        ],
      },
      {
        icon: Repeat,
        color: "text-yellow-600 bg-yellow-50",
        title: "Bulky Waste & Reuse",
        qr: "images/qr/bulky.png",
        items: [
          {
            label: "Book Leeds City Council bulky collection",
            link: "https://www.leeds.gov.uk/bins-and-recycling/book-an-unwanted-items-collection",
          },
          {
            label: "St Luke’s Cares – Furniture / Clearance",
            link: "https://stlukescares.org.uk/book-a-house-clearance/",
          },
          {
            label: "Emmaus Leeds – Large Item Collection",
            link: "https://emmaus.org.uk/leeds/items-we-accept/",
          },
          {
            label: "Reuse & Repair Organisations",
            link: "https://www.zerowasteleeds.org.uk/tips/reuse-repair/",
          },
        ],
      },
    ],
  },
  {
    heading: "Community support",
    text: "Useful contacts for food support, local groups, councillors and community organisations.",
    cards: [
      {
        icon: HeartHandshake,
        color: "text-green-600 bg-green-50",
        title: "Local Food Banks & Pantries",
        qr: "images/qr/food-aid-leeds.png",
        items: [
          {
            label: "Leeds Food Aid Network",
            link: "https://leedsfoodaidnetwork.co.uk/find-emergency-food/",
          },
          {
            label: "Holbeck Foodbank",
            link: "https://holbeckfoodbank.org.uk",
          },
          {
            label: "Leeds South & East Foodbank – Beeston",
            link: "https://leedssouthandeast.foodbank.org.uk/locations/",
          },
          {
            label: "FoodCycle Leeds – Beeston & Holbeck",
            link: "https://foodcycle.org.uk/location/foodcycle-leeds-beeston/",
          },
          {
            label: "Holbeck Together Food Pantry",
            link: "https://www.holbecktogether.org/our-services/meals/",
          },
        ],
      },
      {
        icon: Mail,
        color: "text-indigo-600 bg-indigo-50",
        title: "BHCA & Local Contacts",
        qr: "images/qr/facebook.png",
        items: [
          {
            label: "Email BHCA",
            link: "mailto:contact@beestonhill.org.uk",
          },
          {
            label: "Beeston Hill Facebook Group",
            link: "https://www.facebook.com/groups/945725003377339",
          },
          {
            label: "ASHA Neighbourhood Project",
            link: "https://ashaneighbourhood.wordpress.com",
          },
          {
            label: "St Luke’s Cares",
            link: "https://stlukescares.org.uk",
          },
          {
            label: "Beeston Village Community Centre",
            link: "tel:01132770334",
          },
        ],
      },
      {
        icon: Users,
        color: "text-indigo-600 bg-indigo-50",
        title: "Hunslet & Riverside Councillors",
        qr: "images/qr/findcouncillor.png",
        items: [
          {
            label: "Cllr Paul Wray",
            link: "https://democracy.leeds.gov.uk/mgUserInfo.aspx?UID=7127",
          },
          {
            label: "Cllr Ed Carlisle",
            link: "https://democracy.leeds.gov.uk/mgUserInfo.aspx?UID=9068",
          },
          {
            label: "Cllr Mohammed Iqbal",
            link: "https://democracy.leeds.gov.uk/mgUserInfo.aspx?UID=198",
          },
        ],
      },
      {
        icon: Users,
        color: "text-indigo-600 bg-indigo-50",
        title: "Beeston & Holbeck Councillors",
        qr: "images/qr/findcouncillor.png",
        items: [
          {
            label: "Cllr Shaf Ali",
            link: "https://democracy.leeds.gov.uk/mgUserInfo.aspx?UID=9640",
          },
          {
            label: "Cllr Matt Rogan",
            link: "https://democracy.leeds.gov.uk/mgUserInfo.aspx?UID=10071",
          },
          {
            label: "Cllr Andrew Scopes",
            link: "https://democracy.leeds.gov.uk/mgUserInfo.aspx?UID=7119",
          },
        ],
      },
    ],
  },
];

function UsefulCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color}`}
        >
          <Icon className="h-9 w-9" />
        </div>

        {item.qr && (
          <div className="rounded-xl bg-gray-50 p-2">
            <img
              src={item.qr}
              alt={`QR code for ${item.title}`}
              className="h-20 w-20 rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      <h3 className="mb-5 text-2xl font-black text-[#171717]">
        {item.title}
      </h3>

      <ul className="space-y-3 text-sm">
        {item.items.map((linkItem) => (
          <li key={linkItem.label}>
            {linkItem.link ? (
              <a
                href={linkItem.link}
                target={
                  linkItem.link.startsWith("mailto:") ||
                  linkItem.link.startsWith("tel:")
                    ? undefined
                    : "_blank"
                }
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold text-gray-700 transition hover:text-[#5e17eb]"
              >
                {linkItem.label}
                {!linkItem.link.startsWith("mailto:") &&
                  !linkItem.link.startsWith("tel:") && (
                    <ExternalLink className="h-4 w-4" />
                  )}
              </a>
            ) : (
              <span className="font-semibold text-gray-800">
                {linkItem.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function UsefulInformation() {
  return (
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Useful information
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Quick links for local residents
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Report issues, find support services and access useful local
            contacts for Beeston Hill and nearby areas.
          </p>
        </div>
      </section>

      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16">
            {usefulSections.map((section) => (
              <div key={section.heading}>
                <div className="mb-8">
                  <h2 className="mb-3 text-3xl font-black text-[#171717]">
                    {section.heading}
                  </h2>

                  <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
                    {section.text}
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {section.cards.map((item) => (
                    <UsefulCard key={item.title} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="rounded-[2rem] bg-[#faf8ff] p-8 shadow-sm md:p-12">
            <MessageCircle className="mx-auto mb-6 h-16 w-16 text-[#5e17eb]" />

            <h2 className="mb-5 text-4xl font-black text-[#171717]">
              Need to speak to BHCA?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Whether it’s an issue not listed above, a question, or just to say
              hello — we’re here to help.
            </p>

            <Button to="/contact">Contact BHCA</Button>

            <p className="mt-8 text-gray-600">
              Or email us directly{" "}
              <a
                href="mailto:contact@beestonhill.org.uk"
                className="font-bold text-[#5e17eb] hover:text-[#ff914d]"
              >
                contact@beestonhill.org.uk
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}