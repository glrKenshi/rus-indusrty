import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Warehouse, Factory, Tag } from "lucide-react";
import { SOFTWARE_PRODUCT_IDS } from "@/data/softwareProducts";
import { SoftwareProductDetailDialog } from "@/components/SoftwareProductDetailDialog";
import type { SoftwareProductId } from "@/types/softwareProduct";

const PRODUCT_ICONS = {
  "suprem-back": FileText,
  "wms-foodtech": Warehouse,
  "mes-foodtech": Factory,
  "server-producer": Tag,
} as const;

const PRODUCT_NAME_KEYS: Record<SoftwareProductId, string> = {
  "suprem-back": "softwareProducts.supremBack.name",
  "wms-foodtech": "softwareProducts.wmsFoodtech.name",
  "mes-foodtech": "softwareProducts.mesFoodtech.name",
  "server-producer": "softwareProducts.serverProducer.name",
};

const PRODUCT_DESC_KEYS: Record<SoftwareProductId, string> = {
  "suprem-back": "softwareProducts.supremBack.desc",
  "wms-foodtech": "softwareProducts.wmsFoodtech.desc",
  "mes-foodtech": "softwareProducts.mesFoodtech.desc",
  "server-producer": "softwareProducts.serverProducer.desc",
};

export default function SoftwareProducts() {
  const { t } = useTranslation();
  const [openProductId, setOpenProductId] = useState<SoftwareProductId | null>(
    null
  );

  return (
    <section id="software" className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-industrial-darker to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t("softwareProducts.title")}{" "}
            <span className="text-primary">
              {t("softwareProducts.titleHighlight")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("softwareProducts.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOFTWARE_PRODUCT_IDS.map((productId, index) => {
            const Icon = PRODUCT_ICONS[productId];
            const name = t(PRODUCT_NAME_KEYS[productId]);
            const description = t(PRODUCT_DESC_KEYS[productId]);

            return (
              <div
                key={productId}
                onClick={() => setOpenProductId(productId)}
                className="group bg-gradient-card border border-border rounded-xl p-6 hover:border-lime/50 hover:shadow-glow-lime transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none z-10">
                  <img
                    src="/rus-logo3.png"
                    alt="RUS Industry"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-lime" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-lime transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-lime transition-colors">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <SoftwareProductDetailDialog
        productId={openProductId}
        open={openProductId !== null}
        onOpenChange={(open) => !open && setOpenProductId(null)}
      />
    </section>
  );
}
