export type ChatRole = "engineer" | "tech" | "consultant";

export type AvatarState = "idle" | "typing" | "answering";

export type MenuLevel =
  | "root"
  | "equipment"
  | "equipment_marking"
  | "equipment_weight"
  | "equipment_packaging"
  | "software"
  | "service"
  | "design";

export type ChatTopic =
  | "unknown"
  | "equipment"
  | "software"
  | "service"
  | "design";

export interface ChatMessage {
  id: string;
  role: string;
  text: string;
}

export interface TechSpec {
  product?: string;
  speed?: string;
  marking?: boolean;
  mes?: boolean;
  equipmentType?: string;
  problem?: string;
  packaging?: string;
  weightRange?: string;
  linesCount?: string;
  erpExists?: boolean;
}
