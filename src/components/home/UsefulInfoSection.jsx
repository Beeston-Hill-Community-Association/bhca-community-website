import { Link } from "react-router-dom";
import { Info, Recycle, Wrench, HeartHandshake } from "lucide-react";

export default function UsefulInfoSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          to="/useful-information"
          className="block overflow-hidden rounded-[2rem] bg-[#faf8ff] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:p-12"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#5e17eb] text-white">
                <Info className="h-10 w-10" />
              </div>

              <div className="flex-1">
                <span className="mb-3 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#5e17eb]">
                  Useful information
                </span>

                <h2 className="mb-3 text-3xl font-black text-[#171717] md:text-4xl">
                  Local services and practical support
                </h2>

                <p className="text-lg leading-relaxed text-gray-600">
                  Find recycling information, council services, local support,
                  reporting tools and other useful resources for Beeston Hill
                  residents.
                </p>
              </div>

              <div className="shrink-0 font-black text-[#ff914d]">
                View information →
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5">
                <Recycle className="mb-3 h-7 w-7 text-[#5e17eb]" />
                <h3 className="mb-1 font-black text-[#171717]">
                  Recycling & waste
                </h3>
                <p className="text-sm text-gray-600">
                  Bin collections, recycling guidance and bulky waste links.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5">
                <Wrench className="mb-3 h-7 w-7 text-[#5e17eb]" />
                <h3 className="mb-1 font-black text-[#171717]">
                  Report a problem
                </h3>
                <p className="text-sm text-gray-600">
                  Report fly-tipping, missed bins, street issues and repairs.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5">
                <HeartHandshake className="mb-3 h-7 w-7 text-[#5e17eb]" />
                <h3 className="mb-1 font-black text-[#171717]">
                  Local support
                </h3>
                <p className="text-sm text-gray-600">
                  Find community, health, housing and wellbeing support.
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}