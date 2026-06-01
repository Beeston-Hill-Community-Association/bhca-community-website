import Button from "../ui/Button";
import { actionPlan } from "../../data/actionPlanData";

const featuredPriority = actionPlan.find((item) => item.featured);
const otherPriorities = actionPlan.filter((item) => !item.featured).slice(0, 3);

export default function ActionPlanSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#5e17eb] shadow-sm">
            Community Action Plan
          </span>

          <h2 className="mb-6 text-4xl font-black leading-tight text-[#171717] md:text-5xl">
            Turning resident concerns into action
          </h2>

          <p className="text-lg leading-relaxed text-gray-600">
            Our Community Action Plan was created from local resident feedback
            and sets clear targets for the council, police and local partners.
          </p>
        </div>

        {featuredPriority && (
          <div className="mb-8 rounded-[2rem] bg-[#5e17eb] p-8 text-white shadow-xl md:p-12">
            <div className="mb-6 text-6xl font-black text-white/20">
              {featuredPriority.number}
            </div>

            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide">
              Featured priority • {featuredPriority.status}
            </span>

            <h3 className="mb-5 text-3xl font-black md:text-4xl">
              {featuredPriority.title}
            </h3>

            <p className="mb-6 max-w-3xl text-lg leading-relaxed text-white/80">
              {featuredPriority.description}
            </p>

            <p className="font-bold text-[#ff914d]">
              Target: {featuredPriority.target}
            </p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {otherPriorities.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl bg-[#faf8ff] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 text-5xl font-black text-[#ff914d]/30">
                {item.number}
              </div>

              <span className="mb-4 inline-block rounded-full bg-[#faf8ff] px-3 py-1 text-xs font-bold text-[#5e17eb]">
                {item.status}
              </span>

              <h3 className="mb-4 text-2xl font-black text-[#171717]">
                {item.title}
              </h3>

              <p className="mb-6 leading-relaxed text-gray-600">
                {item.description}
              </p>

              <p className="text-sm font-bold text-[#5e17eb]">
                Target: {item.target}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Button to="/action-plan" variant="primary">
            Read the Action Plan
          </Button>

          <Button to="/contact" variant="outline">
            Share your priorities
          </Button>
        </div>
      </div>
    </section>
  );
}