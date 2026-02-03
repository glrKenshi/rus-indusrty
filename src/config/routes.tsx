import Index from "@/pages/Index";
import Equipment from "@/pages/Equipment";
import HonestMark from "@/pages/HonestMark";
import MarkingStations from "@/pages/MarkingStations";
import WeightLines from "@/pages/WeightLines";
import MesWmsIntegration from "@/pages/MesWmsIntegration";
import PackagingLines from "@/pages/PackagingLines";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PersonalDataConsent from "@/pages/PersonalDataConsent";
import CookiePolicy from "@/pages/CookiePolicy";

export const routesConfig = [
  { path: "/", element: <Index /> },
  { path: "/equipment", element: <Equipment /> },
  { path: "/honest-mark", element: <HonestMark /> },
  { path: "/equipment/marking-stations", element: <MarkingStations /> },
  { path: "/equipment/weight-lines", element: <WeightLines /> },
  { path: "/equipment/mes-wms-integration", element: <MesWmsIntegration /> },
  { path: "/equipment/packaging-lines", element: <PackagingLines /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/personal-data-consent", element: <PersonalDataConsent /> },
  { path: "/cookie-policy", element: <CookiePolicy /> },
] as const;
