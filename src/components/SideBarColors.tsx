import { getColors, ls, resetTheme, setColorsProperties } from "../lib/utils";
import React, { useEffect, useState } from "react";
import { Item } from "./item";
import { ThemeWithHSLColor } from "../lib/theme";
import { useTheme } from "next-themes";
import { useDebounceCallback } from "../hooks/useDebounceCallback";
import z from "zod";
import { LOCAL_STORAGE_KEY } from "../lib/consts";
import { useEmittor } from "emittor";
import { themeEmittor } from "../lib/emittors";

function print(...props: any) {
  if (
    typeof window !== "undefined" &&
    (window as any).shadcnThemeEditorDebugMode
  ) {
    console.log(...props);
  }
}

const ZodTheme = z.array(
  z.object({
    title: z.string(),
    variable: z.string(),
    color: z.object({
      h: z.number(),
      s: z.number(),
      l: z.number(),
    }),
  })
);

function SideBarColors() {

  const { resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>();
  useEffect(() => {
    setCurrentTheme(resolvedTheme);
  }, [resolvedTheme]);

  const [colors, setColors] = useEmittor(themeEmittor.e);
  const saveLocalStorage = useDebounceCallback(() => {
    print("Saving the theme to local storage");
    ls.setLocalStorage(LOCAL_STORAGE_KEY + ":" + currentTheme, getColors(true));
  }, 2000);

  useEffect(() => {
    // resetTheme();
    print("reading theme", LOCAL_STORAGE_KEY + ":" + currentTheme);
    let theme = ls.getLocalStorageItem<ThemeWithHSLColor[]>(
      LOCAL_STORAGE_KEY + ":" + currentTheme
    );
    if (theme) {
      try {
        const isValid = ZodTheme.parse(theme);
        print("theme is valid and appling", isValid);
        print("applied theme", theme);
        themeEmittor.applyTheme(theme);
        return;
      } catch (error) {
        print("invalid theme found in localStorage");
        // localStorage.removeItem(LOCAL_STORAGE_KEY+":"+currentTheme); //* remove key
      }
    }
    print("theme not found in localStorage");
    print("Now theme: ", theme);
    themeEmittor.setDefaultTheme();
  }, [currentTheme]);
  return (
    <>
      {colors?.map((color) => (
        <Item
          key={color.variable.replace(/^-+/, "") + currentTheme}
          onSave={saveLocalStorage}
          theme={color}
        />
      ))}
    </>
  );
}

export default SideBarColors;
