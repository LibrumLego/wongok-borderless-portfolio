import type { Lang } from "@/store/useLangStore";

type Translation = { name: string; description: string; tags: string[] };
export const PLACE_ADDITIONS: Record<Exclude<Lang, "ko">, Record<string, Translation>> = {
  en: {
    "kampung-indonesia": { name: "Kampung Indonesia", description: "Indonesian fried rice, rendang and grilled ribs on the second floor of Damunhwa 1-gil.", tags: ["Nasi goreng", "Rendang", "Grilled ribs"] },
    "warkop-indonesia": { name: "Warkop Indonesia", description: "A second-floor Indonesian restaurant across from Ansan Station, serving fried rice and meatball soup.", tags: ["Nasi goreng", "Bakso", "Fried duck"] },
    "rak-thai": { name: "Rak Thai", description: "Tom yum, stir-fried noodles and crab curry on the second floor of Wongok-ro.", tags: ["Tom yum", "Pad thai", "Crab curry"] },
  },
  zh: {
    "kampung-indonesia": { name: "Kampung 印度尼西亚餐厅", description: "位于多文化1街二楼，供应印尼炒饭、仁当牛肉和烤牛肋排。", tags: ["印尼炒饭", "仁当牛肉", "烤牛肋排"] },
    "warkop-indonesia": { name: "Warkop 印度尼西亚餐厅", description: "安山站对面二楼的印尼餐厅，可品尝炒饭和牛肉丸汤。", tags: ["印尼炒饭", "牛肉丸汤", "炸鸭"] },
    "rak-thai": { name: "Rak Thai 泰国餐厅", description: "位于元谷路二楼，供应冬阴功、泰式炒粉和咖喱蟹。", tags: ["冬阴功", "泰式炒粉", "咖喱蟹"] },
  },
  ja: {
    "kampung-indonesia": { name: "カンプン・インドネシア", description: "多文化1キルの2階で、ナシゴレン・ルンダン・牛スペアリブを楽しむインドネシア料理店。", tags: ["ナシゴレン", "ルンダン", "牛スペアリブ"] },
    "warkop-indonesia": { name: "ワルコップ・インドネシア", description: "安山駅の向かい側の2階。炒めご飯や肉団子スープを選べるインドネシア料理店。", tags: ["ナシゴレン", "バクソ", "揚げ鴨"] },
    "rak-thai": { name: "ラックタイ", description: "元谷路の2階でトムヤムクン・パッタイ・カニカレーを味わうタイ料理店。", tags: ["トムヤムクン", "パッタイ", "カニカレー"] },
  },
  ru: {
    "kampung-indonesia": { name: "Кампунг Индонезия", description: "Индонезийский жареный рис, ренданг и рёбра на втором этаже на улице Дамунхва 1-гиль.", tags: ["Наси-горенг", "Ренданг", "Рёбра на гриле"] },
    "warkop-indonesia": { name: "Варкоп Индонезия", description: "Индонезийский ресторан на втором этаже напротив станции Ансан: жареный рис и суп с фрикадельками.", tags: ["Наси-горенг", "Баксо", "Жареная утка"] },
    "rak-thai": { name: "Рак Тай", description: "Том-ям, жареная лапша и крабовое карри на втором этаже на улице Вонгок-ро.", tags: ["Том-ям", "Пад-тай", "Крабовое карри"] },
  },
  id: {
    "kampung-indonesia": { name: "Kampung Indonesia", description: "Nasi goreng, rendang dan iga bakar di lantai dua, Damunhwa 1-gil.", tags: ["Nasi goreng", "Rendang", "Iga bakar"] },
    "warkop-indonesia": { name: "Warkop Indonesia", description: "Restoran Indonesia di lantai dua seberang Stasiun Ansan, dengan nasi goreng dan bakso.", tags: ["Nasi goreng", "Bakso", "Bebek goreng"] },
    "rak-thai": { name: "Rak Thai", description: "Tom yum, pad thai dan kari kepiting di lantai dua, Wongok-ro.", tags: ["Tom yum", "Pad thai", "Kari kepiting"] },
  },
};

export const VISIT_COPY: Record<Lang, { title: string; tips: string[]; nearby: string; distance: string; map: string; menu: string }> = {
  ko: { title: "방문 전에 알아두세요", tips: ["주소의 층수와 한국어 간판을 함께 확인하세요. 같은 건물에 여러 식당이 있어요.", "메뉴·가격·휴무는 바뀔 수 있어요. 출발 전에 매장 페이지나 전화로 확인하세요.", "매운맛·고수·알레르기·할랄 여부는 주문 전에 매장에 직접 확인하세요."], nearby: "이 근처도 둘러보세요", distance: "직선거리 · 실제 도보 경로와 다를 수 있어요", map: "지도에서 보기", menu: "등록 메뉴 확인" },
  en: { title: "Before you visit", tips: ["Check the floor and Korean sign: several restaurants may share a building.", "Menus, prices and closing days can change. Check the listing or call before leaving.", "Ask the restaurant about spice, coriander, allergens and halal status before ordering."], nearby: "Explore nearby", distance: "Straight-line distance · walking routes may differ", map: "View on map", menu: "Check listed menu" },
  zh: { title: "出发前请确认", tips: ["请核对楼层和韩文招牌，同一栋楼可能有多家餐厅。", "菜单、价格和休息日可能变动，请查看商家页面或致电确认。", "点餐前请向店家确认辣度、香菜、过敏原及清真情况。"], nearby: "探索附近地点", distance: "直线距离 · 实际步行路线可能不同", map: "在地图上查看", menu: "查看登记菜单" },
  ja: { title: "訪問前のチェック", tips: ["階数と韓国語の看板を確認。同じ建物に複数の店が入ることがあります。", "メニュー・価格・定休日は変わることがあります。店舗ページや電話で確認してください。", "辛さ・パクチー・アレルギー・ハラール対応は注文前にお店に確認してください。"], nearby: "近くのスポットも探す", distance: "直線距離・実際の徒歩ルートとは異なる場合があります", map: "地図で見る", menu: "登録メニューを見る" },
  ru: { title: "Перед посещением", tips: ["Проверьте этаж и корейскую вывеску: в здании может быть несколько ресторанов.", "Меню, цены и выходные могут меняться. Проверьте страницу заведения или позвоните.", "Перед заказом уточните остроту, кинзу, аллергены и халяльный статус."], nearby: "Что есть рядом", distance: "По прямой · пешеходный маршрут может отличаться", map: "На карте", menu: "Посмотреть меню" },
  id: { title: "Sebelum berkunjung", tips: ["Periksa lantai dan papan nama Korea; satu gedung bisa memiliki beberapa restoran.", "Menu, harga dan hari libur dapat berubah. Periksa halaman restoran atau telepon dahulu.", "Tanyakan tingkat pedas, daun ketumbar, alergen dan status halal sebelum memesan."], nearby: "Jelajahi tempat terdekat", distance: "Jarak garis lurus · rute jalan kaki bisa berbeda", map: "Lihat di peta", menu: "Lihat menu terdaftar" },
};
