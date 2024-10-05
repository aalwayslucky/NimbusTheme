// https://github.com/jln13x/ui.jln.dev/blob/main/src/shared/create-theme-config.ts

import { Colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import harmoniesPlugin from "colord/plugins/harmonies";
import {
  getColorTitle,
  type ShadCnPropritiesType,
  type themeModes,
  ThemeWithHSLColor,
} from "./theme";

type Hsl = HslColor;
// type Hsl = {
//     h: number;
//     s: number;
//     l: number;
// }

extend([a11yPlugin, harmoniesPlugin]);

const faker = {
  number: {
    int: (options: { min: number; max: number }) => {
      return (
        Math.floor(Math.random() * (options.max - options.min + 1)) +
        options.min
      );
    },
    float: (options: { min: number; max: number }) => {
      return Math.random() * (options.max - options.min) + options.min;
    },
  },
  datatype: {
    boolean: () => {
      return Math.random() < 0.5;
    },
  },
  helpers: {
    arrayElement: <T extends readonly unknown[] | Array<unknown>>(
      arr: T,
    ): T[number] => {
      return arr[Math.floor(Math.random() * arr.length)];
    },
  },
};

const createPrimaryColor = (): Hsl => {
  return {
    h: faker.number.int({ min: 0, max: 360 }),
    s: faker.number.int({ min: 0, max: 100 }),
    l: faker.number.int({ min: 10, max: 90 }),
  };
};

const createContrast = (color: Colord) => {
  const isLight = color.isLight();
  let opposite = color;

  let i = 0;
  while (opposite.contrast(color) < 6) {
    opposite = isLight ? opposite.darken(0.2) : opposite.lighten(0.2);
    if (i++ > 10) break;
  }
  return opposite;
};

const colordToHsl = (color: Colord): Hsl => {
  const hsla = color.toHsl();

  return {
    h: hsla.h,
    s: hsla.s,
    l: hsla.l,
  };
};

const createBackgroundLight = (hue: number): Hsl => {
  return {
    h: hue,
    s: faker.number.int({ min: 30, max: 70 }),
    l: faker.number.int({ min: 98, max: 100 }),
  };
};

const createBackgroundDark = (hue: number): Hsl => {
  return {
    h: hue,
    s: faker.number.int({ min: 30, max: 60 }),
    l: faker.number.int({ min: 0, max: 4 }),
  };
};

const createForegroundLight = (hue: number): Hsl => {
  return {
    h: hue,
    s: faker.number.int({
      min: 50,
      max: 80,
    }),
    l: faker.number.int({
      min: 0,
      max: 5,
    }),
  };
};

const createForegroundDark = (hue: number): Hsl => {
  return {
    h: hue,
    s: faker.number.int({
      min: 10,
      max: 40,
    }),
    l: faker.number.int({
      min: 97,
      max: 100,
    }),
  };
};

export const createDestructive = () => {
  return new Colord({
    h: faker.number.int({
      min: 0,
      max: 22,
    }),
    s: faker.number.int({
      min: 80,
      max: 100,
    }),
    l: faker.number.int({
      min: 20,
      max: 45,
    }),
  });
};

const modes = ["complementary", "triadic", "analogous", "slick"] as const;

const createColorHarmony = (
  primary: Colord,
  mode: (typeof modes)[number],
  shouldMatch: boolean,
  isDark?: boolean,
) => {
  if (mode === "triadic") {
    const [, secondary, accent] = primary.harmonies(mode);
    if (!secondary || !accent) throw new Error("Failed to create harmony");

    return {
      secondary,
      accent,
    };
  }

  if (mode === "complementary") {
    const [, secondary] = primary.harmonies(mode);
    if (!secondary) throw new Error("Failed to create harmony");

    return {
      secondary,
      accent: secondary,
    };
  }

  if (mode === "analogous") {
    const [secondary, , accent] = primary.harmonies(mode);
    if (!secondary || !accent) throw new Error("Failed to create harmony");

    return {
      secondary,
      accent,
    };
  }

  if (mode === "slick") {
    if (isDark) {
      const baseSaturation = faker.number.int({ min: 0, max: 20 });
      const baseLightness = faker.number.int({ min: 8, max: 20 });

      const clr = new Colord({
        h: primary.hue(),
        s: baseSaturation,
        l: baseLightness,
      });

      return {
        secondary: clr,
        accent: shouldMatch ? clr : clr
          .saturate(faker.number.float({ min: 0.05, max: 0.1 }))
          .lighten(faker.number.float({ min: 0.05, max: 0.1 })),
      };
    }

    const baseSaturation = faker.number.int({ min: 0, max: 20 });
    const baseLightness = faker.number.int({ min: 80, max: 92 });

    const clr = new Colord({
      h: primary.hue(),
      s: baseSaturation,
      l: baseLightness,
    });

    return {
      secondary: clr,
      accent: shouldMatch ? clr : clr
        .darken(faker.number.float({ min: 0.05, max: 0.1 }))
        .saturate(faker.number.float({ min: 0.05, max: 0.1 })),
    };
  }

  throw new Error("Invalid mode");
};

export const createThemeConfig = (
  primaryColor?: Hsl,
): { [key in themeModes]: { [key: string]: Hsl } } => {
  // { [key in themeModes]: { [key in ShadCnPropritiesType]: Hsl } }
  const primaryBase = new Colord(primaryColor ?? createPrimaryColor());

  const primaryLightColord = primaryBase;
  const primaryDarkColord = primaryBase;

  const primaryLight = colordToHsl(primaryLightColord);
  const primaryDark = colordToHsl(primaryDarkColord);
  const primaryLightForeground = colordToHsl(
    createContrast(primaryLightColord),
  );
  const primaryDarkForeground = colordToHsl(createContrast(primaryDarkColord));

  const backgroundDark = createBackgroundDark(primaryBase.hue());
  const backgroundLight = createBackgroundLight(primaryBase.hue());

  const foregroundDark = createForegroundDark(primaryBase.hue());
  const foregroundLight = createForegroundLight(primaryBase.hue());

  const cardBoolean = faker.datatype.boolean();

  const cardLight = cardBoolean
    ? colordToHsl(new Colord(backgroundLight).darken(0.01))
    : backgroundLight;
  const cardDark = cardBoolean
    ? colordToHsl(new Colord(backgroundDark).lighten(0.01))
    : backgroundDark;

  const cardLightForeground = cardBoolean
    ? colordToHsl(new Colord(foregroundLight).darken(0.01))
    : foregroundLight;

  const cardDarkForeground = cardBoolean
    ? colordToHsl(new Colord(foregroundDark).lighten(0.01))
    : foregroundDark;

  const popoverBoolean = faker.datatype.boolean();

  const popoverLight = popoverBoolean ? cardLight : backgroundLight;
  const popoverDark = popoverBoolean ? cardDark : backgroundDark;

  const popoverLightForeground = popoverBoolean
    ? cardLightForeground
    : foregroundLight;

  const popoverDarkForeground = popoverBoolean
    ? cardDarkForeground
    : foregroundDark;

  const harmonyMode = faker.helpers.arrayElement(modes);

  // Whether the secondary and accent colors should match if mode is "slick"
  const shouldMatch = faker.datatype.boolean();

  const lightHarmonies = createColorHarmony(
    primaryLightColord,
    harmonyMode,
    shouldMatch,
    false,
  );

  const secondaryLight = colordToHsl(lightHarmonies.secondary);
  const secondaryLightForeground = colordToHsl(
    createContrast(lightHarmonies.secondary),
  );

  const accentLight = colordToHsl(lightHarmonies.accent);
  const accentLightForeground = colordToHsl(
    createContrast(lightHarmonies.accent),
  );

  const darkHarmonies = createColorHarmony(
    primaryDarkColord,
    harmonyMode,
    shouldMatch,
    true,
  );

  const secondaryDark = colordToHsl(darkHarmonies.secondary);
  const secondaryDarkForeground = colordToHsl(
    createContrast(darkHarmonies.secondary),
  );

  const accentDark = colordToHsl(darkHarmonies.accent);
  const accentDarkForeground = colordToHsl(
    createContrast(darkHarmonies.accent),
  );

  const destructiveBase = createDestructive();
  const destructiveLight = colordToHsl(destructiveBase);

  const destructiveDark = {
    h: destructiveLight.h,
    s: destructiveLight.s,
    l: faker.number.int({ min: 45, max: 60 }),
  };

  const destructiveLightForeground = colordToHsl(
    createContrast(destructiveBase),
  );

  const destructiveDarkForeground = colordToHsl(
    createContrast(new Colord(destructiveDark)),
  );

  const mutedBaseDeviations = {
    s: faker.number.int({ min: 5, max: 40 }),
    l: faker.number.int({ min: 0, max: 10 }),
  };

  const mutedLight = {
    h: secondaryLight.h,
    s: mutedBaseDeviations.s,
    l: 85 + mutedBaseDeviations.l,
  };

  const mutedDark = {
    h: secondaryDark.h,
    s: mutedBaseDeviations.s,
    l: 15 - mutedBaseDeviations.l,
  };

  const mutedForegroundBaseDeviations = {
    s: faker.number.int({ min: 0, max: 15 }),
    l: faker.number.int({ min: 0, max: 15 }),
  };

  const mutedForegroundLight = {
    h: mutedLight.h,
    s: mutedForegroundBaseDeviations.s,
    l: 25 + mutedForegroundBaseDeviations.l,
  };

  const mutedForegroundDark = {
    h: mutedDark.h,
    s: mutedForegroundBaseDeviations.s,
    l: 75 - mutedForegroundBaseDeviations.l,
  };

  const inputBaseDeviations = {
    s: faker.number.int({ min: 2, max: 15 }),
    l: faker.number.int({ min: 5, max: 10 }),
  };

  const borderLight = {
    h: backgroundLight.h,
    s: inputBaseDeviations.s,
    l: backgroundLight.l - inputBaseDeviations.l,
  };

  const borderDark = {
    h: backgroundDark.h,
    s: inputBaseDeviations.s,
    l: faker.number.int({ min: 10, max: 15 }),
  };

  return {
    light: {
      background: backgroundLight,
      foreground: foregroundLight,
      card: cardLight,
      cardForeground: cardLightForeground,
      popover: popoverLight,
      popoverForeground: popoverLightForeground,
      primary: primaryLight,
      primaryForeground: primaryLightForeground,
      secondary: secondaryLight,
      secondaryForeground: secondaryLightForeground,
      accent: accentLight,
      accentForeground: accentLightForeground,
      destructive: destructiveLight,
      destructiveForeground: destructiveLightForeground,
      muted: mutedLight,
      mutedForeground: mutedForegroundLight,
      border: borderLight,
      input: borderLight,
      ring: primaryLight,
      unlocked: backgroundLight,
      long: accentLight,
      longForeground: accentLightForeground,
      longInside: colordToHsl(new Colord(accentLight).darken(0.4)),
      short: destructiveLight,
      shortForeground: destructiveLightForeground,
      shortInside: colordToHsl(new Colord(destructiveLight).darken(0.4)),
      tp: primaryLight,
      tpForeground: primaryLightForeground,
      tpInside: colordToHsl(new Colord(primaryLight).darken(0.4)),
      tpLight: colordToHsl(new Colord(primaryLight).lighten(0.1)),
      sl: secondaryLight,
      slForeground: secondaryLightForeground,
      slInside: colordToHsl(new Colord(secondaryLight).darken(0.4)),
      chartBg: backgroundLight,
    },
    dark: {
      background: backgroundDark,
      foreground: foregroundDark,
      card: cardDark,
      cardForeground: cardDarkForeground,
      popover: popoverDark,
      popoverForeground: popoverDarkForeground,
      primary: primaryDark,
      primaryForeground: primaryDarkForeground,
      secondary: secondaryDark,
      secondaryForeground: secondaryDarkForeground,
      accent: accentDark,
      accentForeground: accentDarkForeground,
      destructive: destructiveDark,
      destructiveForeground: destructiveDarkForeground,
      muted: mutedDark,
      mutedForeground: mutedForegroundDark,
      border: borderDark,
      input: borderDark,
      ring: primaryDark,
      unlocked: backgroundDark,
      long: accentDark,
      longForeground: accentDarkForeground,
      longInside: colordToHsl(new Colord(accentDark).darken(0.4)),
      short: destructiveDark,
      shortForeground: destructiveDarkForeground,
      shortInside: colordToHsl(new Colord(destructiveDark).darken(0.4)),
      tp: primaryDark,
      tpForeground: primaryDarkForeground,
      tpInside: colordToHsl(new Colord(primaryDark).darken(0.4)),
      tpLight: colordToHsl(new Colord(primaryDark).lighten(0.1)),
      sl: secondaryDark,
      slForeground: secondaryDarkForeground,
      slInside: colordToHsl(new Colord(secondaryDark).darken(0.4)),
      chartBg: backgroundDark,
    },
  };

  //   return {
  //     light: {
  //       "--background": backgroundLight,
  //       "--foreground": foregroundLight,
  //       "--card": cardLight,
  //       "--card-foreground": cardLightForeground,
  //       "--popover": popoverLight,
  //       "--popover-foreground": popoverLightForeground,
  //       "--primary": primaryLight,
  //       "--primary-foreground": primaryLightForeground,
  //       "--secondary": secondaryLight,
  //       "--secondary-foreground": secondaryLightForeground,
  //       "--accent": accentLight,
  //       "--accent-foreground": accentLightForeground,
  //       "--destructive": destructiveLight,
  //       "--destructive-foreground": destructiveLightForeground,
  //       "--muted": mutedLight,
  //       "--muted-foreground": mutedForegroundLight,
  //       "--border": borderLight,
  //       "--input": borderLight,
  //       "--ring": primaryLight,
  //     },
  //     dark: {
  //       "--background": backgroundDark,
  //       "--foreground": foregroundDark,
  //       "--card": cardDark,
  //       "--card-foreground": cardDarkForeground,
  //       "--popover": popoverDark,
  //       "--popover-foreground": popoverDarkForeground,
  //       "--primary": primaryDark,
  //       "--primary-foreground": primaryDarkForeground,
  //       "--secondary": secondaryDark,
  //       "--secondary-foreground": secondaryDarkForeground,
  //       "--accent": accentDark,
  //       "--accent-foreground": accentDarkForeground,
  //       "--destructive": destructiveDark,
  //       "--destructive-foreground": destructiveDarkForeground,
  //       "--muted": mutedDark,
  //       "--muted-foreground": mutedForegroundDark,
  //       "--border": borderDark,
  //       "--input": borderDark,
  //       "--ring": primaryDark,
  //     },
  //   };
};

// ---
function toKebabCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export function createRandomTheme(primaryColor?: Hsl) {
  const themes = createThemeConfig(primaryColor);
  let validThemes: { [key: string]: any } = {};
  for (let [mode, theme] of Object.entries(themes)) {
    let validTheme: ThemeWithHSLColor[] = [];
    for (let [name, color] of Object.entries(theme)) {
      let pro = "--" + toKebabCase(name);
      validTheme.push({
        title: getColorTitle(pro)!,
        variable: pro as any,
        color: color,
      });
    }
    validThemes[mode] = validTheme;
  }
  return validThemes as { [mode in themeModes]: ThemeWithHSLColor[] };
}
