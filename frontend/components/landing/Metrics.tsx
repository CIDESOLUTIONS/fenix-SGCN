import { siteConfig } from "@/config/site";

export default function Metrics() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {siteConfig.metrics.map((m, i) => (
          <div key={i}>
            <h3 className="text-3xl font-bold text-blue-600">{m.value}</h3>
            <p className="text-gray-600">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
