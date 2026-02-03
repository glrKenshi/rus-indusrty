interface PageLayoutProps {
  children: React.ReactNode;
  backgroundSize?: string;
  backgroundOpacity?: number;
}

export default function PageLayout({
  children,
  backgroundSize = "auto 80vh",
  backgroundOpacity = 0.5,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: "url(/rus-logo3.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize,
          opacity: backgroundOpacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
