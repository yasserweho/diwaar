import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export type Lang = "en" | "ur";

export function tx(lang: string, en: string, ur: string) {
  return lang === "ur" ? ur : en;
}

const CITY_UR: Record<string, string> = {
  Lahore: "لاہور",
  Karachi: "کراچی",
  Islamabad: "اسلام آباد",
  Rawalpindi: "راولپنڈی",
  Multan: "ملتان",
  Faisalabad: "فیصل آباد",
  Gujranwala: "گوجرانوالہ",
  Peshawar: "پشاور",
  Sialkot: "سیالکوٹ",
  Hyderabad: "حیدرآباد",
  Quetta: "کوئٹہ",
  Gwadar: "گوادر",
  Bahawalpur: "بہاولپور",
  Sargodha: "سرگودھا",
  Sahiwal: "ساہیوال",
  Abbottabad: "ایبٹ آباد",
  Mardan: "مردان",
  Gujrat: "گجرات",
  Jhelum: "جہلم",
  Sheikhupura: "شیخوپورہ",
  "Rahim Yar Khan": "رحیم یار خان",
  Murree: "مری",
  Wah: "واہ",
  Okara: "اوکاڑہ",
  Burewala: "بوریوالا",
  Chunian: "چونیاں",
  "Dera Ghazi Khan": "ڈیرہ غازی خان",
  Gharo: "گھارو",
  Haripur: "ہری پور",
  "Hassan Abdal": "حسن ابدال",
  "Sarai Alamgir": "سرائے عالمگیر",
  Sukkur: "سکھر",
  Swabi: "صوابی",
};

export function cityLabel(name: string, lang: string) {
  if (lang !== "ur") return name;
  return CITY_UR[name] ?? name;
}

export function useLang() {
  const lang = useAppStore((s) => (s.lang === "ur" ? "ur" : "en"));
  const setLang = useAppStore((s) => s.setLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);
  return { lang, setLang, ur: lang === "ur" };
}
