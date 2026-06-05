import { CalendarDays, Heart, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="mb-4 inline-block rounded-full bg-[#faf5ff] px-4 py-2 text-sm font-semibold text-[#5e17eb]">
            About us
          </span>

          <h2 className="mb-6 text-4xl font-black text-[#171717]">
            Supporting local people and community action
          </h2>

  <p className="mb-6 text-lg leading-relaxed text-gray-600">
  At Beeston Hill Community Association, we bring people together to create a
  stronger, more connected neighbourhood.
</p>

<p className="mb-6 text-lg leading-relaxed text-gray-600">
  We believe local people should have a strong voice in shaping the future of
  the community. Through community meetings, events, local projects and
  partnerships, we support residents, build community cohesion and create
  opportunities for people to connect and make a positive difference locally.
</p>

<p className="text-lg leading-relaxed text-gray-600">
  Join us for events, sign up for updates or volunteer with BHCA every
  contribution helps build a stronger community.
</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-purple-100 bg-[#faf8ff] p-8">
            <Users className="mb-4 h-10 w-10 text-[#5e17eb]" />
            <h3 className="mb-2 text-xl font-bold">Community-led</h3>
            <p className="text-gray-600">
              Residents helping shape local priorities and activities.
            </p>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-8">
            <Heart className="mb-4 h-10 w-10 text-[#ff914d]" />
            <h3 className="mb-2 text-xl font-bold">Community cohesion</h3>
            <p className="text-gray-600">
Bringing people of all ages and backgrounds together to build a stronger, more connected community.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-8 sm:col-span-2">
            <CalendarDays className="mb-4 h-10 w-10 text-[#5e17eb]" />
            <h3 className="mb-2 text-xl font-bold">Events and activities</h3>
            <p className="text-gray-600">
              Community meetings, local events, volunteering opportunities and
              resident engagement throughout the year.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
