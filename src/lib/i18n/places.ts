import { Place, DistrictCode, PlaceCategory } from "@/types";
import { DISTRICT_NAME, CATEGORIES } from "@/lib/constants";
import { Lang } from "@/store/useLangStore";
import { PLACE_ADDITIONS } from "./placeAdditions";

export const DISTRICT_NAME_EN: Record<DistrictCode, string> = {
  indonesia: "Indonesia",
  chinese: "Chinese-Korean",
  vietnam: "Vietnam",
  thai: "Thailand",
  southasia: "India · Nepal",
  centralasia: "Central Asia",
};

export const DISTRICT_NAME_ZH: Record<DistrictCode, string> = {
  indonesia: "印度尼西亚",
  chinese: "朝鲜族",
  vietnam: "越南",
  thai: "泰国",
  southasia: "印度·尼泊尔",
  centralasia: "中亚",
};

export const DISTRICT_NAME_JA: Record<DistrictCode, string> = {
  indonesia: "インドネシア",
  chinese: "朝鮮族",
  vietnam: "ベトナム",
  thai: "タイ",
  southasia: "インド・ネパール",
  centralasia: "中央アジア",
};

export const DISTRICT_NAME_RU: Record<DistrictCode, string> = {
  indonesia: "Индонезия",
  chinese: "Корейцы Китая",
  vietnam: "Вьетнам",
  thai: "Таиланд",
  southasia: "Индия и Непал",
  centralasia: "Центральная Азия",
};

export const DISTRICT_NAME_ID: Record<DistrictCode, string> = {
  indonesia: "Indonesia",
  chinese: "Tionghoa-Korea",
  vietnam: "Vietnam",
  thai: "Thailand",
  southasia: "India · Nepal",
  centralasia: "Asia Tengah",
};

const DISTRICT_NAME_BY_LANG: Partial<Record<Lang, Record<DistrictCode, string>>> = {
  en: DISTRICT_NAME_EN,
  zh: DISTRICT_NAME_ZH,
  ja: DISTRICT_NAME_JA,
  ru: DISTRICT_NAME_RU,
  id: DISTRICT_NAME_ID,
};

export function localizeDistrictName(code: DistrictCode, lang: Lang): string {
  return DISTRICT_NAME_BY_LANG[lang]?.[code] ?? DISTRICT_NAME[code];
}

export const CATEGORY_NAME_EN: Record<PlaceCategory | "all", string> = {
  all: "All",
  restaurant: "Restaurants",
  experience: "Experiences",
  grocery: "Grocery",
  photo: "Photo Spots",
};

export const CATEGORY_NAME_ZH: Record<PlaceCategory | "all", string> = {
  all: "全部",
  restaurant: "餐厅",
  experience: "文化体验",
  grocery: "食品店",
  photo: "拍照点",
};

export const CATEGORY_NAME_JA: Record<PlaceCategory | "all", string> = {
  all: "すべて",
  restaurant: "飲食店",
  experience: "文化体験",
  grocery: "食料品店",
  photo: "フォトスポット",
};

export const CATEGORY_NAME_RU: Record<PlaceCategory | "all", string> = {
  all: "Все",
  restaurant: "Рестораны",
  experience: "Культурные программы",
  grocery: "Продукты",
  photo: "Фотозоны",
};

export const CATEGORY_NAME_ID: Record<PlaceCategory | "all", string> = {
  all: "Semua",
  restaurant: "Rumah Makan",
  experience: "Pengalaman Budaya",
  grocery: "Toko Bahan Makanan",
  photo: "Spot Foto",
};

const CATEGORY_NAME_BY_LANG: Partial<
  Record<Lang, Record<PlaceCategory | "all", string>>
> = {
  en: CATEGORY_NAME_EN,
  zh: CATEGORY_NAME_ZH,
  ja: CATEGORY_NAME_JA,
  ru: CATEGORY_NAME_RU,
  id: CATEGORY_NAME_ID,
};

export function localizeCategoryName(
  code: PlaceCategory | "all",
  lang: Lang
): string {
  return (
    CATEGORY_NAME_BY_LANG[lang]?.[code] ??
    CATEGORIES.find((c) => c.code === code)?.name ??
    code
  );
}

/**
 * 가게 이름·한줄설명·태그의 영어 번역.
 *
 * story·quiz는 이번 범위에 넣지 않았다 — 전체 장소의 문화 스토리텔링 문단을
 * 전부 옮기는 건 별도 작업으로 분리하는 게 맞고, 지금은 길찾기·탐색에
 * 필요한 최소 정보(이름·설명·태그)만 영어로 제공한다. 없는 id는 아래
 * localizePlace()가 한국어 값으로 자연스럽게 대체한다.
 */
export const PLACES_EN: Record<
  string,
  { name: string; description: string; tags: string[] }
