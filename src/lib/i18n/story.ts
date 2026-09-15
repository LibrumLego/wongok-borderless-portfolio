import type { Lang } from "@/store/useLangStore";

/**
 * 원곡동이 어떻게 지금의 거리가 되었는지.
 *
 * 여기 있는 연도와 숫자는 하나도 지어내지 않았다. 두 곳에서만 가져왔다.
 *  - 1981~2008: 디지털안산문화대전(한국학중앙연구원 향토문화전자대전)
 *  - 2009년 특구 지정 · 88% · 110여 나라: 한국관광공사 공공데이터(안산 다문화특구,
 *    안산다문화음식거리 소개문)
 *
 * 문장은 우리가 썼지만 사실관계는 위 출처를 벗어나지 않는다. 확인되지 않은 것은
 * 아무리 이야기가 좋아져도 넣지 않았다 — 예를 들어 '단원구'라는 이름이 김홍도의
 * 호에서 왔다는 설은 매력적이지만 1차 사료에서 확인하지 못해 뺐다.
 */

export interface StoryChapter {
  /** 연도 표기는 숫자라 번역하지 않는다 */
  year: string;
  title: string;
  body: string;
}

export interface StoryContent {
  kicker: string;
  title: string;
  /** 이 거리의 성격을 한 문장으로 — 아래 연표가 뒷받침한다 */
  lead: string;
  chapters: StoryChapter[];
  sourceLabel: string;
  sources: string[];
  /** 연표 다음에 이어지는 안내 */
  nextLabel: string;
}

const ko: StoryContent = {
  kicker: "원곡동의 시간",
  title: "사람들이 떠난 자리에서 시작된 거리",
  lead: "원곡동은 처음부터 다문화 마을이 아니었다. 공단 노동자들이 살려고 지은 동네였고, 그들이 떠난 뒤에 지금의 거리가 생겼다.",
  chapters: [
    {
      year: "1981",
      title: "공단이 돌아가기 시작하다",
      body: "반월공단이 본격 가동하면서 전국에서 일자리를 찾아 사람들이 몰려왔다. 원곡동은 그 노동자들이 살 집으로 지어진 동네였다.",
    },
    {
      year: "1980년대 후반",
      title: "3만 4천 명의 동네",
      body: "원곡동은 34,000명이 사는 대단위 주거지로 바뀌었고, 1990년대 초에는 안산의 중심 주거·상업지역으로 자리 잡았다.",
    },
    {
      year: "1980년대 말",
      title: "사람들이 떠나다",
      body: "공단의 산업 구조가 급격히 재편되고 경기가 위축되면서 상당수 내국인이 원곡동을 떠났다. 인구가 빠르게 줄었다.",
    },
    {
      year: "1994년경",
      title: "빈자리를 채운 사람들",
      body: "떠난 이들의 자리에 외국인 노동자들이 들어왔다. 안산역이 가깝고, 값싼 다세대주택이 늘어서 있고, 반월·시화공단이 지척이었다.",
    },
    {
      year: "2009",
      title: "국내 최초 다문화마을특구",
      body: "원곡동 일대가 다문화특구로 지정됐다. 외국인주민센터가 들어섰고, 한자로 쓸 수 없는 은행 이름까지 한자 간판을 새로 달았다.",
    },
    {
      year: "오늘",
      title: "주민 88%가 외국인",
      body: "안산 전체에는 110여 나라에서 온 8만여 명이 산다. 이 거리에서는 10여 개국 사람들이 각자의 음식과 문화를 펼쳐놓고 있다.",
    },
  ],
  sourceLabel: "출처",
  sources: [
    "디지털안산문화대전 (한국학중앙연구원 향토문화전자대전) — 1981~2008년 서술",
    "한국관광정보 공공데이터 (안산 다문화특구·안산다문화음식거리) — 2009년 특구 지정 이후",
  ],
  nextLabel: "이제 거리로",
};

const en: StoryContent = {
  kicker: "How Wongok became Wongok",
  title: "A street that began where people left",
  lead: "Wongok-dong did not start out multicultural. It was built as housing for factory workers, and today's street took shape after they moved away.",
  chapters: [
    {
      year: "1981",
      title: "The industrial complex starts up",
      body: "As the Banwol Industrial Complex began full operation, people came from all over the country looking for work. Wongok-dong was built to house them.",
    },
    {
      year: "Late 1980s",
      title: "A neighbourhood of 34,000",
      body: "Wongok-dong grew into a large residential district of 34,000 people, and by the early 1990s it was one of Ansan's main residential and commercial areas.",
    },
    {
      year: "End of the 1980s",
      title: "People leave",
      body: "As the complex restructured and the local economy contracted, many Korean residents moved out. The population fell sharply.",
    },
    {
      year: "Around 1994",
      title: "Others fill the empty rooms",
      body: "Migrant workers moved into the homes that had emptied. Ansan Station was close, cheap multi-unit housing was everywhere, and the Banwol and Sihwa complexes were minutes away.",
    },
    {
      year: "2009",
      title: "Korea's first multicultural village district",
      body: "Wongok-dong was designated a multicultural special district. A residents' centre for foreigners opened, and even banks whose names cannot be written in Chinese characters put up new signs in them.",
    },
    {
      year: "Today",
      title: "88% of residents are foreign nationals",
      body: "Ansan as a whole is home to some 80,000 people from over 110 countries. On this street, people from around ten countries lay out their own food and culture.",
    },
  ],
  sourceLabel: "Sources",
  sources: [
    "Digital Ansan Cultural Encyclopedia (Academy of Korean Studies) — for the 1981-2008 account",
    "Korean public tourism data (Ansan Multicultural District / Food Street) — from the 2009 designation onward",
  ],
  nextLabel: "Now to the street",
};

