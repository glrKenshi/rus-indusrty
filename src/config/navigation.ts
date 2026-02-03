export const headerNavKeys = [
  "header.about",
  "header.catalog",
  "header.software",
  "header.advantages",
  "header.contact",
] as const;

export const headerNavPaths: Record<(typeof headerNavKeys)[number], string> = {
  "header.about": "/#about",
  "header.catalog": "/equipment#equipment",
  "header.software": "/#software",
  "header.advantages": "/#advantages",
  "header.contact": "/#contact",
};