> = {
  "almodina-halal": {
    name: "Al Madina Halal Mart",
    description: "Where Muslim residents do their grocery shopping",
    tags: ["Halal", "Spices", "Imported Foods"],
  },
  "lepeshka-market": {
    name: "Lepyoshka",
    description: "Uzbek bakery and Russian–Central Asian grocery store",
    tags: ["Uzbek Bread", "Central Asian Groceries", "Imported Foods"],
  },
  "world-food-market": {
    name: "World Food",
    description: "Asian grocery store with Southeast Asian ingredients and tropical fruit",
    tags: ["Southeast Asian Food", "Tropical Fruit", "Imported Foods"],
  },
  "k2-nepal": {
    name: "K2 Nepal Zone",
    description: "Grocery store for Nepali residents",
    tags: ["Nepali Food", "Spices", "Lentils"],
  },
  "sin-china-food": {
    name: "Sin China Food",
    description: "Grocery store for Chinese and Chinese-Korean residents",
    tags: ["Chinese Food", "Spices", "Frozen Dumplings"],
  },
  batavia: {
    name: "Batavia",
    description: "Indonesian restaurant near the entrance of Damunhwa-gil",
    tags: ["Nasi Goreng", "Mie Goreng", "Halal"],
  },
  "aneka-rasa": {
    name: "Aneka Rasa",
    description: "Indonesian home cooking, name means \"many flavors\"",
    tags: ["Rendang", "Satay", "Halal"],
  },
  nusantara: {
    name: "Nusantara",
    description: "Pan-Asian restaurant named after the Indonesian archipelago",
    tags: ["Nasi Goreng", "Indonesian Coffee", "Halal"],
  },
  "taesan-skewer": {
    name: "Taesan Lamb Skewers",
    description: "Charcoal-grilled lamb skewer specialist",
    tags: ["Lamb Skewers", "Grilled Skewers"],
  },
  "yanji-tofu": {
    name: "Yanji Chodubu",
    description: "Yanbian-style soft tofu from the Chinese-Korean community",
    tags: ["Soft Tofu", "Yanbian Food"],
  },
  chunhyangsan: {
    name: "Chunhyangsan",
    description: "Malatang counter where you pick your own ingredients",
    tags: ["Malatang", "Chinese Cuisine", "Spicy"],
  },
  "vietnam-hometown": {
    name: "Vietnam Hometown Restaurant",
    description: "The closest Vietnamese restaurant to Ansan Station",
    tags: ["Pho", "Banh Mi Cha"],
  },
  "dieu-hien-quan": {
    name: "Dieu Hien Quan",
    description: "Vietnamese restaurant tucked in Damunhwa 1-gil",
    tags: ["Pho", "Vietnamese Food"],
  },
  "suwal-thai": {
    name: "Suwal Thai Restaurant",
    description: "Thai food specialist on Damunhwa-gil",
    tags: ["Tom Yum Goong", "Pad Thai", "Spicy"],
  },
  "pad-thai": {
    name: "Pad Thai",
    description: "A restaurant named after Thailand's signature stir-fried noodle",
    tags: ["Pad Thai", "Thai Food"],
  },
  kantipur: {
    name: "Kantipur Restaurant",
    description: "Named after the old name of Kathmandu, Nepal",
    tags: ["Dal Bhat", "Momo", "Tandoori"],
  },
  "new-taj-mahal": {
    name: "New Taj Mahal",
    description: "Indian restaurant cooking in a clay tandoor oven",
    tags: ["Curry", "Tandoori Chicken", "Naan", "Spicy"],
  },
  samarkand: {
    name: "Samarkand",
    description: "Uzbek restaurant serving clay-oven cooking",
    tags: ["Shashlik", "Plov", "Lepyoshka"],
  },
  "imperia-food": {
    name: "Imperia Food",
    description: "Grocery store for Russian and Central Asian ingredients",
    tags: ["Russian Bread", "Imported Foods", "Medovik"],
  },
  "troy-kebab": {
    name: "Troy Kebab",
    description: "Turkish kebab shop right in the middle of Damunhwa-gil",
    tags: ["Doner Kebab", "Turkish Food"],
  },
  "jakarta-resto": {
    name: "Jakarta Restaurant",
    description: "Pan-Asian restaurant named after Indonesia's capital",
    tags: ["Nasi Goreng", "Halal"],
  },
  gatotkaca: {
    name: "Gatotkaca",
    description: "Named after a hero from traditional Javanese puppet theater",
    tags: ["Nasi Goreng", "Halal"],
  },
  "warung-kita": {
    name: "Warung Kita",
    description: "Indonesian restaurant, name means \"our little shop\"",
    tags: ["Nasi Goreng", "Indonesian Home Cooking"],
  },
  "royal-resto": {
    name: "Royal Restaurant",
    description: "Pan-Asian restaurant on Wongok-ro",
    tags: ["Southeast Asian Food"],
  },
  "asiana-resto": {
    name: "Asiana Restaurant",
    description: "Indian restaurant on Damunhwa 2-gil",
    tags: ["Curry", "Naan", "Spicy"],
  },
  "agan-resto": {
    name: "Agan Restaurant & Bar",
    description: "Indian restaurant and bar at the start of Damunhwa-gil",
    tags: ["Curry", "Indian Food", "Spicy"],
  },
  solti: {
    name: "Solti Indo-Nepal Restaurant",
    description: "Serves both Indian and Nepali dishes",
    tags: ["Curry", "Dal Bhat", "Spicy"],
  },
  nirosa: {
    name: "Nirosa Restaurant",
    description: "Indian restaurant on Wongok-ro",
    tags: ["Curry", "Tandoori", "Spicy"],
  },
  "indo-nepal": {
    name: "Indo-Nepal Restaurant",
    description: "Indian and Nepali restaurant on Bubu-ro",
    tags: ["Curry", "Momo", "Spicy"],
  },
  "injing-myanmar": {
    name: "Injing Myanmar Restaurant",
    description: "Myanmar restaurant on Damunhwa-gil",
    tags: ["Myanmar Food", "Shan Noodles"],
  },
  "thai-noodle": {
    name: "Thai Noodle",
    description: "Thai rice-noodle shop on Bubu-ro",
    tags: ["Pho-style Noodles", "Thai Food"],
  },
  "duk-kun": {
    name: "Duk Kun",
    description: "Thai restaurant on Wonil 1-gil",
    tags: ["Thai Food"],
  },
  woaini: {
    name: "Woaini Skewer & Hotpot Buffet",
    description: "Lamb skewers and hotpot served buffet-style",
    tags: ["Lamb Skewers", "Hotpot Buffet"],
  },
  cheonmaeja: {
    name: "Cheonmaeja",
    description: "Hotpot and shabu-shabu specialist on Wongok-ro",
    tags: ["Hotpot", "Shabu-Shabu"],
  },
  lingongzi: {
    name: "Lingongzi",
    description: "Chinese restaurant on Damunhwa-gil",
    tags: ["Chinese Cuisine"],
  },
  "ottugi-noodle": {
    name: "Ottugi Hand-Pulled Noodles",
    description: "Noodles hand-pulled to order",
    tags: ["Hand-Pulled Noodles", "Knife-Cut Noodles"],
  },
  "beijing-duck": {
    name: "Beijing Roast Duck",
    description: "Peking duck specialist on Damunhwa 2-gil",
    tags: ["Peking Duck", "Duck Dishes"],
  },
  gangttuk: {
    name: "Ansan Original Gangttuk Skewers",
    description: "Grilled skewer specialist on Wongok-ro",
    tags: ["Lamb Skewers", "Grilled Skewers"],
  },
  sinbukgyeong: {
    name: "Sinbukgyeong Malatang",
    description: "Malatang shop on Wongok-ro",
    tags: ["Malatang", "Mala Xiang Guo", "Spicy"],
  },
  "mama-gyoja": {
    name: "Mama Gyoja Hall",
    description: "Hand-folded dumpling specialist",
    tags: ["Gyoza", "Dumplings"],
  },
  "bokwang-mandu": {
    name: "Bokwang Dumplings",
    description: "Dumpling shop on Wonbon-ro",
    tags: ["Dumplings", "Snacks"],
  },
  "yanji-skewer2": {
    name: "Yanji Lamb Skewers",
    description: "Skewer shop on Bubu-ro 1-gil",
    tags: ["Lamb Skewers"],
  },
  janggang: {
    name: "Janggang Restaurant",
    description: "Chinese restaurant on Bubu-ro 1-gil",
    tags: ["Chinese Cuisine", "Jjajangmyeon"],
  },
  "jindallae-naengmyeon": {
    name: "Yanji Jindallae Cold Noodles",
    description: "Yanbian-style cold noodle specialist",
    tags: ["Yanji Cold Noodles", "Cold Noodles"],
  },
  ttungbo: {
    name: "Ttungbo Lamb Skewers",
    description: "Skewer shop on Wonbon-ro",
    tags: ["Lamb Skewers"],
  },
  "sarai-kebab": {
    name: "Sarai Doner Kebab",
    description: "Doner kebab shop on Wongok-ro",
    tags: ["Doner Kebab"],
  },
  "bat-kebab": {
    name: "Bat Kebab",
    description: "Turkish kebab shop near Ansan Station",
    tags: ["Kebab", "Turkish Food"],
  },
  "culture-center": {
    name: "World Culture Experience Center",
    description: "Free hall for trying on costumes and instruments from around the world",
    tags: ["Traditional Costumes", "World Instruments", "Free Programs"],
  },
  "borderless-photo": {
    name: "Borderless Street Photo Spot",
    description: "Signpost and flag-lined street pointing toward cities worldwide",
    tags: ["World Flags", "City Signpost", "Murals"],
  },
};

/** 가게 이름·한줄설명·태그의 중국어(간체) 번역. 범위는 영어판과 동일 — story·quiz는 제외. */
export const PLACES_ZH: Record<
  string,
  { name: string; description: string; tags: string[] }
