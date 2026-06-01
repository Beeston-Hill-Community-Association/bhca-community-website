import Button from "../components/ui/Button";

export default function Volunteer() {
  const volunteerWays = [
    "Help at community events",
    "Support clean-ups and local projects",
    "Share skills, ideas or workshops",
    "Support newsletters, photos or social media",
    "Welcome residents at meetings",
    "Help shape future community priorities",
  ];

  const quotes = [
    {
      quote:
        "Volunteering helped me meet more people locally and feel more connected to the community.",
      name: "Sarah",
    },
    {
      quote:
        "It’s great seeing events bring residents together and create a positive atmosphere.",
      name: "Ahmed",
    },
    {
      quote: "Even helping for an hour or two can make a real difference.",
      name: "Julie",
    },
  ];

  return (
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            Volunteer
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Get involved with BHCA
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Your time, ideas and energy can help make Beeston Hill stronger,
            safer and more connected.
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:items-center">
          <div>
            <span className="mb-4 inline-block rounded-full bg-[#faf8ff] px-4 py-2 text-sm font-bold text-[#5e17eb]">
              Everyone can help
            </span>

            <h2 className="mb-6 text-4xl font-black text-[#171717]">
              Volunteering doesn’t have to be formal
            </h2>

            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              Whether you can spare an hour, help at one event, share a skill or
              support a regular project, we’d love to hear from you.
            </p>

            <p className="mb-10 text-lg leading-relaxed text-gray-600">
              BHCA welcomes residents of all ages, backgrounds and experience
              levels.
            </p>

            <Button href="https://forms.gle/HdPxKtQfXRHJ3AH17">
              Fill in the volunteer form
            </Button>
          </div>

          <div className="grid gap-5">
            {volunteerWays.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-purple-100 bg-[#faf8ff] p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff914d] font-black text-white">
                  ✓
                </div>

                <p className="text-lg font-bold text-[#171717]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#faf8ff] px-4 py-2 text-sm font-bold text-[#5e17eb]">
              Community voices
            </span>

            <h2 className="mb-4 text-4xl font-black text-[#171717]">
              Why people get involved
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Local residents and volunteers helping make a difference in
              Beeston Hill.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {quotes.map((item) => (
              <div
                key={item.name}
                className="rounded-3xl bg-white p-8 shadow-sm"
              >
                <div className="mb-6 text-5xl font-black text-[#ff914d]/30">
                  “
                </div>

                <p className="mb-8 text-lg leading-relaxed text-gray-700">
                  {item.quote}
                </p>

                <div className="font-black text-[#5e17eb]">— {item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-5 text-4xl font-black text-[#171717]">
            Ready to get involved?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Complete the short volunteer form and someone from BHCA will get
            back to you.
          </p>

          <Button href="https://forms.gle/HdPxKtQfXRHJ3AH17" variant="orange">
            Volunteer with us
          </Button>
        </div>
      </section>
    </div>
  );
}