const zh: StoryContent = {
  kicker: "元谷洞的时间",
  title: "从人们离开之处开始的街道",
  lead: "元谷洞起初并不是多元文化村。它本是为工业园区工人建的住宅区，如今的街道是在他们离开之后才形成的。",
  chapters: [
    {
      year: "1981",
      title: "工业园区开始运转",
      body: "半月工业园区全面投产后，全国各地的人涌来找工作。元谷洞就是为安置这些工人而建的。",
    },
    {
      year: "1980年代后期",
      title: "三万四千人的社区",
      body: "元谷洞发展成居住着34,000人的大型住宅区，到1990年代初已成为安山的主要居住与商业地区。",
    },
    {
      year: "1980年代末",
      title: "人们离开",
      body: "随着园区产业结构剧变、经济萎缩，大批韩国居民迁出元谷洞，人口急剧减少。",
    },
    {
      year: "1994年前后",
      title: "填补空屋的人们",
      body: "外籍劳工搬进了空出来的房子。这里紧邻安山站，廉价的多户住宅成排林立，半月与始华工业园区近在咫尺。",
    },
    {
      year: "2009",
      title: "韩国首个多元文化村特区",
      body: "元谷洞一带被指定为多元文化特区。外国人居民中心落成，连无法用汉字书写的银行名称也挂上了新的汉字招牌。",
    },
    {
      year: "今天",
      title: "88%的居民是外国人",
      body: "整个安山住着来自110多个国家的8万余人。在这条街上，约十个国家的人各自摆开自己的食物与文化。",
    },
  ],
  sourceLabel: "资料来源",
  sources: [
    "数字安山文化大典（韩国学中央研究院）——1981至2008年部分",
    "韩国旅游公共数据（安山多元文化特区·多元文化美食街）——2009年指定之后",
  ],
  nextLabel: "现在走进街道",
};

const ja: StoryContent = {
  kicker: "ウォンゴク洞の時間",
  title: "人が去った場所から始まった通り",
  lead: "ウォンゴク洞は初めから多文化の街だったわけではない。工業団地で働く人たちのために建てられた住宅地で、彼らが去ったあとに今の通りができた。",
  chapters: [
    {
      year: "1981",
      title: "工業団地が動き出す",
      body: "パンウォル工業団地が本格稼働し、全国から仕事を求めて人が集まった。ウォンゴク洞はその労働者が住むために造られた街だった。",
    },
    {
      year: "1980年代後半",
      title: "3万4千人の街",
      body: "ウォンゴク洞は34,000人が暮らす大規模住宅地となり、1990年代初めにはアンサンの中心的な住宅・商業地区になった。",
    },
    {
      year: "1980年代末",
      title: "人が去っていく",
      body: "団地の産業構造が急速に再編され景気が冷え込むと、多くの韓国人住民がウォンゴク洞を離れた。人口は急激に減った。",
    },
    {
      year: "1994年ごろ",
      title: "空いた部屋を埋めた人たち",
      body: "去った人たちの部屋に外国人労働者が入ってきた。アンサン駅が近く、家賃の安い集合住宅が並び、パンウォル・シファ工業団地もすぐそばだった。",
    },
    {
      year: "2009",
      title: "韓国初の多文化村特区",
      body: "ウォンゴク洞一帯が多文化特区に指定された。外国人住民センターができ、漢字で書けない銀行名まで漢字の看板を新しく掲げた。",
    },
    {
      year: "現在",
      title: "住民の88%が外国人",
      body: "アンサン全体では110余りの国から来た8万人あまりが暮らす。この通りでは10か国ほどの人々がそれぞれの料理と文化を広げている。",
    },
  ],
  sourceLabel: "出典",
  sources: [
    "デジタルアンサン文化大典（韓国学中央研究院）— 1981〜2008年の記述",
    "韓国観光公共データ（アンサン多文化特区・多文化グルメ通り）— 2009年の特区指定以降",
  ],
  nextLabel: "では通りへ",
};