> = {
  "almodina-halal": {
    name: "阿尔莫迪纳清真超市",
    description: "穆斯林居民日常采购的清真食品店",
    tags: ["清真", "香料", "进口食品"],
  },
  "lepeshka-market": {
    name: "列波什卡",
    description: "销售乌兹别克烤饼和俄罗斯、中亚食品的商店",
    tags: ["乌兹别克烤饼", "中亚食品", "进口食品"],
  },
  "world-food-market": {
    name: "世界食品",
    description: "销售东南亚食材和热带水果的亚洲食品店",
    tags: ["东南亚食品", "热带水果", "进口食品"],
  },
  "k2-nepal": {
    name: "K2尼泊尔专区",
    description: "尼泊尔居民的食品店",
    tags: ["尼泊尔食品", "香料", "扁豆"],
  },
  "sin-china-food": {
    name: "新中国食品",
    description: "中国及朝鲜族居民常去的食品店",
    tags: ["中国食品", "香料", "冷冻饺子"],
  },
  batavia: {
    name: "巴达维亚",
    description: "位于多文化街入口附近的印尼餐厅",
    tags: ["印尼炒饭", "印尼炒面", "清真"],
  },
  "aneka-rasa": {
    name: "安尼卡拉萨",
    description: "意为“多种风味”的印尼家常菜餐厅",
    tags: ["仁当牛肉", "沙嗲", "清真"],
  },
  nusantara: {
    name: "努桑塔拉",
    description: "以印尼群岛命名的亚洲餐厅",
    tags: ["印尼炒饭", "印尼咖啡", "清真"],
  },
  "taesan-skewer": {
    name: "泰山羊肉串",
    description: "炭烤羊肉串专门店",
    tags: ["羊肉串", "烤串"],
  },
  "yanji-tofu": {
    name: "延吉初豆腐",
    description: "提供延边式嫩豆腐的朝鲜族餐厅",
    tags: ["嫩豆腐", "延边料理"],
  },
  chunhyangsan: {
    name: "春香山",
    description: "自选食材麻辣烫店",
    tags: ["麻辣烫", "中华料理", "辛辣"],
  },
  "vietnam-hometown": {
    name: "越南故乡食堂",
    description: "离安山站最近的越南餐厅",
    tags: ["越南河粉", "越式法棍"],
  },
  "dieu-hien-quan": {
    name: "蒂尤希恩馆",
    description: "位于多文化1街的越南餐厅",
    tags: ["越南河粉", "越南料理"],
  },
  "suwal-thai": {
    name: "苏瓦泰国餐厅",
    description: "多文化街的泰国料理专门店",
    tags: ["冬阴功汤", "泰式炒河粉", "辛辣"],
  },
  "pad-thai": {
    name: "泰式炒河粉",
    description: "以泰国代表炒面命名的餐厅",
    tags: ["泰式炒河粉", "泰国料理"],
  },
  kantipur: {
    name: "坎蒂普尔餐厅",
    description: "以尼泊尔加德满都旧名命名",
    tags: ["达尔巴特", "馍馍", "坦都里"],
  },
  "new-taj-mahal": {
    name: "新泰姬陵",
    description: "用泥炉烤制的印度餐厅",
    tags: ["咖喱", "坦都里鸡", "印度烤饼", "辛辣"],
  },
  samarkand: {
    name: "撒马尔罕",
    description: "乌兹别克斯坦泥炉料理餐厅",
    tags: ["沙什利克烤肉", "手抓饭", "烤馕"],
  },
  "imperia-food": {
    name: "帝国食品",
    description: "出售俄罗斯及中亚食材的商店",
    tags: ["俄式面包", "进口食品", "蜂蜜蛋糕"],
  },
  "troy-kebab": {
    name: "特洛伊烤肉卷",
    description: "位于多文化街中心的土耳其烤肉店",
    tags: ["土耳其烤肉卷", "土耳其料理"],
  },
  "jakarta-resto": {
    name: "雅加达餐厅",
    description: "以印尼首都命名的亚洲餐厅",
    tags: ["印尼炒饭", "清真"],
  },
  gatotkaca: {
    name: "加托特卡查",
    description: "以爪哇传统木偶戏英雄命名",
    tags: ["印尼炒饭", "清真"],
  },
  "warung-kita": {
    name: "瓦龙基塔",
    description: "意为“我们的小店”的印尼餐厅",
    tags: ["印尼炒饭", "印尼家常菜"],
  },
  "royal-resto": {
    name: "皇家餐厅",
    description: "元谷路的亚洲料理店",
    tags: ["东南亚料理"],
  },
  "asiana-resto": {
    name: "亚洲娜餐厅",
    description: "多文化2街的印度餐厅",
    tags: ["咖喱", "印度烤饼", "辛辣"],
  },
  "agan-resto": {
    name: "阿甘餐厅酒吧",
    description: "多文化街入口处的印度餐厅兼酒吧",
    tags: ["咖喱", "印度料理", "辛辣"],
  },
  solti: {
    name: "索尔蒂印尼泊尔餐厅",
    description: "同时供应印度和尼泊尔料理",
    tags: ["咖喱", "达尔巴特", "辛辣"],
  },
  nirosa: {
    name: "尼罗萨餐厅",
    description: "元谷路的印度餐厅",
    tags: ["咖喱", "坦都里", "辛辣"],
  },
  "indo-nepal": {
    name: "印度尼泊尔餐厅",
    description: "富夫路的印度尼泊尔餐厅",
    tags: ["咖喱", "馍馍", "辛辣"],
  },
  "injing-myanmar": {
    name: "因京缅甸餐厅",
    description: "多文化街的缅甸餐厅",
    tags: ["缅甸料理", "掸邦米线"],
  },
  "thai-noodle": {
    name: "泰式米粉",
    description: "富夫路的泰式米粉店",
    tags: ["米粉", "泰国料理"],
  },
  "duk-kun": {
    name: "德昆",
    description: "元日1街的泰国餐厅",
    tags: ["泰国料理"],
  },
  woaini: {
    name: "我爱你羊肉串火锅自助",
    description: "羊肉串和火锅自助餐厅",
    tags: ["羊肉串", "火锅自助"],
  },
  cheonmaeja: {
    name: "千梅子",
    description: "元谷路的火锅涮涮锅专门店",
    tags: ["火锅", "涮涮锅"],
  },
  lingongzi: {
    name: "林公子",
    description: "多文化街的中华料理店",
    tags: ["中华料理"],
  },
  "ottugi-noodle": {
    name: "五斗鸡手工面",
    description: "现场手工拉面店",
    tags: ["手工拉面", "刀削面"],
  },
  "beijing-duck": {
    name: "北京烤鸭",
    description: "多文化2街的北京烤鸭专门店",
    tags: ["北京烤鸭", "鸭肉料理"],
  },
  gangttuk: {
    name: "安山元祖江渡口烤串",
    description: "元谷路的烤串专门店",
    tags: ["羊肉串", "烤串"],
  },
  sinbukgyeong: {
    name: "新北京麻辣烫",
    description: "元谷路的麻辣烫店",
    tags: ["麻辣烫", "麻辣香锅", "辛辣"],
  },
  "mama-gyoja": {
    name: "妈妈饺子馆",
    description: "手工水饺专门店",
    tags: ["煎饺", "水饺"],
  },
  "bokwang-mandu": {
    name: "福旺饺子",
    description: "元本路的饺子店",
    tags: ["水饺", "小吃"],
  },
  "yanji-skewer2": {
    name: "延吉羊肉串",
    description: "富夫路1街的羊肉串店",
    tags: ["羊肉串"],
  },
  janggang: {
    name: "长江饭店",
    description: "富夫路1街的中华料理店",
    tags: ["中华料理", "炸酱面"],
  },
  "jindallae-naengmyeon": {
    name: "延吉金达莱冷面",
    description: "延边风味冷面专门店",
    tags: ["延吉冷面", "冷面"],
  },
  ttungbo: {
    name: "胖子羊肉串",
    description: "元本路的羊肉串店",
    tags: ["羊肉串"],
  },
  "sarai-kebab": {
    name: "萨莱土耳其烤肉卷",
    description: "元谷路的土耳其烤肉卷店",
    tags: ["土耳其烤肉卷"],
  },
  "bat-kebab": {
    name: "巴特烤肉卷",
    description: "安山站附近的土耳其烤肉店",
    tags: ["烤肉卷", "土耳其料理"],
  },
  "culture-center": {
    name: "世界文化体验馆",
    description: "免费体验世界各国服饰乐器的场馆",
    tags: ["传统服饰", "世界乐器", "免费体验"],
  },
  "borderless-photo": {
    name: "无国界街拍照点",
    description: "指向世界各国方向的路标与万国旗街道",
    tags: ["万国旗", "城市路标", "壁画"],
  },
};

/** 가게 이름·한줄설명·태그의 일본어 번역. 범위는 영어판과 동일. */
export const PLACES_JA: Record<
  string,
  { name: string; description: string; tags: string[] }
