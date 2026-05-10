"use client";

import { createContext, useContext } from "react";
import type { Lang, Translations } from "@/data/portfolio";
import { T } from "@/data/portfolio";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

export const LangContext = createContext<LangContextType>({
  lang: "tr",
  setLang: () => {},
  t: T.tr,
});

export const useLang = () => useContext(LangContext);
