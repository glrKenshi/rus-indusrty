import { X } from "lucide-react";
import {
  FileText,
  Warehouse,
  Factory,
  Tag,
  Shield,
  Zap,
  BarChart3,
  Network,
  CheckCircle2,
  Award,
  Package,
  Database,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getSoftwareProductDetail } from "@/data/softwareProducts";
import type { SoftwareProductId } from "@/types/softwareProduct";

const PRODUCT_ICONS = {
  "suprem-back": FileText,
  "wms-foodtech": Warehouse,
  "mes-foodtech": Factory,
  "server-producer": Tag,
} as const;

const FEATURE_ICONS = {
  Shield,
  Zap,
  BarChart3,
  Network,
  Package,
  Factory,
  Database,
  FileText,
} as const;

interface SoftwareProductDetailDialogProps {
  productId: SoftwareProductId | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SoftwareProductDetailDialog({
  productId,
  open,
  onOpenChange,
}: SoftwareProductDetailDialogProps) {
  if (!productId) return null;

  const detail = getSoftwareProductDetail(productId);
  const Icon = PRODUCT_ICONS[productId];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none [&>button]:hidden">
        <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-2xl shadow-black/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none" />

          <div className="relative z-10 p-6 lg:p-8 border-b border-white/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="text-lime" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    {detail.title}
                  </h2>
                  <p className="text-muted-foreground text-sm lg:text-base">
                    {detail.shortDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition-colors flex-shrink-0"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative z-10 p-6 lg:p-8 space-y-8">
            <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
              {detail.description.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-muted-foreground leading-relaxed text-base mt-4 first:mt-0"
                >
                  {paragraph.startsWith(detail.title) ? (
                    <>
                      <strong className="text-lime">{detail.title}</strong>
                      {paragraph.slice(detail.title.length).trimStart()}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>

            <div>
              <h3 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-lime" />
                {detail.featuresSectionTitle}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {detail.features.map((feature, idx) => {
                  const FeatureIcon =
                    FEATURE_ICONS[feature.iconKey as keyof typeof FEATURE_ICONS];
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 p-5 hover:border-lime/50 transition-all ${feature.span ?? ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FeatureIcon className="text-lime" size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-foreground">
                            {feature.title}
                          </h4>
                          {feature.desc && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.desc}
                            </p>
                          )}
                          {feature.items && (
                            <ul className="space-y-2 mt-2">
                              {feature.items.map((item, itemIdx) => (
                                <li
                                  key={itemIdx}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-lime mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {detail.extraNote && (
                <div className="mt-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-sm text-muted-foreground italic">
                    {detail.extraNote}
                  </p>
                </div>
              )}
            </div>

            {detail.extraSection && (
              <div>
                <h3 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-lime" />
                  {detail.extraSection.title}
                </h3>
                <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-6">
                  <p className="text-muted-foreground leading-relaxed text-base mb-4">
                    <strong className="text-lime">{detail.title}</strong>{" "}
                    {detail.extraSection.intro.replace(detail.title, "").trim()}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {detail.extraSection.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="h-5 w-5 text-lime mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  {detail.extraSection.note && (
                    <div className="mt-4 rounded-lg backdrop-blur-xl bg-primary/5 border border-lime/10 p-3">
                      <p className="text-xs text-muted-foreground italic">
                        {detail.extraSection.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-3">
                <Award className="h-6 w-6 text-lime" />
                {detail.benefitsSectionTitle}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {detail.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-lime mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl backdrop-blur-xl bg-primary/10 border border-lime/20 p-6">
              <p className="text-foreground leading-relaxed text-base">
                {detail.conclusion.startsWith(detail.title) ? (
                  <>
                    <strong className="text-lime">{detail.title}</strong>
                    {detail.conclusion.slice(detail.title.length).trimStart()}
                  </>
                ) : (
                  detail.conclusion
                )}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