> = {
  "almodina-halal": {
    name: "アルマディナ・ハラールマート",
    description: "ムスリム住民が買い物をするハラール食品店",
    tags: ["ハラール", "スパイス", "輸入食品"],
  },
  "lepeshka-market": {
    name: "レピョーシカ",
    description: "ウズベキスタンの窯焼きパンとロシア・中央アジア食品を扱う店",
    tags: ["ウズベキスタンのパン", "中央アジア食品", "輸入食品"],
  },
  "world-food-market": {
    name: "ワールドフード",
    description: "東南アジアの食材やトロピカルフルーツがそろうアジア食料品店",
    tags: ["東南アジア食品", "トロピカルフルーツ", "輸入食品"],
  },
  "k2-nepal": {
    name: "K2ネパールゾーン",
    description: "ネパール住民の食料品店",
    tags: ["ネパール食品", "スパイス", "レンズ豆"],
  },
  "sin-china-food": {
    name: "新中国食品",
    description: "中国・朝鮮族住民が通う食料品店",
    tags: ["中国食品", "スパイス", "冷凍餃子"],
  },
  batavia: {
    name: "バタビア",
    description: "多文化通り入口付近のインドネシア料理店",
    tags: ["ナシゴレン", "ミーゴレン", "ハラール"],
  },
  "aneka-rasa": {
    name: "アネカラサ",
    description: "「様々な味」という意味のインドネシア家庭料理店",
    tags: ["ルンダン", "サテ", "ハラール"],
  },
  nusantara: {
    name: "ヌサンタラ",
    description: "インドネシア諸島全体を意味する名前のアジア料理店",
    tags: ["ナシゴレン", "インドネシアコーヒー", "ハラール"],
  },
  "taesan-skewer": {
    name: "テサン羊肉串",
    description: "炭火焼き羊肉串専門店",
    tags: ["羊肉串", "串焼き"],
  },
  "yanji-tofu": {
    name: "延吉初豆腐",
    description: "延辺式おぼろ豆腐を提供する朝鮮族の食堂",
    tags: ["おぼろ豆腐", "延辺料理"],
  },
  chunhyangsan: {
    name: "春香山",
    description: "具材を選んで盛るマーラータン店",
    tags: ["マーラータン", "中国料理", "辛い料理"],
  },
  "vietnam-hometown": {
    name: "ベトナム故郷食堂",
    description: "アンサン駅から一番近いベトナム料理店",
    tags: ["フォー", "バインミー"],
  },
  "dieu-hien-quan": {
    name: "ディウヒエンクアン",
    description: "多文化1通りのベトナム料理店",
    tags: ["フォー", "ベトナム料理"],
  },
  "suwal-thai": {
    name: "スワルタイレストラン",
    description: "多文化通りのタイ料理専門店",
    tags: ["トムヤムクン", "パッタイ", "辛い料理"],
  },
  "pad-thai": {
    name: "パッタイ",
    description: "タイ代表の焼きそばを店名にした店",
    tags: ["パッタイ", "タイ料理"],
  },
  kantipur: {
    name: "カンティプールレストラン",
    description: "ネパール・カトマンズの旧名にちなむ店",
    tags: ["ダルバート", "モモ", "タンドリー"],
  },
  "new-taj-mahal": {
    name: "ニュータージマハル",
    description: "土窯で焼くインド料理店",
    tags: ["カレー", "タンドリーチキン", "ナン", "辛い料理"],
  },
  samarkand: {
    name: "サマルカンド",
    description: "ウズベキスタンの土窯料理店",
    tags: ["シャシリク", "プロフ", "レピョーシカ"],
  },
  "imperia-food": {
    name: "インペリアフード",
    description: "ロシア・中央アジアの食材を売る店",
    tags: ["ロシアパン", "輸入食品", "メドヴィク"],
  },
  "troy-kebab": {
    name: "トロイケバブ",
    description: "多文化通り中心部のトルコケバブ店",
    tags: ["ドネルケバブ", "トルコ料理"],
  },
  "jakarta-resto": {
    name: "ジャカルタ",
    description: "インドネシアの首都名を冠したアジア料理店",
    tags: ["ナシゴレン", "ハラール"],
  },
  gatotkaca: {
    name: "ガトットカチャ",
    description: "ジャワの伝統人形劇の英雄名にちなむ店",
    tags: ["ナシゴレン", "ハラール"],
  },
  "warung-kita": {
    name: "ワルンキタ",
    description: "「私たちの店」という意味のインドネシア料理店",
    tags: ["ナシゴレン", "インドネシア家庭料理"],
  },
  "royal-resto": {
    name: "ロイヤルレストラン",
    description: "ウォンゴク路のアジア料理店",
    tags: ["東南アジア料理"],
  },
  "asiana-resto": {
    name: "アシアナレストラン",
    description: "多文化2通りのインド料理店",
    tags: ["カレー", "ナン", "辛い料理"],
  },
  "agan-resto": {
    name: "アガンレストラン&バー",
    description: "多文化通り入口のインド料理店兼バー",
    tags: ["カレー", "インド料理", "辛い料理"],
  },
  solti: {
    name: "ソルティ インド・ネパール料理店",
    description: "インドとネパールの料理を共に提供",
    tags: ["カレー", "ダルバート", "辛い料理"],
  },
  nirosa: {
    name: "ニロサレストラン",
    description: "ウォンゴク路のインド料理店",
    tags: ["カレー", "タンドリー", "辛い料理"],
  },
  "indo-nepal": {
    name: "インド・ネパール料理店",
    description: "ブブ路のインド・ネパール料理店",
    tags: ["カレー", "モモ", "辛い料理"],
  },
  "injing-myanmar": {
    name: "インジンミャンマーレストラン",
    description: "多文化通りのミャンマー料理店",
    tags: ["ミャンマー料理", "シャン麺"],
  },
  "thai-noodle": {
    name: "タイ米麺",
    description: "ブブ路のタイ米麺店",
    tags: ["米麺", "タイ料理"],
  },
  "duk-kun": {
    name: "トックン",
    description: "ウォンイル1通りのタイ料理店",
    tags: ["タイ料理"],
  },
  woaini: {
    name: "ウォアイニー羊肉串火鍋ビュッフェ",
    description: "羊肉串と火鍋をビュッフェで提供する店",
    tags: ["羊肉串", "火鍋ビュッフェ"],
  },
  cheonmaeja: {
    name: "チョンメジャ",
    description: "ウォンゴク路の火鍋・シャブシャブ専門店",
    tags: ["火鍋", "シャブシャブ"],
  },
  lingongzi: {
    name: "リンゴンズ",
    description: "多文化通りの中国料理店",
    tags: ["中国料理"],
  },
  "ottugi-noodle": {
    name: "オットゥギ手打ち麺",
    description: "その場で打つ手打ち麺の店",
    tags: ["手打ち麺", "刀削麺"],
  },
  "beijing-duck": {
    name: "北京ダック",
    description: "多文化2通りの北京ダック専門店",
    tags: ["北京ダック", "ダック料理"],
  },
  gangttuk: {
    name: "アンサン元祖ガンドゥック串焼き",
    description: "ウォンゴク路の串焼き専門店",
    tags: ["羊肉串", "串焼き"],
  },
  sinbukgyeong: {
    name: "新北京マーラータン",
    description: "ウォンゴク路のマーラータン店",
    tags: ["マーラータン", "マーラーシャングオ", "辛い料理"],
  },
  "mama-gyoja": {
    name: "ママ餃子館",
    description: "手作り餃子専門店",
    tags: ["焼き餃子", "水餃子"],
  },
  "bokwang-mandu": {
    name: "ポクワン餃子",
    description: "ウォンボン路の餃子店",
    tags: ["水餃子", "軽食"],
  },
  "yanji-skewer2": {
    name: "延吉羊肉串",
    description: "ブブ路1通りの羊肉串店",
    tags: ["羊肉串"],
  },
  janggang: {
    name: "長江飯店",
    description: "ブブ路1通りの中国料理店",
    tags: ["中国料理", "ジャージャー麺"],
  },
  "jindallae-naengmyeon": {
    name: "延吉ジンダルレ冷麺",
    description: "延辺式冷麺専門店",
    tags: ["延吉冷麺", "冷麺"],
  },
  ttungbo: {
    // 屋号は意訳せず音写する。「뚱보」を「デブ」と訳すと日本語では侮蔑的に読める。
    name: "トゥンボ羊肉串",
    description: "ウォンボン路の羊肉串店",
    tags: ["羊肉串"],
  },
  "sarai-kebab": {
    name: "サライドネルケバブ",
    description: "ウォンゴク路のドネルケバブ店",
    tags: ["ドネルケバブ"],
  },
  "bat-kebab": {
    name: "バットケバブ",
    description: "アンサン駅前のトルコケバブ店",
    tags: ["ケバブ", "トルコ料理"],
  },
  "culture-center": {
    name: "世界文化体験館",
    description: "世界各国の衣装・楽器を体験できる無料施設",
    tags: ["伝統衣装", "世界の楽器", "無料体験"],
  },
  "borderless-photo": {
    name: "国境なき通りフォトスポット",
    description: "世界各国の方向・距離を示す道標と万国旗の通り",
    tags: ["万国旗", "都市道標", "壁画"],
  },
};

/** 가게 이름·한줄설명·태그의 러시아어 번역. 범위는 영어판과 동일. */
export const PLACES_RU: Record<
  string,
  { name: string; description: string; tags: string[] }
