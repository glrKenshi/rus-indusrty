export interface EquipmentItemDetails {
  overview: string;
  capabilities: string[];
  benefits: string[];
  technical: string[];
}

export interface EquipmentCatalogItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  features: string[];
  route: string;
  details?: EquipmentItemDetails;
}
