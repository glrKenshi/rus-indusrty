import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Boxes,
  Layers3,
  Scale,
  ScanLine,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EQUIPMENT_CATALOG_ITEMS } from "@/data/equipmentCatalog";
import heroEquipment from "@/assets/hero-equipment.jpg";

const EQUIPMENT_ICONS = {
  weightLines: Scale,
  markingStations: ScanLine,
  mesWms: Layers3,
  packagingLines: Boxes,
} as const;

export default function EquipmentCatalog() {
  const { t } = useTranslation();

  return (
    <section id="equipment" className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-industrial-darker/40 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BadgeCheck size={16} />
              {t("equipmentCatalog.badge")}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t("equipmentCatalog.title")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              {t("equipmentCatalog.subtitle")}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {EQUIPMENT_CATALOG_ITEMS.map((item, index) => {
                const Icon = EQUIPMENT_ICONS[item.id as keyof typeof EQUIPMENT_ICONS];
                const hasDetails = Boolean(item.details);

                return (
                  <div
                    key={item.id}
                    className={`group bg-card border border-border rounded-xl p-5 hover:border-lime/50 hover:shadow-card transition-all relative overflow-hidden ${hasDetails ? "sm:col-span-2" : ""}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none z-10">
                      <img
                        src="/rus-logo3.png"
                        alt="RUS Industry"
                        className="w-16 h-16 object-contain"
                      />
                    </div>

                    <Link to={item.route} className="block">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="text-lime" size={22} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-lime transition-colors">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t(item.descriptionKey)}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs text-primary bg-primary/10 rounded-full px-3 py-1"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </Link>

                    {hasDetails && item.details && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-foreground mb-4">
                          {item.details.overview}
                        </p>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="capabilities" className="border-none">
                            <AccordionTrigger className="text-sm font-medium text-foreground py-2 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-lime" />
                                {t("equipmentCatalog.capabilities")}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-2 mt-2">
                                {item.details.capabilities.map((cap, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-lime mt-0.5 flex-shrink-0" />
                                    <span>{cap}</span>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="benefits" className="border-none">
                            <AccordionTrigger className="text-sm font-medium text-foreground py-2 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-lime" />
                                {t("equipmentCatalog.benefits")}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-2 mt-2">
                                {item.details.benefits.map((benefit, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-lime mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="technical" className="border-none">
                            <AccordionTrigger className="text-sm font-medium text-foreground py-2 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <BadgeCheck className="h-4 w-4 text-lime" />
                                {t("equipmentCatalog.technicalSpecs")}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-2 mt-2">
                                {item.details.technical.map((tech, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-lime mt-0.5 flex-shrink-0" />
                                    <span>{tech}</span>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-card">
              <img
                src={heroEquipment}
                alt={t("equipmentCatalog.equipmentAlt")}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card/90 backdrop-blur-sm border border-lime/40 rounded-xl px-4 py-3 shadow-glow-lime">
              <div className="text-xs text-muted-foreground">
                {t("equipmentCatalog.bundle")}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {t("equipmentCatalog.equipmentMesWms")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