> = {
  "almodina-halal": {
    name: "Халяль-маркет Аль-Мадина",
    description: "Магазин, где закупаются мусульманские жители",
    tags: ["Халяль", "Специи", "Импортные продукты"],
  },
  "lepeshka-market": {
    name: "Лепёшка",
    description: "Узбекская пекарня и магазин продуктов из России и Центральной Азии",
    tags: ["Узбекский хлеб", "Продукты Центральной Азии", "Импортные продукты"],
  },
  "world-food-market": {
    name: "World Food",
    description: "Магазин азиатских продуктов, фруктов и ингредиентов из Юго-Восточной Азии",
    tags: ["Продукты Юго-Восточной Азии", "Тропические фрукты", "Импортные продукты"],
  },
  "k2-nepal": {
    name: "K2 Непал",
    description: "Продуктовый магазин для непальских жителей",
    tags: ["Непальские продукты", "Специи", "Чечевица"],
  },
  "sin-china-food": {
    name: "Син Чайна Фуд",
    description: "Магазин для китайских жителей и корейцев Китая",
    tags: ["Китайские продукты", "Специи", "Замороженные пельмени"],
  },
  batavia: {
    name: "Батавия",
    description: "Индонезийский ресторан у входа на улицу Тамунхвагиль",
    tags: ["Наси-горенг", "Ми-горенг", "Халяль"],
  },
  "aneka-rasa": {
    name: "Анека Раса",
    description: "Индонезийская домашняя кухня, название означает «разные вкусы»",
    tags: ["Ренданг", "Сатай", "Халяль"],
  },
  nusantara: {
    name: "Нусантара",
    description: "Азиатский ресторан, названный в честь индонезийского архипелага",
    tags: ["Наси-горенг", "Индонезийский кофе", "Халяль"],
  },
  "taesan-skewer": {
    name: "Тэсан (шашлык из баранины)",
    description: "Специализация — шашлык на углях",
    tags: ["Шашлык из баранины", "Шашлык"],
  },
  "yanji-tofu": {
    name: "Яньцзи Чодубу",
    // 원곡동은 조선족(корейцы Китая) 공동체다. 고려인(корё-сарам)은 선부동 땟골에
    // 밀집한 별개 집단이므로 여기에 쓰면 사실이 틀린다.
    description: "Заведение корейцев Китая с яньбяньским мягким тофу",
    tags: ["Мягкий тофу", "Яньбяньская кухня"],
  },
  chunhyangsan: {
    name: "Чунхянсан",
    description: "Малатан с выбором ингредиентов",
    tags: ["Малатан", "Китайская кухня", "Острое"],
  },
  "vietnam-hometown": {
    name: "Вьетнамская родная столовая",
    description: "Самый близкий к станции Ансан вьетнамский ресторан",
    tags: ["Фо", "Бань-ми ча"],
  },
  "dieu-hien-quan": {
    name: "Дьеу Хиен Куан",
    description: "Вьетнамский ресторан на улице Тамунхва 1-гиль",
    tags: ["Фо", "Вьетнамская кухня"],
  },
  "suwal-thai": {
    name: "Тайский ресторан Суваль",
    description: "Тайская кухня на улице Тамунхвагиль",
    tags: ["Том-ям", "Пад-тай", "Острое"],
  },
  "pad-thai": {
    name: "Пад-тай",
    description: "Ресторан, названный в честь тайской лапши",
    tags: ["Пад-тай", "Тайская кухня"],
  },
  kantipur: {
    name: "Ресторан Кантипур",
    description: "Назван в честь старого имени Катманду, Непал",
    tags: ["Дал-бат", "Момо", "Тандури"],
  },
  "new-taj-mahal": {
    name: "Новый Тадж-Махал",
    description: "Индийский ресторан с готовкой в глиняной печи",
    tags: ["Карри", "Тандури-курица", "Наан", "Острое"],
  },
  samarkand: {
    name: "Самарканд",
    description: "Узбекский ресторан с блюдами из тандыра",
    tags: ["Шашлык", "Плов", "Лепёшка"],
  },
  "imperia-food": {
    name: "Imperia Food",
    description: "Магазин российских и центральноазиатских продуктов",
    tags: ["Русский хлеб", "Импортные продукты", "Медовик"],
  },
  "troy-kebab": {
    name: "Троя Кебаб",
    description: "Турецкая кебабная в самом центре улицы Тамунхвагиль",
    tags: ["Дёнер-кебаб", "Турецкая кухня"],
  },
  "jakarta-resto": {
    name: "Джакарта",
    description: "Азиатский ресторан, названный в честь столицы Индонезии",
    tags: ["Наси-горенг", "Халяль"],
  },
  gatotkaca: {
    name: "Гатоткача",
    description: "Назван в честь героя традиционного яванского театра кукол",
    tags: ["Наси-горенг", "Халяль"],
  },
  "warung-kita": {
    name: "Варунг Кита",
    description: "Индонезийский ресторан, название означает «наша лавка»",
    tags: ["Наси-горенг", "Индонезийская домашняя кухня"],
  },
  "royal-resto": {
    name: "Роял Ресторан",
    description: "Азиатский ресторан на улице Вонгок-ро",
    tags: ["Юго-восточная азиатская кухня"],
  },
  "asiana-resto": {
    name: "Асиана Ресторан",
    description: "Индийский ресторан на улице Тамунхва 2-гиль",
    tags: ["Карри", "Наан", "Острое"],
  },
  "agan-resto": {
    name: "Аган Ресторан & Бар",
    description: "Индийский ресторан и бар у начала улицы Тамунхвагиль",
    tags: ["Карри", "Индийская кухня", "Острое"],
  },
  solti: {
    name: "Солти (индийско-непальский ресторан)",
    description: "Подают и индийские, и непальские блюда",
    tags: ["Карри", "Дал-бат", "Острое"],
  },
  nirosa: {
    name: "Нироса Ресторан",
    description: "Индийский ресторан на улице Вонгок-ро",
    tags: ["Карри", "Тандури", "Острое"],
  },
  "indo-nepal": {
    name: "Индо-непальский ресторан",
    description: "Индийско-непальский ресторан на улице Бубу-ро",
    tags: ["Карри", "Момо", "Острое"],
  },
  "injing-myanmar": {
    name: "Инджин Мьянма Ресторан",
    description: "Ресторан мьянманской кухни на улице Тамунхвагиль",
    tags: ["Мьянманская кухня", "Шанская лапша"],
  },
  "thai-noodle": {
    name: "Тайская лапша",
    description: "Тайская лапшичная на улице Бубу-ро",
    tags: ["Рисовая лапша", "Тайская кухня"],
  },
  "duk-kun": {
    name: "Дык-Кун",
    description: "Тайский ресторан на улице Вониль 1-гиль",
    tags: ["Тайская кухня"],
  },
  woaini: {
    name: "Вояни (шашлык и хого-буфет)",
    description: "Шашлык из баранины и хого в формате буфета",
    tags: ["Шашлык из баранины", "Хого-буфет"],
  },
  cheonmaeja: {
    name: "Чонмэджа",
    description: "Специализация хого и шабу-шабу на улице Вонгок-ро",
    tags: ["Хого", "Шабу-шабу"],
  },
  lingongzi: {
    name: "Линьгунцзы",
    description: "Китайский ресторан на улице Тамунхвагиль",
    tags: ["Китайская кухня"],
  },
  "ottugi-noodle": {
    name: "Оттуги (лапша ручной работы)",
    description: "Лапша, вытянутая руками на заказ",
    tags: ["Лапша ручной работы", "Резаная лапша"],
  },
  "beijing-duck": {
    name: "Пекинская утка",
    description: "Специализация пекинской утки на улице Тамунхва 2-гиль",
    tags: ["Пекинская утка", "Утиные блюда"],
  },
  gangttuk: {
    name: "Ансан Вонджо Гантток (шашлык)",
    description: "Специализация шашлыка на улице Вонгок-ро",
    tags: ["Шашлык из баранины", "Шашлык"],
  },
  sinbukgyeong: {
    name: "Синбукён Малатан",
    description: "Малатан на улице Вонгок-ро",
    tags: ["Малатан", "Мала-сянго", "Острое"],
  },
  "mama-gyoja": {
    name: "Дом пельменей Мама",
    description: "Специализация лепных пельменей",
    tags: ["Гёдза", "Пельмени"],
  },
  "bokwang-mandu": {
    name: "Пельмени Боквон",
    description: "Пельменная на улице Вонбон-ро",
    tags: ["Пельмени", "Снеки"],
  },
  "yanji-skewer2": {
    name: "Яньцзи (шашлык из баранины)",
    description: "Шашлычная на улице Бубу-ро 1-гиль",
    tags: ["Шашлык из баранины"],
  },
  janggang: {
    name: "Ресторан Чангган",
    description: "Китайский ресторан на улице Бубу-ро 1-гиль",
    tags: ["Китайская кухня", "Чачжанмён"],
  },
  "jindallae-naengmyeon": {
    name: "Яньцзи Чиндалле Нэнмён",
    description: "Специализация яньбяньской холодной лапши",
    tags: ["Яньцзи нэнмён", "Холодная лапша"],
  },
  ttungbo: {
    name: "Тунбо (шашлык из баранины)",
    description: "Шашлычная на улице Вонбон-ро",
    tags: ["Шашлык из баранины"],
  },
  "sarai-kebab": {
    name: "Сарай Дёнер Кебаб",
    description: "Кебабная на улице Вонгок-ро",
    tags: ["Дёнер-кебаб"],
  },
  "bat-kebab": {
    name: "Бат Кебаб",
    description: "Турецкая кебабная у станции Ансан",
    tags: ["Кебаб", "Турецкая кухня"],
  },
  "culture-center": {
    name: "Центр мировой культуры",
    description:
      "Бесплатный центр, где можно примерить костюмы и попробовать инструменты разных стран",
    tags: ["Традиционные костюмы", "Музыкальные инструменты мира", "Бесплатные программы"],
  },
  "borderless-photo": {
    name: 'Фотозона "Улица без границ"',
    description: "Указатели направлений в разные страны и улица с флагами мира",
    tags: ["Флаги мира", "Указатель городов", "Муралы"],
  },
};

/**
 * 가게 이름·한줄설명·태그의 인도네시아어 번역. 범위는 영어판과 동일.
 * 인도네시아 계열 가게는 원래 인도네시아어 이름이라 음차하지 않고 원어를 되살린다
 * (바타비아 → Batavia, 누산따라 → Nusantara, 와룽키타 → Warung Kita).
 */
export const PLACES_ID: Record<
  string,
  { name: string; description: string; tags: string[] }
