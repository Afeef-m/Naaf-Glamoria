const dictionaries = {
  en: {
     shop: "SHOP",
    collections: "COLLECTIONS",
    values: "OUR VALUES",
    about: "ABOUT US",
    contact: "CONTACT",
    search: "SEARCH",
    wishlist: "WISHLIST",
    account: "ACCOUNT",
    menu: "Menu",
    comingSoon: "Coming Soon...",
    comingSoonMobile: "Coming Soon",
    stayGolden: "Stay Golden Stay Glowing",
    brandName: "Naaf Glamoria",
    contactUs: "Contact Us",
  },
   ar: {
    shop: "تسوق",
    collections: "مجموعات",
    values: "قيمنا",
    about: "تواصل معنا",
    contact: "اتصل بنا",
    search: "بحث",
    wishlist: "قائمة الأمنيات",
    account: "حسابي",
    menu: "قائمة",
    comingSoon: "قريباً...",
    comingSoonMobile: "قريباً",
    stayGolden: "ابقي ذهبية، ابقي متألقة",
    brandName: "ناف جلاموريا",
    contactUs: "تواصل معنا",
  },
};

export function getDictionary(locale: "en" | "ar") {
  return dictionaries[locale];
}