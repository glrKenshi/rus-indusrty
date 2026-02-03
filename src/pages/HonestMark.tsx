"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type DragEvent,
} from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Settings,
  Package,
  Factory,
  Truck,
  ShoppingCart,
  Database,
  Network,
  FileText,
  Key,
  Users,
  Target,
  ArrowRight,
  Beer,
  Milk,
  Droplet,
  Coffee,
  Wheat,
  Candy,
  UtensilsCrossed,
  Fish,
  Shirt,
  Footprints,
  Sparkles,
  Baby,
  Bike,
  Wrench,
  Pill,
  Stethoscope,
  Heart,
  Syringe,
  PillBottle,
  Bandage,
  Camera,
  Cpu,
  Car,
  PawPrint,
  Building2,
  Warehouse,
  Store,
  Server,
  Code,
  Layers,
  AlertCircle,
  DollarSign,
  Rocket,
  Minus,
  BarChart3,
  Activity,
  ClipboardCheck,
  Boxes,
  Fingerprint,
  LayoutDashboard,
  MoveRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Role = "producer" | "importer" | "wholesale" | "retail";
type RiskLevel = "low" | "mid" | "high";

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const cn = (...args: Array<string | boolean | undefined | null>) =>
  args.filter(Boolean).join(" ");

/** ---------- Micro: custom cursor ---------- */
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [down, setDown] = useState(false);

  useEffect(() => {
    const mm = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const md = () => setDown(true);
    const mu = () => setDown(false);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mousedown", md);
    window.addEventListener("mouseup", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mousedown", md);
      window.removeEventListener("mouseup", mu);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/50 backdrop-blur-sm",
          "transition-[width,height,opacity,transform] duration-150 ease-out",
          down ? "w-10 h-10 opacity-80" : "w-6 h-6 opacity-60"
        )}
        style={{ left: pos.x, top: pos.y }}
      />
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/20",
          "transition-[width,height,opacity,transform] duration-200 ease-out"
        )}
        style={{
          left: pos.x,
          top: pos.y,
          width: down ? 6 : 4,
          height: down ? 6 : 4,
          opacity: down ? 0.9 : 0.7,
        }}
      />
    </div>
  );
}