> = {
  "almodina-halal": {
    name: "Al Madina Halal Mart",
    description: "Tempat warga Muslim berbelanja kebutuhan sehari-hari",
    tags: ["Halal", "Rempah", "Makanan Impor"],
  },
  "lepeshka-market": {
    name: "Lepyoshka",
    description: "Toko roti Uzbek dan bahan makanan Rusia–Asia Tengah",
    tags: ["Roti Uzbek", "Makanan Asia Tengah", "Makanan Impor"],
  },
  "world-food-market": {
    name: "World Food",
    description: "Toko bahan makanan Asia dengan bahan masakan Asia Tenggara dan buah tropis",
    tags: ["Makanan Asia Tenggara", "Buah Tropis", "Makanan Impor"],
  },
  "k2-nepal": {
    name: "K2 Nepal Zone",
    description: "Toko bahan makanan untuk warga Nepal",
    tags: ["Makanan Nepal", "Rempah", "Lentil"],
  },
  "sin-china-food": {
    name: "Sin China Food",
    description: "Toko bahan makanan warga Tionghoa dan Tionghoa-Korea",
    tags: ["Makanan Tiongkok", "Rempah", "Pangsit Beku"],
  },
  batavia: {
    name: "Batavia",
    description: "Rumah makan Indonesia di dekat pintu masuk Damunhwa-gil",
    tags: ["Nasi Goreng", "Mie Goreng", "Halal"],
  },
  "aneka-rasa": {
    name: "Aneka Rasa",
    description: "Masakan rumahan Indonesia, namanya berarti \"aneka rasa\"",
    tags: ["Rendang", "Sate", "Halal"],
  },
  nusantara: {
    name: "Nusantara",
    description: "Rumah makan Asia yang dinamai dari kepulauan Indonesia",
    tags: ["Nasi Goreng", "Kopi Indonesia", "Halal"],
  },
  "taesan-skewer": {
    name: "Sate Kambing Taesan",
    description: "Spesialis sate kambing bakar arang",
    tags: ["Sate Kambing", "Sate Bakar"],
  },
  "yanji-tofu": {
    name: "Yanji Chodubu",
    description: "Tahu lembut khas Yanbian dari komunitas Tionghoa-Korea",
    tags: ["Tahu Lembut", "Masakan Yanbian"],
  },
  chunhyangsan: {
    name: "Chunhyangsan",
    description: "Malatang dengan bahan pilihan sendiri",
    tags: ["Malatang", "Masakan Tiongkok", "Pedas"],
  },
  "vietnam-hometown": {
    name: "Rumah Makan Kampung Vietnam",
    description: "Rumah makan Vietnam terdekat dari Stasiun Ansan",
    tags: ["Pho", "Banh Mi Cha"],
  },
  "dieu-hien-quan": {
    name: "Dieu Hien Quan",
    description: "Rumah makan Vietnam di gang Damunhwa 1-gil",
    tags: ["Pho", "Masakan Vietnam"],
  },
  "suwal-thai": {
    name: "Restoran Thai Suwal",
    description: "Spesialis masakan Thailand di Damunhwa-gil",
    tags: ["Tom Yum Goong", "Pad Thai", "Pedas"],
  },
  "pad-thai": {
    name: "Pad Thai",
    description: "Rumah makan yang dinamai dari mi goreng khas Thailand",
    tags: ["Pad Thai", "Masakan Thailand"],
  },
  kantipur: {
    name: "Restoran Kantipur",
    description: "Dinamai dari nama lama Kathmandu, Nepal",
    tags: ["Dal Bhat", "Momo", "Tandoori"],
  },
  "new-taj-mahal": {
    name: "New Taj Mahal",
    description: "Rumah makan India dengan tungku tanah tandoor",
    tags: ["Kari", "Ayam Tandoori", "Naan", "Pedas"],
  },
  samarkand: {
    name: "Samarkand",
    description: "Rumah makan Uzbekistan dengan masakan tungku tanah",
    tags: ["Shashlik", "Plov", "Lepyoshka"],
  },
  "imperia-food": {
    name: "Imperia Food",
    description: "Toko bahan makanan Rusia dan Asia Tengah",
    tags: ["Roti Rusia", "Makanan Impor", "Medovik"],
  },
  "troy-kebab": {
    name: "Troy Kebab",
    description: "Kedai kebab Turki di tengah Damunhwa-gil",
    tags: ["Doner Kebab", "Masakan Turki"],
  },
  "jakarta-resto": {
    name: "Jakarta",
    description: "Rumah makan Asia yang dinamai dari ibu kota Indonesia",
    tags: ["Nasi Goreng", "Halal"],
  },
  gatotkaca: {
    name: "Gatotkaca",
    description: "Dinamai dari tokoh pahlawan dalam wayang Jawa",
    tags: ["Nasi Goreng", "Halal"],
  },
  "warung-kita": {
    name: "Warung Kita",
    description: "Rumah makan Indonesia, namanya berarti \"warung kita\"",
    tags: ["Nasi Goreng", "Masakan Rumahan Indonesia"],
  },
  "royal-resto": {
    name: "Royal Restaurant",
    description: "Rumah makan Asia di Wongok-ro",
    tags: ["Masakan Asia Tenggara"],
  },
  "asiana-resto": {
    name: "Asiana Restaurant",
    description: "Rumah makan India di Damunhwa 2-gil",
    tags: ["Kari", "Naan", "Pedas"],
  },
  "agan-resto": {
    name: "Agan Restaurant & Bar",
    description: "Rumah makan dan bar India di awal Damunhwa-gil",
    tags: ["Kari", "Masakan India", "Pedas"],
  },
  solti: {
    name: "Solti (Rumah Makan India-Nepal)",
    description: "Menyajikan masakan India sekaligus Nepal",
    tags: ["Kari", "Dal Bhat", "Pedas"],
  },
  nirosa: {
    name: "Nirosa Restaurant",
    description: "Rumah makan India di Wongok-ro",
    tags: ["Kari", "Tandoori", "Pedas"],
  },
  "indo-nepal": {
    name: "Rumah Makan India-Nepal",
    description: "Rumah makan India dan Nepal di Bubu-ro",
    tags: ["Kari", "Momo", "Pedas"],
  },
  "injing-myanmar": {
    name: "Injing Myanmar Restaurant",
    description: "Rumah makan Myanmar di Damunhwa-gil",
    tags: ["Masakan Myanmar", "Mi Shan"],
  },
  "thai-noodle": {
    name: "Mi Beras Thailand",
    description: "Kedai mi beras Thailand di Bubu-ro",
    tags: ["Mi Beras", "Masakan Thailand"],
  },
  "duk-kun": {
    name: "Duk Kun",
    description: "Rumah makan Thailand di Wonil 1-gil",
    tags: ["Masakan Thailand"],
  },
  woaini: {
    name: "Woaini (Sate & Hotpot Buffet)",
    description: "Sate kambing dan hotpot dengan sistem buffet",
    tags: ["Sate Kambing", "Hotpot Buffet"],
  },
  cheonmaeja: {
    name: "Cheonmaeja",
    description: "Spesialis hotpot dan shabu-shabu di Wongok-ro",
    tags: ["Hotpot", "Shabu-Shabu"],
  },
  lingongzi: {
    name: "Lingongzi",
    description: "Rumah makan Tiongkok di Damunhwa-gil",
    tags: ["Masakan Tiongkok"],
  },
  "ottugi-noodle": {
    name: "Mi Tarik Ottugi",
    description: "Mi yang ditarik tangan saat dipesan",
    tags: ["Mi Tarik", "Mi Potong"],
  },
  "beijing-duck": {
    name: "Bebek Peking",
    description: "Spesialis bebek peking di Damunhwa 2-gil",
    tags: ["Bebek Peking", "Olahan Bebek"],
  },
  gangttuk: {
    name: "Sate Gangttuk Ansan",
    description: "Spesialis sate bakar di Wongok-ro",
    tags: ["Sate Kambing", "Sate Bakar"],
  },
  sinbukgyeong: {
    name: "Malatang Sinbukgyeong",
    description: "Kedai malatang di Wongok-ro",
    tags: ["Malatang", "Mala Xiang Guo", "Pedas"],
  },
  "mama-gyoja": {
    name: "Mama Gyoja",
    description: "Spesialis pangsit buatan tangan",
    tags: ["Gyoza", "Pangsit"],
  },
  "bokwang-mandu": {
    name: "Pangsit Bokwang",
    description: "Kedai pangsit di Wonbon-ro",
    tags: ["Pangsit", "Kudapan"],
  },
  "yanji-skewer2": {
    name: "Sate Kambing Yanji",
    description: "Kedai sate di Bubu-ro 1-gil",
    tags: ["Sate Kambing"],
  },
  janggang: {
    name: "Janggang Restaurant",
    description: "Rumah makan Tiongkok di Bubu-ro 1-gil",
    tags: ["Masakan Tiongkok", "Jjajangmyeon"],
  },
  "jindallae-naengmyeon": {
    name: "Naengmyeon Jindallae Yanji",
    description: "Spesialis mi dingin khas Yanbian",
    tags: ["Naengmyeon Yanji", "Mi Dingin"],
  },
  ttungbo: {
    name: "Sate Kambing Ttungbo",
    description: "Kedai sate di Wonbon-ro",
    tags: ["Sate Kambing"],
  },
  "sarai-kebab": {
    name: "Sarai Doner Kebab",
    description: "Kedai doner kebab di Wongok-ro",
    tags: ["Doner Kebab"],
  },
  "bat-kebab": {
    name: "Bat Kebab",
    description: "Kedai kebab Turki dekat Stasiun Ansan",
    tags: ["Kebab", "Masakan Turki"],
  },
  "culture-center": {
    name: "Pusat Pengalaman Budaya Dunia",
    description:
      "Ruang gratis untuk mencoba pakaian dan alat musik dari berbagai negara",
    tags: ["Pakaian Tradisional", "Alat Musik Dunia", "Program Gratis"],
  },
  "borderless-photo": {
    name: "Spot Foto Jalan Tanpa Batas",
    description:
      "Papan penunjuk arah ke kota-kota dunia dan jalan berhias bendera",
    tags: ["Bendera Dunia", "Papan Penunjuk", "Mural"],
  },
};

export const STAMP_SLOT_NAME_EN: Record<string, string> = {
  indonesia: "Indonesia",
  chinese: "Chinese-Korean",
  vietnam: "Vietnam",
  thai: "Thailand",
  southasia: "India · Nepal",
  centralasia: "Central Asia",
  "culture-center": "Culture Center",
  "photo-spot": "Photo Spot",
};

export const STAMP_SLOT_GUIDE_EN: Record<string, string> = {
  indonesia: "Visit one of Batavia, Aneka Rasa, or Nusantara",
  chinese: "Visit one of Taesan Lamb Skewers, Yanji Chodubu, or Chunhyangsan",
  vietnam: "Visit one of Vietnam Hometown Restaurant or Dieu Hien Quan",
  thai: "Visit one of Suwal Thai Restaurant or Pad Thai",
  southasia: "Visit one of Kantipur Restaurant or New Taj Mahal",
  centralasia: "Visit one of Samarkand, Imperia Food, or Troy Kebab",
  "culture-center":
    "Visit the experience hall inside the Foreign Residents Support Center",
  "photo-spot":
    "Check in at the signpost in front of the Foreign Residents Center",
};

