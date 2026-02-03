import { useTranslation } from "react-i18next";
import { Beef, Bird, Fish, Package, UtensilsCrossed } from "lucide-react";

const TargetAudience = () => {
  const { t } = useTranslation();
  const industries = [
    {
      icon: Beef,
      name: t("targetAudience.meat.name"),
      description: t("targetAudience.meat.desc"),
    },
    {
      icon: Bird,
      name: t("targetAudience.poultry.name"),
      description: t("targetAudience.poultry.desc"),
    },
    {
      icon: Package,
      name: t("targetAudience.semi.name"),
      description: t("targetAudience.semi.desc"),
    },
    {
      icon: UtensilsCrossed,
      name: t("targetAudience.ready.name"),
      description: t("targetAudience.ready.desc"),
    },
    {
      icon: Fish,
      name: t("targetAudience.fish.name"),
      description: t("targetAudience.fish.desc"),
    },
  ];
  return (
    <section className="py-16 lg:py-24 bg-industrial-darker relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t("targetAudience.title")} <span className="text-primary">{t("targetAudience.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("targetAudience.subtitle")}
          </p>
        </div>

        <div className="overflow-x-auto overflow-y-visible pb-4 pt-2">
          <div className="flex gap-4 min-w-full">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.name}
                  className="min-w-[240px] bg-card border border-border rounded-xl p-6 hover:border-lime/50 transition-transform duration-75 hover:-translate-y-1 hover:shadow-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-lime" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{industry.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