/** ---------- Micro: magnetic button ---------- */
function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      setT({ x: dx * 0.18, y: dy * 0.18 });
    };
    const onLeave = () => setT({ x: 0, y: 0 });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold",
        "bg-lime text-background shadow-glow-lime hover:opacity-95 active:opacity-90",
        "transition-transform duration-150 will-change-transform",
        className
      )}
      style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0)` }}
    >
      <span className="absolute inset-0 rounded-xl shimmer-mask opacity-0 hover:opacity-100 transition-opacity" />
      {children}
    </button>
  );
}
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full bg-lime/70" style={{ width: `${clamp(value, 0, 100)}%` }} />
    </div>
  );
}

function RiskPill({ risk }: { risk: RiskLevel }) {
  const { t } = useTranslation();
  const map = {
    low: { label: t("honestMark.riskLow"), cls: "bg-lime/15 border-lime/25 text-lime" },
    mid: {
      label: t("honestMark.riskMid"),
      cls: "bg-orange-500/15 border-orange-500/25 text-orange-300",
    },
    high: { label: t("honestMark.riskHigh"), cls: "bg-red-500/15 border-red-500/25 text-red-300" },
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border", map[risk].cls)}>
      <AlertTriangle className="h-4 w-4" />
      {map[risk].label}
    </span>
  );
}

function estimate({
  role,
  sku,
  locations,
  hasEdo,
  has1c,
  hasScanners,
  categoriesCount,
}: {
  role: Role;
  sku: number;
  locations: number;
  hasEdo: boolean;
  has1c: boolean;
  hasScanners: boolean;
  categoriesCount: number;
}) {
  const baseWeeks = role === "producer" || role === "importer" ? 6 : 4;
  const complexity = clamp(1 + sku / 600 + locations / 60 + categoriesCount / 10, 1, 2.1);
  const itFactor = (hasEdo ? 0.9 : 1.12) * (has1c ? 0.9 : 1.18) * (hasScanners ? 0.95 : 1.08);
  const weeks = Math.ceil(baseWeeks * complexity * itFactor);

  const riskScore =
    (hasEdo ? 0 : 25) +
    (has1c ? 0 : 25) +
    (hasScanners ? 0 : 10) +
    (sku > 800 ? 15 : sku > 300 ? 10 : 5) +
    (locations > 10 ? 10 : locations > 3 ? 6 : 3) +
    (categoriesCount > 3 ? 10 : 5);

  const risk: RiskLevel = riskScore >= 60 ? "high" : riskScore >= 35 ? "mid" : "low";

  const budgetBase = role === "producer" || role === "importer" ? 220 : 140;
  const budget = Math.round(budgetBase * complexity * itFactor);
  const budgetRange = [Math.round(budget * 0.85), Math.round(budget * 1.2)];
  const earlySavings = clamp(
    Math.round((weeks >= 10 ? 35 : weeks >= 7 ? 28 : 18) + (hasEdo ? 4 : 0)),
    15,
    45
  );

  return { weeks, risk, riskScore: clamp(riskScore, 0, 100), budgetRange, earlySavings };
}

function ImplementationCalculator({ onOpenDemo }: { onOpenDemo: () => void }) {
  const { t } = useTranslation();
  const [role, setRole] = useState<Role>("retail");
  const [sku, setSku] = useState(250);
  const [locations, setLocations] = useState(2);
  const [categoriesCount, setCategoriesCount] = useState(2);
  const [hasEdo, setHasEdo] = useState(false);
  const [has1c, setHas1c] = useState(true);
  const [hasScanners, setHasScanners] = useState(true);

  const res = useMemo(
    () => estimate({ role, sku, locations, hasEdo, has1c, hasScanners, categoriesCount }),
    [role, sku, locations, hasEdo, has1c, hasScanners, categoriesCount]
  );

  return (
    <Card className="border-lime/25 bg-white/5 backdrop-blur-xl overflow-hidden shimmer-card">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-lime" />
            {t("honestMark.calculatorTitle")}
          </CardTitle>
          <RiskPill risk={res.risk} />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">{t("honestMark.role")}</div>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["producer", t("honestMark.producer")],
                ["importer", t("honestMark.importer")],
                ["wholesale", t("honestMark.wholesale")],
                ["retail", t("honestMark.retail")],
              ] as Array<[Role, string]>).map(([k, label]) => (
                <button
                  key={k}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm transition-all",
                    role === k
                      ? "border-lime/50 bg-lime/10 text-lime"
                      : "border-white/10 bg-white/5 hover:border-lime/30"
                  )}
                  onClick={() => setRole(k)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">{t("honestMark.sku")}</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={2000}
                value={sku}
                onChange={(e) => setSku(Number(e.target.value))}
                className="w-full accent-lime"
              />
              <div className="min-w-[72px] text-right font-semibold">{sku}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">{t("honestMark.locations")}</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={60}
                value={locations}
                onChange={(e) => setLocations(Number(e.target.value))}
                className="w-full accent-lime"
              />
              <div className="min-w-[72px] text-right font-semibold">{locations}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-lime" />
                  {t("honestMark.itReadiness")}
                </div>
                <div className="text-xs text-muted-foreground">{t("honestMark.scoring")}: {res.riskScore}/100</div>
              </div>
              <ProgressBar value={100 - res.riskScore} />

              <div className="grid grid-cols-2 gap-2">
                <button
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all",
                    has1c ? "border-lime/40 bg-lime/10" : "border-white/10 bg-white/5 hover:border-lime/25"
                  )}
                  onClick={() => setHas1c((v) => !v)}
                >
                  <span className="text-muted-foreground">{t("honestMark.has1c")}</span>
                  {has1c ? <CheckCircle2 className="h-4 w-4 text-lime" /> : <XCircle className="h-4 w-4 text-red-300" />}
                </button>

                <button
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all",
                    hasEdo ? "border-lime/40 bg-lime/10" : "border-white/10 bg-white/5 hover:border-lime/25"
                  )}
                  onClick={() => setHasEdo((v) => !v)}
                >
                  <span className="text-muted-foreground">{t("honestMark.hasEdo")}</span>
                  {hasEdo ? <CheckCircle2 className="h-4 w-4 text-lime" /> : <XCircle className="h-4 w-4 text-red-300" />}
                </button>

                <button
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all",
                    hasScanners ? "border-lime/40 bg-lime/10" : "border-white/10 bg-white/5 hover:border-lime/25"
                  )}
                  onClick={() => setHasScanners((v) => !v)}
                >
                  <span className="text-muted-foreground">{t("honestMark.hasScanners")}</span>
                  {hasScanners ? <CheckCircle2 className="h-4 w-4 text-lime" /> : <XCircle className="h-4 w-4 text-red-300" />}
                </button>

                <div className="col-span-2 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-sm text-muted-foreground">{t("honestMark.markingCategories")}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:border-lime/30"
                      onClick={() => setCategoriesCount((v) => clamp(v - 1, 1, 6))}
                    >
                      −
                    </button>
                    <div className="w-10 text-center font-semibold">{categoriesCount}</div>
                    <button
                      className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:border-lime/30"
                      onClick={() => setCategoriesCount((v) => clamp(v + 1, 1, 6))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lime/25 bg-lime/5 backdrop-blur-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-lime" />
                  {t("honestMark.projectSummary")}
                </div>
                <span className="text-xs text-muted-foreground">{t("honestMark.estimate")}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-lime/20 bg-white/5 p-3">
                  <div className="text-xs text-muted-foreground">{t("honestMark.deadline")}</div>
                  <div className="text-2xl font-bold text-lime">{res.weeks}</div>
                  <div className="text-xs text-muted-foreground">{t("honestMark.weeks")}</div>
                </div>
                <div className="rounded-xl border border-lime/20 bg-white/5 p-3">
                  <div className="text-xs text-muted-foreground">{t("honestMark.savings")}</div>
                  <div className="text-2xl font-bold text-lime">{t("honestMark.upTo")} {res.earlySavings}%</div>
                  <div className="text-xs text-muted-foreground">{t("honestMark.earlyStart")}</div>
                </div>
                <div className="rounded-xl border border-lime/20 bg-white/5 p-3">
                  <div className="text-xs text-muted-foreground">{t("honestMark.budget")}</div>
                  <div className="text-lg font-bold text-lime">
                    {res.budgetRange[0]}–{res.budgetRange[1]}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("honestMark.thousandRub")}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">{t("honestMark.openDemoQuestion")}</div>
                <MagneticButton onClick={onOpenDemo} className="px-5 py-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {t("honestMark.demoPanel")}
                  <MoveRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------- DataMatrix demo ---------- */
function hashSeed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function genMatrix(seed: number, size = 22) {
  const m: boolean[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
  let x = seed || 1;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      m[r][c] = (x & 1) === 1;
    }
  }

  for (let i = 0; i < size; i++) {
    m[0][i] = true;
    m[size - 1][i] = i % 2 === 0;
    m[i][0] = true;
    m[i][size - 1] = i % 2 === 0;
  }
  return m;
}

function DataMatrixDemo() {
  const { t } = useTranslation();
  const [text, setText] = useState(t("honestMark.food2")); // default example
  const [scanning, setScanning] = useState(false);

  const seed = useMemo(() => hashSeed(text), [text]);
  const matrix = useMemo(() => genMatrix(seed, 22), [seed]);
  const code = useMemo(() => `DM-${seed.toString(16).toUpperCase().slice(0, 10)}-${text.length}`, [seed, text.length]);

  const scan = () => {
    setScanning(true);
    window.setTimeout(() => setScanning(false), 1400);
  };

  return (
    <Card className="border-lime/25 bg-white/5 backdrop-blur-xl shimmer-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-6 w-6 text-lime" />
          {t("honestMark.datamatrixTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {t("honestMark.datamatrixHint")}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-muted-foreground mb-2">{t("honestMark.codeData")}</div>
              <input
                className="w-full rounded-lg bg-background/40 border border-white/10 px-3 py-2 outline-none focus:border-lime/40"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("honestMark.code")}</span>
                <span className="font-mono text-lime">{code}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <MagneticButton onClick={scan} className="px-5 py-2">
                <ScanLine className="h-4 w-4" />
                {t("honestMark.scan")}
              </MagneticButton>
              <button
                className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-lime/30 transition-all"
                onClick={() => setText(t("honestMark.food2"))}
              >
                {t("honestMark.example")}
              </button>
            </div>

            <div className={cn("rounded-xl border p-4 transition-all", scanning ? "border-lime/40 bg-lime/10" : "border-white/10 bg-white/5")}>
              <div className="flex items-center gap-2 font-semibold">
                {scanning ? <Activity className="h-5 w-5 text-lime animate-pulse" /> : <CheckCircle2 className="h-5 w-5 text-lime" />}
                {scanning ? t("honestMark.scanning") : t("honestMark.validation")}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {scanning ? t("honestMark.scanningDesc") : t("honestMark.validDesc")}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center justify-center overflow-hidden">
              <div className="relative">
                <div className={cn("grid gap-[2px] p-3 bg-white rounded-xl", scanning && "ring-2 ring-lime/50")} style={{ gridTemplateColumns: `repeat(${matrix.length}, 1fr)` }}>
                  {matrix.flatMap((row, r) =>
                    row.map((cell, c) => (
                      <div key={`${r}-${c}`} className={cn("w-[8px] h-[8px] rounded-[1px]", cell ? "bg-black" : "bg-white")} />
                    ))
                  )}
                </div>
                <div className={cn("scanline", scanning ? "opacity-100" : "opacity-0")} />
              </div>
            </div>

            <div className="mt-3 text-xs text-muted-foreground text-center">
              {t("honestMark.demoNote")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
/** ✅ BLOCK 3/4 — SupplyChainSimulator + ComparisonSlider + CasesDoAfter + DemoDashboard */

type BoxItem = {
  id: string;
  nameKey: string;
  sku: string;
  stage: "production" | "warehouse" | "retail";
  scanned: boolean;
};

/** ---------- TOP #3: Supply chain simulator (drag & drop) ---------- */
function SupplyChainSimulator() {
  const { t } = useTranslation();
  const [items, setItems] = useState<BoxItem[]>([
    { id: "b1", nameKey: "simItem1", sku: "1042", stage: "production", scanned: false },
    { id: "b2", nameKey: "simItem2", sku: "221", stage: "production", scanned: false },
    { id: "b3", nameKey: "simItem3", sku: "77", stage: "warehouse", scanned: true },
  ]);
  const [toast, setToast] = useState<string | null>(null);

  const stages = useMemo(
    () => [
      {
        key: "production" as const,
        title: t("honestMark.stageProduction"),
        icon: Factory,
        hint: t("honestMark.stageProductionHint"),
      },
      {
        key: "warehouse" as const,
        title: t("honestMark.stageWarehouse"),
        icon: Truck,
        hint: t("honestMark.stageWarehouseHint"),
      },
      {
        key: "retail" as const,
        title: t("honestMark.stageRetail"),
        icon: Store,
        hint: t("honestMark.stageRetailHint"),
      },
    ],
    [t]
  );

  const onDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, stage: BoxItem["stage"]) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, stage } : it)));
  };

  const toastMsg = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  };

  const scanItem = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, scanned: true } : it)));
    toastMsg(t("honestMark.scanOk"));
  };

  const sellItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    toastMsg(t("honestMark.soldOut"));
  };

  const stageItems = (stage: BoxItem["stage"]) => items.filter((it) => it.stage === stage);

  return (
    <Card className="border-lime/25 bg-white/5 backdrop-blur-xl shimmer-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Boxes className="h-6 w-6 text-lime" />
          {t("honestMark.simulatorTitle")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground mb-5">
          {t("honestMark.simulatorHint")}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {stages.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-[260px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e as unknown as DragEvent<HTMLDivElement>, st.key)}
              >
                <div className="mb-3 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon className="h-5 w-5 text-lime shrink-0" />
                    {st.title}
                  </div>
                  <p className="text-xs text-muted-foreground">{st.hint}</p>
                </div>

                <div className="space-y-2">
                  {stageItems(st.key).map((it) => (
                    <div
                      key={it.id}
                      draggable
                      onDragStart={(e) => onDragStart(e as unknown as DragEvent<HTMLDivElement>, it.id)}
                      className={cn(
                        "group rounded-xl border px-3 py-2 cursor-grab active:cursor-grabbing transition-all bg-background/40",
                        it.scanned
                          ? "border-lime/25 hover:border-lime/40"
                          : "border-red-500/25 hover:border-red-500/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{t(`honestMark.${it.nameKey}`)} / SKU-{it.sku}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-1">
                            {it.scanned ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-lime" /> {t("honestMark.codeConfirmed")}
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-3.5 w-3.5 text-red-300" /> {t("honestMark.noVerification")}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          {!it.scanned && (
                            <button
                              onClick={() => scanItem(it.id)}
                              className="text-xs px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:border-lime/30"
                            >
                              {t("honestMark.scan")}
                            </button>
                          )}
                          {it.stage === "retail" && (
                            <button
                              onClick={() => sellItem(it.id)}
                              className="text-xs px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:border-lime/30"
                            >
                              {t("honestMark.sell")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageItems(st.key).length === 0 && (
                    <div className="text-xs text-muted-foreground border border-dashed border-white/10 rounded-xl p-4 text-center">
                      {t("honestMark.dragHere")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-lime" />
            {t("honestMark.simulatorTip")}
          </div>

          {toast && (
            <div className="text-xs rounded-full px-4 py-2 border border-lime/25 bg-lime/10 text-lime">
              {toast}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------- TOP #8: Comparison slider ---------- */
function ComparisonSlider() {
  const { t } = useTranslation();
  const [v, setV] = useState(50);

  const left = {
    title: t("honestMark.selfManaged"),
    items: [
      t("honestMark.compareLeft1"),
      t("honestMark.compareLeft2"),
      t("honestMark.compareLeft3"),
      t("honestMark.compareLeft4"),
    ],
  };

  const right = {
    title: t("honestMark.turnkey"),
    items: [
      t("honestMark.compareRight1"),
      t("honestMark.compareRight2"),
      t("honestMark.compareRight3"),
      t("honestMark.compareRight4"),
    ],
  };

  return (
    <Card className="border-lime/25 bg-white/5 backdrop-blur-xl shimmer-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-lime" />
          {t("honestMark.compareTitle")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        <div className="text-sm text-muted-foreground">
          {t("honestMark.compareHint")}
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-5">
              <div className="font-semibold mb-3 flex items-center gap-2 text-red-300">
                <XCircle className="h-5 w-5" />
                {left.title}
              </div>
              <ul className="space-y-2 text-sm">
                {left.items.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Minus className="h-4 w-4 text-red-300 mt-0.5" />
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5">
              <div className="font-semibold mb-3 flex items-center gap-2 text-lime">
                <CheckCircle2 className="h-5 w-5" />
                {right.title}
              </div>
              <ul className="space-y-2 text-sm">
                {right.items.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-lime mt-0.5" />
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* overlay-reveal */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 100%)",
              clipPath: `polygon(${v}% 0, 100% 0, 100% 100%, ${v}% 100%)`,
            }}
          />

          <div
            className="absolute top-0 bottom-0 w-[2px] bg-lime/70 pointer-events-none"
            style={{ left: `${v}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-lime/40 bg-background/60 backdrop-blur flex items-center justify-center pointer-events-none"
            style={{ left: `calc(${v}% - 20px)` }}
          >
            <ArrowRight className="h-4 w-4 text-lime" />
          </div>

          <input
            type="range"
            min={10}
            max={90}
            value={v}
            onChange={(e) => setV(Number(e.target.value))}
            className="absolute inset-x-4 bottom-4 accent-lime"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { label: t("honestMark.riskErrors"), value: clamp(100 - v, 10, 90), icon: AlertTriangle },
            { label: t("honestMark.teamLoad"), value: clamp(110 - v, 15, 95), icon: Users },
            { label: t("honestMark.launchSpeed"), value: clamp(v, 10, 90), icon: Rocket },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Icon className="h-4 w-4 text-lime" />
                    {m.label}
                  </div>
                  <div className="text-sm font-semibold">{m.value}%</div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={m.value} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------- TOP #9: Cases before/after ---------- */
