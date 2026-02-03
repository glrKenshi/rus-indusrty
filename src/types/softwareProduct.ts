export type SoftwareProductId =
  | "suprem-back"
  | "wms-foodtech"
  | "mes-foodtech"
  | "server-producer";

export interface SoftwareProductFeature {
  iconKey: "Shield" | "Zap" | "BarChart3" | "Network" | "Package" | "Factory" | "Database" | "FileText";
  title: string;
  desc?: string;
  items?: string[];
  span?: "md:col-span-2";
}

export interface SoftwareProductDetail {
  title: string;
  shortDesc: string;
  description: string[];
  featuresSectionTitle: string;
  features: SoftwareProductFeature[];
  benefitsSectionTitle: string;
  benefits: string[];
  conclusion: string;
  extraSection?: {
    title: string;
    intro: string;
    items: string[];
    note?: string;
  };
  extraNote?: string;
}