export const STAMP_SLOT_NAME_ZH: Record<string, string> = {
  indonesia: "印度尼西亚",
  chinese: "朝鲜族",
  vietnam: "越南",
  thai: "泰国",
  southasia: "印度·尼泊尔",
  centralasia: "中亚",
  "culture-center": "世界文化体验馆",
  "photo-spot": "拍照点认证",
};

export const STAMP_SLOT_GUIDE_ZH: Record<string, string> = {
  indonesia: "巴达维亚、安尼卡拉萨、努桑塔拉中选一处游览",
  chinese: "泰山羊肉串、延吉初豆腐、春香山中选一处游览",
  vietnam: "越南故乡食堂、蒂尤希恩馆中选一处游览",
  thai: "苏瓦泰国餐厅、泰式炒河粉中选一处游览",
  southasia: "坎蒂普尔餐厅、新泰姬陵中选一处游览",
  centralasia: "撒马尔罕、帝国食品、特洛伊烤肉卷中选一处游览",
  "culture-center": "参观外国居民支援本部内的体验馆",
  "photo-spot": "在外国居民中心前的路标处打卡认证",
};

export const STAMP_SLOT_NAME_JA: Record<string, string> = {
  indonesia: "インドネシア",
  chinese: "朝鮮族",
  vietnam: "ベトナム",
  thai: "タイ",
  southasia: "インド・ネパール",
  centralasia: "中央アジア",
  "culture-center": "世界文化体験館",
  "photo-spot": "フォトスポット認証",
};

export const STAMP_SLOT_GUIDE_JA: Record<string, string> = {
  indonesia: "バタビア、アネカラサ、ヌサンタラのいずれかを訪問",
  chinese: "テサン羊肉串、延吉初豆腐、春香山のいずれかを訪問",
  vietnam: "ベトナム故郷食堂、ディウヒエンクアンのいずれかを訪問",
  thai: "スワルタイレストラン、パッタイのいずれかを訪問",
  southasia: "カンティプールレストラン、ニュータージマハルのいずれかを訪問",
  centralasia: "サマルカンド、インペリアフード、トロイケバブのいずれかを訪問",
  "culture-center": "外国人住民支援本部内の体験館を訪問",
  "photo-spot": "外国人住民センター前の道標でチェックイン",
};

export const STAMP_SLOT_NAME_RU: Record<string, string> = {
  indonesia: "Индонезия",
  chinese: "Корейцы Китая",
  vietnam: "Вьетнам",
  thai: "Таиланд",
  southasia: "Индия и Непал",
  centralasia: "Центральная Азия",
  "culture-center": "Центр культуры",
  "photo-spot": "Фотозона",
};

export const STAMP_SLOT_GUIDE_RU: Record<string, string> = {
  indonesia: "Посетите Батавия, Анека Раса или Нусантара",
  chinese: "Посетите Тэсан, Яньцзи Чодубу или Чунхянсан",
  vietnam: "Посетите Вьетнамскую родную столовую или Дьеу Хиен Куан",
  thai: "Посетите ресторан Суваль или Пад-тай",
  southasia: "Посетите ресторан Кантипур или Новый Тадж-Махал",
  centralasia: "Посетите Самарканд, Imperia Food или Троя Кебаб",
  "culture-center": "Посетите центр в Центре поддержки иностранных резидентов",
  "photo-spot": "Отметьтесь у указателя перед Центром поддержки иностранных резидентов",
};

export const STAMP_SLOT_NAME_ID: Record<string, string> = {
  indonesia: "Indonesia",
  chinese: "Tionghoa-Korea",
  vietnam: "Vietnam",
  thai: "Thailand",
  southasia: "India · Nepal",
  centralasia: "Asia Tengah",
  "culture-center": "Pusat Budaya",
  "photo-spot": "Spot Foto",
};

export const STAMP_SLOT_GUIDE_ID: Record<string, string> = {
  indonesia: "Kunjungi salah satu: Batavia, Aneka Rasa, atau Nusantara",
  chinese: "Kunjungi salah satu: Sate Taesan, Yanji Chodubu, atau Chunhyangsan",
  vietnam: "Kunjungi Rumah Makan Kampung Vietnam atau Dieu Hien Quan",
  thai: "Kunjungi Restoran Thai Suwal atau Pad Thai",
  southasia: "Kunjungi Restoran Kantipur atau New Taj Mahal",
  centralasia: "Kunjungi salah satu: Samarkand, Imperia Food, atau Troy Kebab",
  "culture-center":
    "Kunjungi ruang pengalaman di Pusat Dukungan Warga Asing",
  "photo-spot":
    "Absen di papan penunjuk depan Pusat Dukungan Warga Asing",
};

const STAMP_SLOT_NAME_BY_LANG: Partial<Record<Lang, Record<string, string>>> = {
  en: STAMP_SLOT_NAME_EN,
  zh: STAMP_SLOT_NAME_ZH,
  ja: STAMP_SLOT_NAME_JA,
  ru: STAMP_SLOT_NAME_RU,
  id: STAMP_SLOT_NAME_ID,
};

const STAMP_SLOT_GUIDE_BY_LANG: Partial<Record<Lang, Record<string, string>>> = {
  en: STAMP_SLOT_GUIDE_EN,
  zh: STAMP_SLOT_GUIDE_ZH,
  ja: STAMP_SLOT_GUIDE_JA,
  ru: STAMP_SLOT_GUIDE_RU,
  id: STAMP_SLOT_GUIDE_ID,
};

export function localizeStampSlotName(id: string, lang: Lang, koName: string): string {
  return STAMP_SLOT_NAME_BY_LANG[lang]?.[id] ?? koName;
}

export function localizeStampSlotGuide(id: string, lang: Lang, koGuide: string): string {
  return STAMP_SLOT_GUIDE_BY_LANG[lang]?.[id] ?? koGuide;
}

const STAMP_TIER_EN: Record<number, { name: string; description: string }> = {
  3: {
    name: "First Stamp",
    description: "You've visited three places. The journey has begun",
  },
  6: {
    name: "Alley Explorer",
    description: "Six down — well past the halfway point!",
  },
};

const STAMP_TIER_ZH: Record<number, { name: string; description: string }> = {
  3: {
    name: "第一枚印章",
    description: "您已经参观了三个地方。旅程开始了",
  },
  6: {
    name: "小巷探险家",
    description: "六处完成！已过半程",
  },
};

const STAMP_TIER_JA: Record<number, { name: string; description: string }> = {
  3: {
    name: "最初のスタンプ",
    description: "3か所訪問しました。旅が始まりました",
  },
  6: {
    name: "路地探検家",
    description: "6か所達成！半分を大きく超えました",
  },
};

const STAMP_TIER_RU: Record<number, { name: string; description: string }> = {
  3: {
    name: "Первая печать",
    description: "Вы посетили три места. Путешествие началось",
  },
  6: {
    name: "Исследователь переулков",
    description: "Шесть мест позади — уже больше половины!",
  },
};

const STAMP_TIER_ID: Record<number, { name: string; description: string }> = {
  3: {
    name: "Cap Pertama",
    description: "Anda sudah mengunjungi tiga tempat. Perjalanan dimulai",
  },
  6: {
    name: "Penjelajah Gang",
    description: "Enam tempat selesai — sudah lewat setengah jalan!",
  },
};

const FINISHER_BY_LANG: Partial<
  Record<Lang, (total: number) => { name: string; description: string }>
> = {
  en: (total) => ({
    name: "Borderless Finisher",
    description: `A traveler who filled all ${total} Wongok-dong slots`,
  }),
  zh: (total) => ({
    name: "无国界完赛者",
    description: `集齐元谷洞全部${total}格的旅行者`,
  }),
  ja: (total) => ({
    name: "ボーダーレス完走者",
    description: `元谷洞の全${total}マスを集めた旅行者`,
  }),
  ru: (total) => ({
    name: "Покоритель Borderless",
    description: `Путешественник, заполнивший все ${total} ячеек Вонгок-дона`,
  }),
  id: (total) => ({
    name: "Penuntas Borderless",
    description: `Pelancong yang mengisi seluruh ${total} kotak Wongok-dong`,
  }),
};

const STAMP_TIER_BY_LANG: Partial<Record<Lang, Record<number, { name: string; description: string }>>> = {
  en: STAMP_TIER_EN,
  zh: STAMP_TIER_ZH,
  ja: STAMP_TIER_JA,
  ru: STAMP_TIER_RU,
  id: STAMP_TIER_ID,
};

/** 완주 칸(마지막 티어)은 STAMP_TOTAL이 바뀔 수 있어 고정 사전 대신 함수로 만든다 */
export function localizeTier(
  tier: { count: number; name: string; description: string },
  lang: Lang,
  stampTotal: number
) {
  if (lang === "ko") return { name: tier.name, description: tier.description };
  if (tier.count === stampTotal) {
    return FINISHER_BY_LANG[lang]?.(stampTotal) ?? {
      name: tier.name,
      description: tier.description,
    };
  }
  return (
    STAMP_TIER_BY_LANG[lang]?.[tier.count] ?? {
      name: tier.name,
      description: tier.description,
    }
  );
}

