import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

const WorkflowDiagram = () => {
  const { t } = useTranslation();
  const steps = [
    {
      step: "1",
      title: t("workflow.raw.title"),
      description: t("workflow.raw.desc"),
      system: t("workflow.raw.system"),
    },
    {
      step: "2",
      title: t("workflow.production.title"),
      description: t("workflow.production.desc"),
      system: t("workflow.production.system"),
    },
    {
      step: "3",
      title: t("workflow.packaging.title"),
      description: t("workflow.packaging.desc"),
      system: t("workflow.packaging.system"),
    },
    {
      step: "4",
      title: t("workflow.warehouse.title"),
      description: t("workflow.warehouse.desc"),
      system: t("workflow.warehouse.system"),
    },
    {
      step: "5",
      title: t("workflow.shipping.title"),
      description: t("workflow.shipping.desc"),
      system: t("workflow.shipping.system"),
    },
  ];
  return (
    <section className="py-16 lg:py-24 bg-industrial-darker relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t("workflow.title")} <span className="text-primary">{t("workflow.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("workflow.subtitle")}
          </p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden lg:flex items-center justify-between max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mb-4 hover:scale-110 hover:border-lime transition-transform">
                  <span className="text-2xl font-bold text-primary">{step.step}</span>
                </div>
                <div className="text-center max-w-[140px]">
                  <h3 className="text-lg font-semibold mb-1 text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                  <div className="text-xs font-medium text-primary bg-primary/10 rounded px-2 py-1">
                    {step.system}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="text-primary mx-4 flex-shrink-0" size={24} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={step.step}>
              <div className="bg-gradient-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center flex-shrink-0 hover:border-lime transition-colors">
                    <span className="text-xl font-bold text-primary">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    <div className="text-xs font-medium text-primary bg-primary/10 rounded px-3 py-1.5 inline-block">
                      {step.system}
                    </div>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="text-primary rotate-90" size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram;