function CasesDoAfter() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"before" | "after">("after");

  const cases = [
    {
      title: t("honestMark.case1Title"),
      before: [t("honestMark.case1Before1"), t("honestMark.case1Before2"), t("honestMark.case1Before3"), t("honestMark.case1Before4")],
      after: [t("honestMark.case1After1"), t("honestMark.case1After2"), t("honestMark.case1After3"), t("honestMark.case1After4")],
      metrics: [
        { label: t("honestMark.case1Metric1"), value: "−45%" },
        { label: t("honestMark.case1Metric2"), value: "−38%" },
        { label: t("honestMark.case1Metric3"), value: "−60%" },
      ],
    },
    {
      title: t("honestMark.case2Title"),
      before: [t("honestMark.case2Before1"), t("honestMark.case2Before2"), t("honestMark.case2Before3")],
      after: [t("honestMark.case2After1"), t("honestMark.case2After2"), t("honestMark.case2After3")],
      metrics: [
        { label: t("honestMark.case2Metric1"), value: "−30%" },
        { label: t("honestMark.case2Metric2"), value: "−55%" },
        { label: t("honestMark.case2Metric3"), value: "+22%" },
      ],
    },
  ];

  return (
    <Card className="border-lime/25 bg-white/5 backdrop-blur-xl shimmer-card overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-lime" />
            {t("honestMark.casesTitle")}
          </CardTitle>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            {[
              { k: "before" as const, label: t("honestMark.before") },
              { k: "after" as const, label: t("honestMark.after") },
            ].map((item) => (
              <button
                key={item.k}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-all",
                  mode === item.k
                    ? "bg-lime/15 text-lime border border-lime/30"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMode(item.k)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {cases.map((c, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="font-semibold mb-3">{c.title}</div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "rounded-xl border p-3",
                    mode === "before"
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-white/10 bg-background/30"
                  )}
                >
                  <div className="text-xs font-semibold text-red-300 flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4" />
                    {t("honestMark.before")}
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {c.before.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Minus className="h-4 w-4 text-red-300 mt-0.5" />
                        <span className="text-muted-foreground">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={cn(
                    "rounded-xl border p-3",
                    mode === "after" ? "border-lime/30 bg-lime/5" : "border-white/10 bg-background/30"
                  )}
                >
                  <div className="text-xs font-semibold text-lime flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {t("honestMark.after")}
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {c.after.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-lime mt-0.5" />
                        <span className="text-muted-foreground">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {c.metrics.map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-background/30 p-3 text-center">
                    <div className="text-[11px] text-muted-foreground">{m.label}</div>
                    <div className="text-lg font-bold text-lime">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          {t("honestMark.casesNote")}
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------- TOP #10: Demo dashboard modal ---------- */
function DemoDashboard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"overview" | "docs" | "alerts">("overview");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const kpis = [
    { label: t("honestMark.kpi1c"), value: "OK", icon: Settings, tone: "text-lime" },
    { label: t("honestMark.kpiEdo"), value: "OK", icon: Network, tone: "text-lime" },
    { label: t("honestMark.kpiOfd"), value: "Тест", icon: Store, tone: "text-orange-300" },
    { label: t("honestMark.kpiUpd"), value: "12", icon: FileText, tone: "text-foreground" },
  ];

  const docs = [
    { id: "UPD-1271", status: t("honestMark.docStatus1"), owner: t("honestMark.docOwner1"), age: "18 мин" },
    { id: "UPD-1270", status: t("honestMark.docStatus2"), owner: t("honestMark.docOwner2"), age: "1 ч" },
    { id: "UPD-1269", status: t("honestMark.docStatus3"), owner: t("honestMark.docOwner3"), age: "2 ч" },
  ];

  const alerts = [
    { level: "high", title: t("honestMark.alert1Title"), desc: t("honestMark.alert1Desc"), icon: AlertTriangle },
    { level: "mid", title: t("honestMark.alert2Title"), desc: t("honestMark.alert2Desc"), icon: AlertCircle },
    { level: "low", title: t("honestMark.alert3Title"), desc: t("honestMark.alert3Desc"), icon: FileText },
  ] as const;

  const alertTone = (lvl: "high" | "mid" | "low") =>
    lvl === "high"
      ? "border-red-500/25 bg-red-500/5"
      : lvl === "mid"
        ? "border-orange-500/25 bg-orange-500/5"
        : "border-white/10 bg-white/5";

  return (
    <div className="fixed inset-0 z-[9998]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-4 top-10 mx-auto max-w-5xl rounded-3xl border border-lime/20 bg-background/70 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-lime" />
            <div className="font-semibold">{t("honestMark.demoPanelTitle")}</div>
            <span className="text-xs text-muted-foreground">{t("honestMark.demoPanelSubtitle")}</span>
          </div>
          <button
            className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:border-lime/30"
            onClick={onClose}
            aria-label="close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 flex flex-wrap items-center gap-2">
          {[
            { k: "overview" as const, label: t("honestMark.overview"), icon: BarChart3 },
            { k: "docs" as const, label: t("honestMark.docs"), icon: FileText },
            { k: "alerts" as const, label: t("honestMark.alerts"), icon: AlertTriangle },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-sm flex items-center gap-2 transition-all",
                  active ? "border-lime/40 bg-lime/10 text-lime" : "border-white/10 bg-white/5 hover:border-lime/25"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 pt-2">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                {kpis.map((k, i) => {
                  const Icon = k.icon;
                  return (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{k.label}</div>
                        <Icon className="h-4 w-4 text-lime" />
                      </div>
                      <div className={cn("text-2xl font-bold mt-2", k.tone)}>{k.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t("honestMark.status")}</div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-lime" />
                  {t("honestMark.eventsMonitor")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("honestMark.eventsDesc")}
                </div>

                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  {[
                    { label: t("honestMark.successfulScans"), v: 128 },
                    { label: t("honestMark.errorsPerHour"), v: 3 },
                    { label: t("honestMark.inProgress"), v: 12 },
                  ].map((x, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-background/30 p-4">
                      <div className="text-xs text-muted-foreground">{x.label}</div>
                      <div className="text-2xl font-bold text-lime mt-1">{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "docs" && (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="grid grid-cols-4 px-4 py-3 text-xs text-muted-foreground border-b border-white/10">
                <div>ID</div>
                <div>{t("honestMark.docStatus")}</div>
                <div>{t("honestMark.docSection")}</div>
                <div>{t("honestMark.docAge")}</div>
              </div>
              {docs.map((d) => (
                <div
                  key={d.id}
                  className="grid grid-cols-4 px-4 py-3 text-sm border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <div className="font-mono text-lime">{d.id}</div>
                  <div>{d.status}</div>
                  <div className="text-muted-foreground">{d.owner}</div>
                  <div className="text-muted-foreground">{d.age}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "alerts" && (
            <div className="grid md:grid-cols-3 gap-3">
              {alerts.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className={cn("rounded-2xl border p-4", alertTone(a.level))}>
                    <div className="flex items-center gap-2 font-semibold">
                      <Icon className="h-5 w-5 text-lime" />
                      {a.title}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{a.desc}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/** ✅ BLOCK 4/4 — StickyStoryNav + HonestMark page + styles + export */

function useSectionObserver(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = ids
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((x): x is { id: string; el: HTMLElement } => !!x.el);
    if (!els.length) return;

    const updateActive = () => {
      const triggerOffset = window.innerHeight * 0.25; // секция активна, когда её верх прошёл линию на 25% от верха экрана
      let newActive = els[0]?.id ?? "";
      for (let i = els.length - 1; i >= 0; i--) {
        const rect = els[i].el.getBoundingClientRect();
        if (rect.top <= triggerOffset) {
          newActive = els[i].id;
          break;
        }
      }
      setActive(newActive);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const h = doc.scrollHeight - doc.clientHeight;
      setProgress(h > 0 ? (doc.scrollTop / h) * 100 : 0);
      updateActive();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return { active, progress };
}

function StickyStoryNav({
  items,
  activeId,
  progress,
}: {
  items: Array<{ id: string; label: string; icon: any }>;
  activeId: string;
  progress: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="hidden xl:block fixed left-4 top-24 w-[260px] z-50 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shimmer-card">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground">{t("honestMark.nav")}</div>
          <div className="text-xs text-muted-foreground">{Math.round(progress)}%</div>
        </div>
        <ProgressBar value={progress} />
        <div className="mt-4 space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = it.id === activeId;
            return (
              <a
                key={it.id}
                href={`#${it.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm border transition-all",
                  active
                    ? "border-lime/40 bg-lime/10 text-lime"
                    : "border-transparent hover:border-lime/25 hover:bg-white/5 text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const HonestMark = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const [visibleStats, setVisibleStats] = useState({
    companies: 0,
    categories: 0,
    savings: 0,
  });

  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleStats((prev) => ({
        companies: Math.min(prev.companies + 2, 60),
        categories: Math.min(prev.categories + 1, 20),
        savings: Math.min(prev.savings + 2, 45),
      }));
    }, 40);
    return () => window.clearInterval(interval);
  }, []);

  const categories = [
    {
      id: "food",
      title: t("honestMark.categoryFood"),
      icon: Package,
      items: [
        { icon: Beer, nameKey: "food1" },
        { icon: Milk, nameKey: "food2" },
        { icon: Droplet, nameKey: "food3" },
        { icon: Coffee, nameKey: "food4" },
        { icon: Wheat, nameKey: "food5" },
        { icon: Candy, nameKey: "food6" },
        { icon: UtensilsCrossed, nameKey: "food7" },
        { icon: Fish, nameKey: "food8" },
      ],
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: "consumer",
      title: t("honestMark.categoryConsumer"),
      icon: ShoppingCart,
      items: [
        { icon: Shirt, nameKey: "consumer1" },
        { icon: Footprints, nameKey: "consumer2" },
        { icon: Sparkles, nameKey: "consumer3" },
        { icon: Sparkles, nameKey: "consumer4" },
        { icon: Sparkles, nameKey: "consumer5" },
        { icon: Baby, nameKey: "consumer6" },
        { icon: Bike, nameKey: "consumer7" },
        { icon: Wrench, nameKey: "consumer8" },
      ],
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "medical",
      title: t("honestMark.categoryMedical"),
      icon: Stethoscope,
      items: [
        { icon: Pill, nameKey: "medical1" },
        { icon: Heart, nameKey: "medical2" },
        { icon: PillBottle, nameKey: "medical3" },
        { icon: Syringe, nameKey: "medical4" },
        { icon: Bandage, nameKey: "medical5" },
      ],
      color: "from-red-500/20 to-pink-500/20",
    },
    {
      id: "industrial",
      title: t("honestMark.categoryIndustrial"),
      icon: Factory,
      items: [
        { icon: Car, nameKey: "industrial1" },
        { icon: Camera, nameKey: "industrial2" },
        { icon: Cpu, nameKey: "industrial3" },
        { icon: PawPrint, nameKey: "industrial4" },
        { icon: PawPrint, nameKey: "industrial5" },
      ],
      color: "from-purple-500/20 to-violet-500/20",
    },
    {
      id: "it",
      title: t("honestMark.categoryIt"),
      icon: Code,
      items: [
        { icon: Database, nameKey: "it1" },
        { icon: Code, nameKey: "it2" },
        { icon: Layers, nameKey: "it3" },
        { icon: Server, nameKey: "it4" },
      ],
      color: "from-cyan-500/20 to-blue-500/20",
    },
  ];

  const processSteps = [
    { icon: Factory, title: t("honestMark.processProduction"), desc: t("honestMark.processProductionDesc") },
    { icon: Truck, title: t("honestMark.processLogistics"), desc: t("honestMark.processLogisticsDesc") },
    { icon: ShoppingCart, title: t("honestMark.processSale"), desc: t("honestMark.processSaleDesc") },
  ];

  const risks = [
    { icon: DollarSign, title: t("honestMark.riskFines"), desc: t("honestMark.riskFinesDesc") },
    { icon: XCircle, title: t("honestMark.riskStopSales"), desc: t("honestMark.riskStopSalesDesc") },
    { icon: AlertTriangle, title: t("honestMark.riskCounterparties"), desc: t("honestMark.riskCounterpartiesDesc") },
    { icon: FileText, title: t("honestMark.riskAudits"), desc: t("honestMark.riskAuditsDesc") },
    { icon: Clock, title: t("honestMark.riskUrgent"), desc: t("honestMark.riskUrgentDesc") },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: t("honestMark.benefitFinancial"),
      items: [t("honestMark.benefitFinancial1"), t("honestMark.benefitFinancial2"), t("honestMark.benefitFinancial3"), t("honestMark.benefitFinancial4")],
    },
    {
      icon: Target,
      title: t("honestMark.benefitBusiness"),
      items: [t("honestMark.benefitBusiness1"), t("honestMark.benefitBusiness2"), t("honestMark.benefitBusiness3"), t("honestMark.benefitBusiness4")],
    },
    {
      icon: Network,
      title: t("honestMark.benefitIt"),
      items: [t("honestMark.benefitIt1"), t("honestMark.benefitIt2"), t("honestMark.benefitIt3")],
    },
  ];

  const services = [
    { icon: Key, title: t("honestMark.service1") },
    { icon: Settings, title: t("honestMark.service2") },
    { icon: Network, title: t("honestMark.service3") },
    { icon: Package, title: t("honestMark.service4") },
    { icon: Users, title: t("honestMark.service5") },
    { icon: Shield, title: t("honestMark.service6") },
    { icon: Code, title: t("honestMark.service7") },
  ];

  const oneCConfigs = [
    t("honestMark.onec1"),
    t("honestMark.onec2"),
    t("honestMark.onec3"),
    t("honestMark.onec4"),
    t("honestMark.onec5"),
    t("honestMark.onec6"),
  ];

  const storyItems = useMemo(
    () => [
      { id: "hero", label: "Hero", icon: ScanLine },
      { id: "calculator", label: t("honestMark.storyCalculator"), icon: BarChart3 },
      { id: "categories", label: t("honestMark.storyCategories"), icon: Package },
      { id: "datamatrix", label: "DataMatrix", icon: Fingerprint },
      { id: "cases", label: t("honestMark.storyCases"), icon: Sparkles },
      { id: "simulator", label: t("honestMark.storySimulator"), icon: Boxes },
      { id: "compare", label: t("honestMark.storyCompare"), icon: Sparkles },
      { id: "risks", label: t("honestMark.storyRisks"), icon: AlertTriangle },
      { id: "benefits", label: t("honestMark.storyBenefits"), icon: TrendingUp },
      { id: "services", label: t("honestMark.storyServices"), icon: Shield },
      { id: "onec", label: "1С", icon: Code },
    ],
    [t]
  );

  const { active: activeSection, progress } = useSectionObserver(storyItems.map((s) => s.id));

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <CustomCursor />
      <DemoDashboard open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* inline styles for shimmer + scanline */}
      <style>{`
        .shimmer-card { position: relative; }
        .shimmer-mask {
          background: radial-gradient(140px 90px at 30% 30%, rgba(163, 230, 53, 0.25), transparent 60%);
          pointer-events: none;
        }
        .scanline {
          position: absolute;
          left: 0; right: 0;
          height: 12px;
          top: 0;
          background: linear-gradient(to bottom, rgba(163,230,53,0), rgba(163,230,53,0.55), rgba(163,230,53,0));
          mix-blend-mode: screen;
          animation: scan 1.4s ease-in-out infinite;
          opacity: 0;
          pointer-events: none;
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(260px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(/rus-logo3.png)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "auto 60vh",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-4">
            <StickyStoryNav items={storyItems} activeId={activeSection} progress={progress} />
            <div className="xl:ml-[280px]">
              <div className="space-y-16">
                {/* HERO */}
                <section id="hero" className="py-10 lg:py-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-lime/5 via-transparent to-transparent" />
                  <div className="relative z-10">
                    <div className="text-center mb-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 text-lime text-sm font-medium mb-6 backdrop-blur-xl border border-lime/20">
                        <ScanLine className="h-4 w-4" />
                        {t("honestMark.badge")}
                      </div>

                      <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-lime to-foreground bg-clip-text text-transparent">
                        {t("honestMark.heroTitle1")}
                        <br />
                        <span className="text-lime">{t("honestMark.heroTitle2")}</span>
                      </h1>

                      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        {t("honestMark.heroDesc")}
                      </p>

                      <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                        {[
                          { value: `${visibleStats.companies}%`, label: t("honestMark.statCompanies"), icon: AlertCircle },
                          { value: `${visibleStats.categories}+`, label: t("honestMark.statCategories"), icon: Package },
                          { value: `${t("honestMark.upTo")} ${visibleStats.savings}%`, label: t("honestMark.statSavings"), icon: TrendingUp },
                        ].map((stat, i) => {
                          const Icon = stat.icon;
                          return (
                            <Card key={i} className="border-lime/20 bg-white/5 backdrop-blur-xl hover:border-lime/50 transition-all hover:scale-105 shimmer-card">
                              <CardContent className="p-6 text-center">
                                <Icon className="h-8 w-8 text-lime mx-auto mb-2" />
                                <div className="text-3xl font-bold text-lime mb-1">{stat.value}</div>
                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap justify-center gap-3">
                        <MagneticButton
                          onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                        >
                          <BarChart3 className="h-4 w-4" />
                          {t("honestMark.calculateProject")}
                          <MoveRight className="h-4 w-4" />
                        </MagneticButton>

                        <button
                          className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-lime/30 transition-all"
                          onClick={() => setDemoOpen(true)}
                        >
                          {t("honestMark.openDemoPanel")}
                        </button>
                      </div>
                    </div>

                    {/* Process */}
                    <div className="relative mt-10">
                      <div className="flex items-center justify-center gap-8 lg:gap-16 flex-wrap">
                        {processSteps.map((step, index) => {
                          const Icon = step.icon;
                          const isActive = activeStep === index;
                          return (
                            <div key={index} className="flex flex-col items-center group">
                              <button
                                onClick={() => setActiveStep(isActive ? null : index)}
                                className={cn(
                                  "relative w-24 h-24 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300",
                                  isActive
                                    ? "border-lime bg-lime/20 scale-110 shadow-glow-lime"
                                    : "border-white/20 bg-white/5 hover:border-lime/50 hover:scale-105"
                                )}
                              >
                                <Icon className={cn("h-12 w-12 mx-auto mt-4 transition-colors", isActive ? "text-lime" : "text-muted-foreground group-hover:text-lime")} />
                                {isActive && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime rounded-full flex items-center justify-center animate-pulse">
                                    <CheckCircle2 className="h-4 w-4 text-background" />
                                  </div>
                                )}
                              </button>
                              <div className={cn("mt-4 text-center transition-all", isActive && "scale-110")}>
                                <div className={cn("font-semibold mb-1", isActive && "text-lime")}>{step.title}</div>
                                <div className="text-xs text-muted-foreground">{step.desc}</div>
                              </div>
                              {index < processSteps.length - 1 && (
                                <ArrowRight className="hidden lg:block h-6 w-6 text-muted-foreground mx-4 animate-pulse" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded Info */}
                      {activeStep !== null && (
                        <div className="mt-8 animate-fade-up">
                          <Card className="border-lime/30 bg-white/10 backdrop-blur-xl">
                            <CardContent className="p-6">
                              <p className="text-center text-muted-foreground">
                                {activeStep === 0 && t("honestMark.processStep0")}
                                {activeStep === 1 && t("honestMark.processStep1")}
                                {activeStep === 2 && t("honestMark.processStep2")}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* TOP #1 */}
                <section id="calculator">
                  <ImplementationCalculator onOpenDemo={() => setDemoOpen(true)} />
                </section>

                {/* Categories */}
                <section id="categories" className="py-2">
                  <div className="text-center mb-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                      {t("honestMark.categoriesTitle")} <span className="text-lime">{t("honestMark.categoriesTitleHighlight")}</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">{t("honestMark.categoriesSubtitle")}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => {
                      const CategoryIcon = category.icon;
                      const isHovered = hoveredCategory === category.id;
                      return (
                        <Card
                          key={category.id}
                          onMouseEnter={() => setHoveredCategory(category.id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          className={cn(
                            "border-border bg-white/5 backdrop-blur-xl transition-all duration-300 cursor-pointer shimmer-card",
                            isHovered ? "border-lime/50 scale-105 shadow-glow-lime" : "hover:border-lime/30"
                          )}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-4">
                              <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br", category.color, "flex items-center justify-center transition-transform", isHovered && "scale-110 rotate-6")}>
                                <CategoryIcon className="h-6 w-6 text-lime" />
                              </div>
                              <CardTitle className="text-lg">{category.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                              {category.items.map((item, i) => {
                                const ItemIcon = item.icon;
                                return (
                                  <div key={i} className={cn("flex items-center gap-2 p-2 rounded-lg transition-all", isHovered ? "bg-lime/10" : "bg-white/5")}>
                                    <ItemIcon className="h-4 w-4 text-lime flex-shrink-0" />
                                    <span className="text-xs">{t(`honestMark.${item.nameKey}`)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>

                {/* DataMatrix */}
                <section id="datamatrix" className="py-2">
                  <DataMatrixDemo />
                </section>

                {/* Cases */}
                <section id="cases" className="py-2">
                  <CasesDoAfter />
                </section>

                {/* Simulator */}
                <section id="simulator" className="py-2">
                  <SupplyChainSimulator />
                </section>

                {/* Comparison */}
                <section id="compare" className="py-2">
                  <ComparisonSlider />
                </section>

                {/* Risks */}
                <section id="risks" className="py-2">
                  <div className="text-center mb-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                      {t("honestMark.risksTitle")} <span className="text-red-400">{t("honestMark.risksTitleHighlight")}</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">{t("honestMark.risksSubtitle")}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {risks.map((risk, i) => {
                      const Icon = risk.icon;
                      return (
                        <Card key={i} className="border-red-500/20 bg-red-500/5 backdrop-blur-xl hover:border-red-500/50 transition-all hover:scale-105 shimmer-card">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <Icon className="h-6 w-6 text-red-400" />
                              <CardTitle className="text-lg">{risk.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{risk.desc}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>

                {/* Benefits */}
                <section id="benefits" className="py-2">
                  <div className="text-center mb-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                      {t("honestMark.benefitsTitle")} <span className="text-lime">{t("honestMark.benefitsTitleHighlight")}</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">{t("honestMark.benefitsSubtitle")}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {benefits.map((benefit, i) => {
                      const Icon = benefit.icon;
                      return (
                        <Card key={i} className="border-lime/20 bg-white/5 backdrop-blur-xl hover:border-lime/50 transition-all hover:scale-105 shimmer-card">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-4">
                              <Icon className="h-8 w-8 text-lime" />
                              <CardTitle>{benefit.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {benefit.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-lime mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>

                {/* Services */}
                <section id="services" className="py-2">
                  <div className="text-center mb-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                      {t("honestMark.servicesTitle")} <span className="text-lime">{t("honestMark.servicesTitleHighlight")}</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">{t("honestMark.servicesSubtitle")}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {services.map((service, i) => {
                      const Icon = service.icon;
                      return (
                        <Card key={i} className="border-border bg-white/5 backdrop-blur-xl hover:border-lime/50 transition-all hover:scale-105 group shimmer-card">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center group-hover:bg-lime/20 transition-colors">
                              <Icon className="h-5 w-5 text-lime" />
                            </div>
                            <span className="text-sm font-medium">{service.title}</span>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <MagneticButton onClick={() => setDemoOpen(true)}>
                      <LayoutDashboard className="h-4 w-4" />
                      {t("honestMark.showDemoPanel")}
                      <MoveRight className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </section>

                {/* 1C */}
                <section id="onec" className="py-2">
                  <div className="text-center mb-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                      {t("honestMark.onecTitle")} <span className="text-lime">{t("honestMark.onecTitleHighlight")}</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">{t("honestMark.onecSubtitle")}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {oneCConfigs.map((config, i) => (
                      <Card key={i} className="border-border bg-white/5 backdrop-blur-xl hover:border-lime/50 transition-all hover:scale-105 shimmer-card">
                        <CardContent className="p-4 flex items-center gap-3">
                          <Code className="h-5 w-5 text-lime" />
                          <span className="font-medium">{config}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HonestMark;