export const COURSES_EN: Record<string, { title: string; summary: string }> = {
  neighbors: {
    title: "How the Neighbours Shop",
    summary: "The shops where Nepali, Muslim, Chinese and Russian residents actually buy their food",
  },
  halal: {
    title: "Halal Course",
    summary: "Only the Indonesian places whose halal labelling we could confirm",
  },
  "quick-taste": {
    title: "One-Hour Taste",
    summary: "Three countries even on a layover — an hour round trip from the station",
  },
  spicy: {
    title: "Spicy Course",
    summary: "Sichuan mala, Thai tom yum, Indian curry — a tour of heat",
  },
  noodle: {
    title: "Noodle Course",
    summary: "Vietnamese pho, Chinese hand-pulled noodles, Yanbian cold noodles",
  },
  "world-food": {
    title: "World Food Tour",
    summary:
      "Vietnam → Indonesia → Thailand → India/Nepal → Chinese-Korean — a five-country food loop",
  },
  family: {
    title: "Family Experience Course",
    summary:
      "Weekdays only — a half-day for families, timed to the culture center's sessions (10:30 · 13:30 · 15:00)",
  },
  "night-walk": {
    title: "Night Walk Course",
    summary:
      "Start at the flag-lined photo spot, then wander into the kebab and skewer alleys",
  },
};

export const COURSES_ZH: Record<string, { title: string; summary: string }> = {
  neighbors: {
    title: "邻居的采购路线",
    summary: "尼泊尔、穆斯林、中国、俄语区居民真正采购的商店",
  },
  halal: {
    title: "清真路线",
    summary: "仅收录已确认清真标识的印尼餐厅",
  },
  "quick-taste": {
    title: "一小时速尝",
    summary: "转车时间也能尝三国 · 从车站往返一小时",
  },
  spicy: {
    title: "辛辣路线",
    summary: "四川麻辣 · 泰式冬阴 · 印度喀喱，辣味巡礼",
  },
  noodle: {
    title: "面食路线",
    summary: "越南米粉 · 中式手拉面 · 延边冷面，三碗面",
  },
  "world-food": {
    title: "世界美食之旅",
    summary: "越南 → 印度尼西亚 → 泰国 → 印度/尼泊尔 → 朝鲜族，五国美食巡礼",
  },
  family: {
    title: "家庭体验课程",
    summary: "仅限平日 · 配合体验馆场次（10:30·13:30·15:00）的亲子半日游",
  },
  "night-walk": {
    title: "夜间漫步课程",
    summary: "从万国旗拍照点出发，走进烤肉串和羊肉串小巷",
  },
};

export const COURSES_JA: Record<string, { title: string; summary: string }> = {
  neighbors: {
    title: "隣人の買い物",
    summary: "ネパール・ムスリム・中国・ロシア語圏の住民が実際に買い物をする店",
  },
  halal: {
    title: "ハラールコース",
    summary: "ハラール表記が確認できたインドネシア系のみ",
  },
  "quick-taste": {
    title: "1時間味見",
    summary: "乗換時間でも回れる3か国 · 駅から往復1時間",
  },
  spicy: {
    title: "辛いものコース",
    summary: "四川の麻辣 · タイのトムヤム · インドのカレー",
  },
  noodle: {
    title: "麺料理コース",
    summary: "フォー · 中華手打ち麺 · 延辺冷麺の三杯",
  },
  "world-food": {
    title: "世界美食ツアー",
    summary: "ベトナム → インドネシア → タイ → インド/ネパール → 朝鮮族、5か国美食巡り",
  },
  family: {
    title: "家族体験コース",
    summary: "平日限定 · 体験館の回次（10:30・13:30・15:00）に合わせた家族半日コース",
  },
  "night-walk": {
    title: "夜の散歩コース",
    summary: "万国旗のフォトスポットから始まり、ケバブと串焼きの路地へ",
  },
};

export const COURSES_RU: Record<string, { title: string; summary: string }> = {
  neighbors: {
    title: "Где закупаются соседи",
    summary:
      "Магазины, в которых непальские, мусульманские, китайские и русскоязычные жители реально покупают продукты",
  },
  halal: {
    title: "Халяль-маршрут",
    summary:
      "Только индонезийские заведения с подтверждённой маркировкой халяль",
  },
  "quick-taste": {
    title: "Час на вкус",
    summary:
      "Три страны даже в пересадку — час туда и обратно от станции",
  },
  spicy: {
    title: "Острый маршрут",
    summary:
      "Сычуаньская мала, тайский том-ям, индийское карри",
  },
  noodle: {
    title: "Лапша",
    summary:
      "Вьетнамский фо, китайская лапша ручной работы, яньбяньский нэнмён",
  },
  "world-food": {
    title: "Тур мировой кухни",
    summary:
      "Вьетнам → Индонезия → Таиланд → Индия/Непал → корейцы-китайцы — гастрономический маршрут по пяти странам",
  },
  family: {
    title: "Семейный маршрут",
    summary:
      "Только в будни — полдня для семьи, приурочено к сеансам культурного центра (10:30 · 13:30 · 15:00)",
  },
  "night-walk": {
    title: "Вечерняя прогулка",
    summary:
      "Начните у фотозоны с флагами, затем прогуляйтесь по переулкам с кебабом и шашлыком",
  },
};

export const COURSES_ID: Record<string, { title: string; summary: string }> = {
  neighbors: {
    title: "Belanja Ala Tetangga",
    summary: "Toko tempat warga Nepal, Muslim, Tionghoa, dan Rusia benar-benar berbelanja",
  },
  halal: {
    title: "Rute Halal",
    summary: "Hanya rumah makan Indonesia dengan label halal yang terkonfirmasi",
  },
  "quick-taste": {
    title: "Cicip Satu Jam",
    summary: "Tiga negara bahkan saat transit · satu jam bolak-balik dari stasiun",
  },
  spicy: {
    title: "Rute Pedas",
    summary: "Mala Sichuan, tom yum Thailand, kari India — jelajah rasa pedas",
  },
  noodle: {
    title: "Rute Mi",
    summary: "Pho Vietnam, mi tarik Tiongkok, mi dingin Yanbian",
  },
  "world-food": {
    title: "Tur Kuliner Dunia",
    summary:
      "Vietnam → Indonesia → Thailand → India/Nepal → Tionghoa-Korea, jelajah kuliner lima negara",
  },
  family: {
    title: "Rute Keluarga",
    summary:
      "Hanya hari kerja · setengah hari bersama anak, disesuaikan dengan sesi pusat budaya (10:30 · 13:30 · 15:00)",
  },
  "night-walk": {
    title: "Rute Jalan Malam",
    summary:
      "Mulai dari spot foto berhias bendera, lalu masuk ke gang kebab dan sate",
  },
};

const COURSES_BY_LANG: Partial<Record<Lang, Record<string, { title: string; summary: string }>>> = {
  en: COURSES_EN,
  zh: COURSES_ZH,
  ja: COURSES_JA,
  ru: COURSES_RU,
  id: COURSES_ID,
};

export function localizeCourse(
  course: { id: string; title: string; summary: string },
  lang: Lang
) {
  if (lang === "ko") return { title: course.title, summary: course.summary };
  return (
    COURSES_BY_LANG[lang]?.[course.id] ?? {
      title: course.title,
      summary: course.summary,
    }
  );
}

const PLACES_BY_LANG: Partial<
  Record<Lang, Record<string, { name: string; description: string; tags: string[] }>>
> = {
  en: { ...PLACES_EN, ...PLACE_ADDITIONS.en },
  zh: { ...PLACES_ZH, ...PLACE_ADDITIONS.zh },
  ja: { ...PLACES_JA, ...PLACE_ADDITIONS.ja },
  ru: { ...PLACES_RU, ...PLACE_ADDITIONS.ru },
  id: { ...PLACES_ID, ...PLACE_ADDITIONS.id },
};

/** Build a language-agnostic search index for a place. */
export function getPlaceSearchTerms(place: Place): string[] {
  const baseTerms = [place.name, place.address, ...(place.nameAliases ?? []), place.description ?? "", ...place.tags];
  const translatedTerms = Object.values(PLACES_BY_LANG).flatMap((dictionary) => {
    const translation = dictionary?.[place.id];
    return translation
      ? [translation.name, translation.description ?? "", ...translation.tags]
      : [];
  });

  return [...baseTerms, ...translatedTerms];
}

/**
 * 현재 언어에 맞는 이름·설명·태그를 돌려준다. 번역이 없으면 한국어로 자연스럽게 대체한다.
 *
 * signName은 항상 한국어 상호다. 번역명만 보여주면 방문객이 실제 간판과 대조할 수
 * 없고, 현지인에게 길을 물을 때나 카카오맵(한국어) 페이지와 맞춰볼 때도 쓸 수 없다.
 * 구글맵이 현지 등록명을 항상 병기하는 이유와 같다. 번역명과 같을 때(=번역이 없어
 * 한국어로 대체된 경우)는 null을 주어 같은 이름이 두 번 찍히지 않게 한다.
 */
export function localizePlace(place: Place, lang: Lang) {
  if (lang === "ko") {
    return {
      name: place.name,
      description: place.description,
      tags: place.tags,
      signName: null as string | null,
    };
  }
  const t = PLACES_BY_LANG[lang]?.[place.id];
  const name = t?.name ?? place.name;
  return {
    name,
    description: t?.description ?? place.description,
    tags: t?.tags ?? place.tags,
    signName: name === place.name ? null : place.name,
  };
}
