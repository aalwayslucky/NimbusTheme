export interface Theme {
  title: string;
  variable: string;
}

export const themeColors = [
  {
    title: "Primary",
    variable: "--primary",
  },
  {
    title: "Primary Foreground",
    variable: "--primary-foreground",
  },
  {
    title: "Secondary",
    variable: "--secondary",
  },
  {
    title: "Secondary Foreground",
    variable: "--secondary-foreground",
  },
  {
    title: "Background",
    variable: "--background",
  },
  {
    title: "Foreground",
    variable: "--foreground",
  },
  {
    title: "Card",
    variable: "--card",
  },
  {
    title: "Card Foreground",
    variable: "--card-foreground",
  },
  {
    title: "Popover",
    variable: "--popover",
  },
  {
    title: "Popover Foreground",
    variable: "--popover-foreground",
  },
  {
    title: "Muted",
    variable: "--muted",
  },
  {
    title: "Muted Foreground",
    variable: "--muted-foreground",
  },
  {
    title: "Accent",
    variable: "--accent",
  },
  {
    title: "Accent Foreground",
    variable: "--accent-foreground",
  },
  {
    title: "Destructive",
    variable: "--destructive",
  },
  {
    title: "Destructive Foreground",
    variable: "--destructive-foreground",
  },
  {
    title: "Border",
    variable: "--border",
  },
  {
    title: "Input",
    variable: "--input",
  },
  {
    title: "Ring",
    variable: "--ring",
  },
  {
    title: "Unlocked",
    variable: "--unlocked",
  },
  {
    title: "Long",
    variable: "--long",
  },
  {
    title: "Long Foreground",
    variable: "--long-foreground",
  },
  {
    title: "Long Inside",
    variable: "--long-inside",
  },
  {
    title: "Short",
    variable: "--short",
  },
  {
    title: "Short Foreground",
    variable: "--short-foreground",
  },
  {
    title: "Short Inside",
    variable: "--short-inside",
  },
  {
    title: "TP",
    variable: "--tp",
  },
  {
    title: "TP Foreground",
    variable: "--tp-foreground",
  },
  {
    title: "TP Inside",
    variable: "--tp-inside",
  },
  {
    title: "TP Light",
    variable: "--tp-light",
  },
  {
    title: "SL",
    variable: "--sl",
  },
  {
    title: "SL Foreground",
    variable: "--sl-foreground",
  },
  {
    title: "SL Inside",
    variable: "--sl-inside",
  },
  {
    title: "Chart Background",
    variable: "--chartBg",
  },
] as const;

export function getColorTitle(variable: string) {
  const color = themeColors.find((item) => item.variable === variable);
  return color ? color.title : undefined;
}

export type ShadCnPropritiesType = (typeof themeColors)[number]["variable"];
export type ReadonlyThemeWithColor = (typeof themeColors)[number] & {
  color: string;
};
export const SystemThemes = ["light", "dark"] as const;
export type themeModes = typeof SystemThemes[number];

export type ReadonlyThemeWithHSLColor = (typeof themeColors)[number] & {
  color: HslColor;
};

export type ThemeWithHSLColor = Mutable<ReadonlyThemeWithHSLColor>;
