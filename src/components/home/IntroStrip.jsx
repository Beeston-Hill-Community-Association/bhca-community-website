const introItems = [
  {
    label: "Community",
    title: "Resident-led",
    text: "Supporting local people, activities and projects across the Beeston Hill area.",
  },
  {
    label: "Events",
    title: "Bringing people together",
    text: "Community meetings, events, volunteering opportunities and local projects throughout the year.",
  },
  {
    label: "Action",
    title: "Local priorities",
    text: "Working together to improve safety, wellbeing and opportunities in the community.",
  },
];

export default function IntroStrip() {
  return (
    <section className="relative z-10 -mt-12 px-6">
      <div className="mx-auto grid max-w-6xl gap-6 rounded-[2rem] bg-white p-8 shadow-2xl md:grid-cols-3">
        {introItems.map((item) => (
          <div key={item.title}>
            <div className="mb-3 text-sm font-black uppercase tracking-wide text-[#ff914d]">
              {item.label}
            </div>
            <h3 className="mb-3 text-2xl font-black text-[#171717]">
              {item.title}
            </h3>
            <p className="leading-relaxed text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