const ru: StoryContent = {
  kicker: "Время Вонгок-тона",
  title: "Улица, начавшаяся там, откуда ушли люди",
  lead: "Вонгок-тон не был многокультурным с самого начала. Его построили как жильё для рабочих промышленной зоны, и нынешняя улица появилась после того, как они уехали.",
  chapters: [
    {
      year: "1981",
      title: "Промзона запускается",
      body: "Когда промышленная зона Панвол заработала в полную силу, люди со всей страны поехали сюда за работой. Вонгок-тон построили как жильё для них.",
    },
    {
      year: "Вторая половина 1980-х",
      title: "Район на 34 тысячи человек",
      body: "Вонгок-тон вырос в крупный жилой район на 34 000 жителей, а к началу 1990-х стал одним из главных жилых и торговых районов Ансана.",
    },
    {
      year: "Конец 1980-х",
      title: "Люди уезжают",
      body: "Промзона резко перестраивалась, экономика сжималась, и многие корейские жители покинули Вонгок-тон. Население быстро сокращалось.",
    },
    {
      year: "Около 1994",
      title: "Пустые комнаты занимают другие",
      body: "В освободившееся жильё приехали рабочие-мигранты. Станция Ансан рядом, дешёвых многоквартирных домов много, а промзоны Панвол и Сихва — в нескольких минутах.",
    },
    {
      year: "2009",
      title: "Первый в Корее многокультурный район",
      body: "Вонгок-тон получил статус особого многокультурного района. Открылся центр для жителей-иностранцев, и даже банки, чьи названия нельзя записать иероглифами, повесили новые вывески на них.",
    },
    {
      year: "Сегодня",
      title: "88% жителей — иностранцы",
      body: "Во всём Ансане живёт около 80 000 человек более чем из 110 стран. На этой улице люди примерно из десяти стран раскладывают свою еду и свою культуру.",
    },
  ],
  sourceLabel: "Источники",
  sources: [
    "Цифровая культурная энциклопедия Ансана (Академия корееведения) — период 1981-2008",
    "Открытые туристические данные Кореи (многокультурный район и улица еды Ансана) — с 2009 года",
  ],
  nextLabel: "Теперь на улицу",
};

const id: StoryContent = {
  kicker: "Perjalanan Wongok-dong",
  title: "Jalan yang bermula dari tempat yang ditinggalkan",
  lead: "Wongok-dong tidak multikultural sejak awal. Kawasan ini dibangun sebagai permukiman pekerja kawasan industri, dan jalan yang kita lihat sekarang terbentuk setelah mereka pergi.",
  chapters: [
    {
      year: "1981",
      title: "Kawasan industri mulai beroperasi",
      body: "Ketika Kawasan Industri Banwol beroperasi penuh, orang datang dari seluruh negeri untuk mencari kerja. Wongok-dong dibangun sebagai tempat tinggal mereka.",
    },
    {
      year: "Paruh kedua 1980-an",
      title: "Permukiman 34.000 jiwa",
      body: "Wongok-dong tumbuh menjadi permukiman besar berisi 34.000 orang, dan pada awal 1990-an menjadi salah satu kawasan hunian dan niaga utama Ansan.",
    },
    {
      year: "Penghujung 1980-an",
      title: "Orang-orang pergi",
      body: "Struktur industri kawasan berubah drastis dan ekonomi melemah, sehingga banyak warga Korea meninggalkan Wongok-dong. Jumlah penduduk turun tajam.",
    },
    {
      year: "Sekitar 1994",
      title: "Yang mengisi rumah-rumah kosong",
      body: "Pekerja migran menempati rumah yang ditinggalkan. Stasiun Ansan dekat, rumah petak murah berjajar, dan kawasan industri Banwol serta Sihwa hanya beberapa menit.",
    },
    {
      year: "2009",
      title: "Distrik multikultural pertama di Korea",
      body: "Wongok-dong ditetapkan sebagai distrik khusus multikultural. Pusat layanan warga asing dibuka, dan bahkan bank yang namanya tidak bisa ditulis dengan aksara Han memasang papan nama baru dalam aksara itu.",
    },
    {
      year: "Hari ini",
      title: "88% warganya orang asing",
      body: "Di seluruh Ansan tinggal sekitar 80.000 orang dari lebih dari 110 negara. Di jalan ini, orang dari sekitar sepuluh negara menggelar makanan dan budaya mereka masing-masing.",
    },
  ],
  sourceLabel: "Sumber",
  sources: [
    "Ensiklopedia Budaya Digital Ansan (Akademi Studi Korea) - untuk periode 1981-2008",
    "Data publik pariwisata Korea (Distrik Multikultural & Jalan Kuliner Ansan) - sejak penetapan 2009",
  ],
  nextLabel: "Sekarang ke jalannya",
};

export const STORY_BY_LANG: Record<Lang, StoryContent> = {
  ko,
  en,
  zh,
  ja,
  ru,
  id,
};
