export interface CatalogNutrient {
  name: string;
  benefit: string;
}

export interface VegetableCatalogEntry {
  id: string;
  number: number;
  name: string;
  category: '葉物・茎' | '実もの' | '根菜' | '豆・その他';
  season: string;
  shortNote: string;
  nutrients: CatalogNutrient[];
  recommendedDishes: string[];
  aliases: string[];
}

export const VEGETABLE_CATALOG: VegetableCatalogEntry[] = [
  {
    id: 'tomato',
    number: 1,
    name: 'トマト',
    category: '実もの',
    season: '6月〜8月（夏・通年流通）',
    shortNote: 'リコピンたっぷりの赤い定番野菜。ミニトマトもトマトと同じ仲間として登録されます。',
    nutrients: [
      { name: 'リコピン', benefit: '体がサビつくのを防ぎ、若々しいコンディションを守るサポートをします。' },
      { name: 'ビタミンC', benefit: 'お肌の調子を整え、日々の元気を保つ働きがあるとされています。' },
      { name: 'カリウム', benefit: '体内の余分な塩分や水分バランスを整えるのを助けます。' },
    ],
    recommendedDishes: [
      'トマトとモッツァレラのカプレーゼ',
      'トマトと卵の中華風ふんわり炒め',
      'ミニトマトのハニーマリネ',
    ],
    aliases: ['トマト', 'ミニトマト', 'プチトマト', 'チェリートマト', 'フルーツトマト', 'ミディトマト', 'とまと'],
  },
  {
    id: 'carrot',
    number: 2,
    name: 'にんじん',
    category: '根菜',
    season: '10月〜12月（秋冬が特に甘い）',
    shortNote: '鮮やかなオレンジ色が特徴。油と一緒に摂ると栄養の吸収がアップします。',
    nutrients: [
      { name: 'β-カロテン', benefit: '体内で必要に応じてビタミンAに変わり、目や皮膚・粘膜の健康を保ちます。' },
      { name: '食物繊維', benefit: 'お腹の調子を整えて、スッキリとした毎日をサポートします。' },
      { name: 'カリウム', benefit: '体のめぐりや水分バランスを整える働きが期待できます。' },
    ],
    recommendedDishes: [
      'にんじんしりしり（ツナと卵炒め）',
      'キャロットラペ（さっぱりマリネ）',
      'にんじんとごぼうのきんぴら',
    ],
    aliases: ['にんじん', 'ニンジン', '人参', '金時人参', 'ミニキャロット', 'キャロット'],
  },
  {
    id: 'broccoli',
    number: 3,
    name: 'ブロッコリー',
    category: '葉物・茎',
    season: '11月〜3月（冬）',
    shortNote: '栄養バランスに優れた緑の野菜。冷凍やレンジ加熱でも手軽に取り入れられます。',
    nutrients: [
      { name: 'ビタミンC', benefit: '美容や体調管理を支える、頼もしいビタミンとして知られています。' },
      { name: '葉酸', benefit: '健やかな体づくりや血のめぐりをサポートする栄養素です。' },
      { name: '食物繊維', benefit: '腸内環境を整え、食後の満足感を高めてくれます。' },
    ],
    recommendedDishes: [
      'ブロッコリーとゆで卵のデリ風サラダ',
      'ブロッコリーとえびのガーリック炒め',
      'レンジで簡単チーズ焼き',
    ],
    aliases: ['ブロッコリー', 'ぶろっこりー', 'ブロッコリ', 'スティックセニョール', '茎ブロッコリー'],
  },
  {
    id: 'spinach',
    number: 4,
    name: 'ほうれん草',
    category: '葉物・茎',
    season: '11月〜2月（冬が甘みアップ）',
    shortNote: '冬の寒さで甘みが増す緑黄色野菜。おひたしやソテーで大活躍します。',
    nutrients: [
      { name: '鉄分', benefit: '全身に酸素を運ぶ働きに関わり、元気な毎日を応援します。' },
      { name: 'β-カロテン', benefit: '皮膚やのど・鼻の粘膜を健やかに保つとされています。' },
      { name: '葉酸', benefit: '新しい細胞づくりを助ける大切なビタミンのひとつです。' },
    ],
    recommendedDishes: [
      'ほうれん草とベーコンのバターソテー',
      'ほうれん草の胡麻和え',
      'ほうれん草とコーンのクリームスープ',
    ],
    aliases: ['ほうれん草', 'ほうれんそう', 'ホウレンソウ', 'ホウレン草', '法蓮草', 'サラダほうれん草'],
  },
  {
    id: 'komatsuna',
    number: 5,
    name: '小松菜',
    category: '葉物・茎',
    season: '12月〜2月（冬）',
    shortNote: 'アクが少なく下ゆでなしでも調理しやすい、カルシウムも豊富な青菜です。',
    nutrients: [
      { name: 'カルシウム', benefit: '丈夫な骨や歯をつくるための大切なミネラルです。' },
      { name: 'β-カロテン', benefit: '肌や粘膜のコンディションを整えるサポートをします。' },
      { name: 'ビタミンC', benefit: '日々の健康維持や鉄分の吸収を助ける働きがあります。' },
    ],
    recommendedDishes: [
      '小松菜と油揚げのさっと煮浸し',
      '小松菜と豚肉のオイスター炒め',
      '小松菜と豆腐のお味噌汁',
    ],
    aliases: ['小松菜', 'こまつな', 'コマツナ'],
  },
  {
    id: 'cabbage',
    number: 6,
    name: 'キャベツ',
    category: '葉物・茎',
    season: '3月〜5月（春）・11月〜3月（冬）',
    shortNote: '千切りでも炒め物でも食べやすい万能野菜。胃にやさしい成分も含まれています。',
    nutrients: [
      { name: 'ビタミンC', benefit: 'コラーゲンづくりや日々の元気をサポートするとされています。' },
      { name: 'ビタミンU（キャベジン）', benefit: '胃の粘膜をいたわり、すっきりとした食後感を助けます。' },
      { name: '食物繊維', benefit: 'お腹の調子を整える働きが期待できます。' },
    ],
    recommendedDishes: [
      '塩昆布とごま油のやみつきキャベツ',
      'キャベツと豚肉の回鍋肉',
      '千切りキャベツと蒸し鶏のサラダ',
    ],
    aliases: ['キャベツ', 'きゃべつ', '春キャベツ', '冬キャベツ', '紫キャベツ', 'レッドキャベツ', '芽キャベツ', '千切りキャベツ'],
  },
  {
    id: 'lettuce',
    number: 7,
    name: 'レタス',
    category: '葉物・茎',
    season: '4月〜6月（春）・11月〜12月',
    shortNote: 'シャキシャキ食感が楽しいサラダの定番。スープやチャーハンに入れても美味です。',
    nutrients: [
      { name: '食物繊維', benefit: 'お腹のリズムを整えるのに役立ちます。' },
      { name: 'カリウム', benefit: '体の水分バランスを整えるサポートをします。' },
      { name: 'ビタミンE', benefit: '日々の健やかなコンディションを保つ働きが期待されます。' },
    ],
    recommendedDishes: [
      'レタスとわかめのチョレギサラダ',
      'しゃきしゃきレタスチャーハン',
      '豚しゃぶのレタス包み',
    ],
    aliases: ['レタス', 'れたす', 'グリーンリーフ', 'フリルレタス', 'ロメインレタス', 'リーフレタス', '玉レタス'],
  },
  {
    id: 'cucumber',
    number: 8,
    name: 'きゅうり',
    category: '実もの',
    season: '6月〜8月（夏）',
    shortNote: 'みずみずしくポリポリとした食感が魅力。夏場の水分・ミネラル補給にもぴったり。',
    nutrients: [
      { name: 'カリウム', benefit: '余分な塩分を外に出しやすくし、すっきり感をサポートします。' },
      { name: 'ビタミンK', benefit: '健やかなめぐりや骨の健康に関わるビタミンです。' },
      { name: '食物繊維', benefit: 'みずみずしい食感で食事にさっぱり感を添えてくれます。' },
    ],
    recommendedDishes: [
      'たたききゅうりの梅おかか和え',
      'きゅうりとわかめの酢の物',
      'バンバンジー（蒸し鶏ときゅうり）',
    ],
    aliases: ['きゅうり', 'キュウリ', '胡瓜', 'きうり'],
  },
  {
    id: 'onion',
    number: 9,
    name: 'たまねぎ',
    category: '根菜',
    season: '4月〜6月（新玉ねぎ）・秋',
    shortNote: 'どんな料理にもコクと甘みを加えてくれる、毎日の食卓に欠かせない名脇役です。',
    nutrients: [
      { name: '硫化アリル（アリシン）', benefit: 'ビタミンB1の働きを助け、エネルギーづくりをサポートするとされます。' },
      { name: 'ケルセチン', benefit: 'ポリフェノールの一種で、めぐりのよい毎日を応援します。' },
      { name: 'オリゴ糖・食物繊維', benefit: 'お腹の善玉菌を元気づける働きが期待されます。' },
    ],
    recommendedDishes: [
      '新玉ねぎのスライスおかかポン酢',
      'オニオンスープ（飴色玉ねぎ）',
      '豚のしょうが焼き（玉ねぎたっぷり）',
    ],
    aliases: ['たまねぎ', '玉ねぎ', 'タマネギ', '玉葱', '新玉ねぎ', '新玉', '紫玉ねぎ', '赤玉ねぎ', 'アーリーレッド', 'ペコロス'],
  },
  {
    id: 'pumpkin',
    number: 10,
    name: 'かぼちゃ',
    category: '実もの',
    season: '9月〜12月（秋冬がほくほく）',
    shortNote: 'ビタミンエース（A・C・E）がそろった栄養豊富な緑黄色野菜です。',
    nutrients: [
      { name: 'β-カロテン', benefit: '目や皮膚の健康を保ち、健やかな毎日をサポートします。' },
      { name: 'ビタミンE', benefit: '体のめぐりを助け、冷えやコンディションのケアに役立ちます。' },
      { name: 'ビタミンC', benefit: '季節の変わり目の体調維持を支えてくれます。' },
    ],
    recommendedDishes: [
      'ほくほくかぼちゃの煮物',
      'かぼちゃとクリームチーズのサラダ',
      'レンジで作るかぼちゃのポタージュ',
    ],
    aliases: ['かぼちゃ', 'カボチャ', '南瓜', 'パンプキン', '坊ちゃんかぼちゃ'],
  },
  {
    id: 'eggplant',
    number: 11,
    name: 'なす',
    category: '実もの',
    season: '6月〜9月（夏・秋なす）',
    shortNote: '皮の紫色にポリフェノールを含む、油や出汁と相性抜群の野菜です。',
    nutrients: [
      { name: 'ナスニン（アントシアニン）', benefit: '皮に含まれるポリフェノールで、健やかさを守る働きが期待されます。' },
      { name: 'カリウム', benefit: '体の水分バランスを整えるサポートをしてくれます。' },
      { name: '食物繊維', benefit: 'お腹の調子を穏やかに整えるのに役立ちます。' },
    ],
    recommendedDishes: [
      'なすの揚げ浸し（麺つゆ＆しょうが）',
      '麻婆なす',
      'なすとトマトのミートパスタ',
    ],
    aliases: ['なす', 'ナス', '茄子', 'なすび', '米なす', '長なす', '水なす', '秋なす'],
  },
  {
    id: 'bell_pepper',
    number: 12,
    name: 'ピーマン',
    category: '実もの',
    season: '6月〜8月（夏）',
    shortNote: 'さわやかな香りとほろ苦さがアクセント。ビタミンCが熱に強いのが特徴です。',
    nutrients: [
      { name: 'ビタミンC', benefit: '加熱しても壊れにくく、お肌や元気のサポートに役立ちます。' },
      { name: 'β-カロテン', benefit: '皮膚や粘膜の健康維持に働くとされています。' },
      { name: 'ピラジン', benefit: '独特の香り成分で、巡りをよくする働きが注目されています。' },
    ],
    recommendedDishes: [
      'レンジで簡単・無限ピーマン',
      'ピーマンと牛肉のチンジャオロース',
      'ピーマンの肉詰め',
    ],
    aliases: ['ピーマン', 'ぴーまん', 'グリーンピーマン', 'こどもピーマン'],
  },
  {
    id: 'paprika',
    number: 13,
    name: 'パプリカ',
    category: '実もの',
    season: '6月〜9月（夏）',
    shortNote: '肉厚で甘みがあり、赤・黄・オレンジと食卓を一気にカラフルにしてくれます。',
    nutrients: [
      { name: 'ビタミンC', benefit: '野菜の中でもトップクラスの含有量で、美容と健康を応援します。' },
      { name: 'β-カロテン', benefit: 'カラフルな色素成分とともに、健やかなコンディションを守ります。' },
      { name: 'ビタミンE', benefit: '脂溶性ビタミンで、若々しい毎日をサポートします。' },
    ],
    recommendedDishes: [
      'カラフルパプリカのピクルス',
      '鶏肉とパプリカの甘酢炒め（酢鶏）',
      'パプリカとズッキーニのグリル',
    ],
    aliases: ['パプリカ', 'ぱぷりか', '赤パプリカ', '黄パプリカ', 'オレンジパプリカ', 'カラーピーマン'],
  },
  {
    id: 'daikon',
    number: 14,
    name: 'だいこん',
    category: '根菜',
    season: '11月〜2月（冬）',
    shortNote: '生ですりおろしても、じっくり煮込んでもおいしい和食の定番根菜です。',
    nutrients: [
      { name: 'ジアスターゼ（消化酵素）', benefit: '生のすりおろしに多く含まれ、食べ物の消化をやさしく助けます。' },
      { name: 'ビタミンC', benefit: '皮の近くにも多く、日々のコンディションを整えます。' },
      { name: '食物繊維', benefit: 'お腹の調子を整える働きがあります。' },
    ],
    recommendedDishes: [
      '大根と豚バラのほっこり煮',
      'シャキシャキ大根とツナのサラダ',
      '大根おろしと焼き魚',
    ],
    aliases: ['だいこん', '大根', 'ダイコン', '大根おろし', '切り干し大根', 'カイワレ大根', '紅芯大根'],
  },
  {
    id: 'napa_cabbage',
    number: 15,
    name: 'はくさい',
    category: '葉物・茎',
    season: '11月〜2月（冬）',
    shortNote: '鍋物やスープに欠かせない冬の主役。かさが減るのでたっぷり食べられます。',
    nutrients: [
      { name: 'ビタミンC', benefit: '冬の体調管理や肌のうるおいをサポートします。' },
      { name: 'カリウム', benefit: '体内の余分な塩分バランスを整えるのを助けます。' },
      { name: '食物繊維', benefit: '腸内環境を整え、すっきりとした毎日を支えます。' },
    ],
    recommendedDishes: [
      '白菜と豚バラのミルフィーユ鍋',
      '白菜とツナのうま塩和え',
      '白菜のクリームシチュー',
    ],
    aliases: ['はくさい', '白菜', 'ハクサイ', 'ミニ白菜', 'オレンジ白菜'],
  },
  {
    id: 'green_onion',
    number: 16,
    name: 'ねぎ',
    category: '葉物・茎',
    season: '11月〜2月（冬・通年流通）',
    shortNote: '薬味から鍋の主役まで幅広く使える香り野菜。青い葉にも栄養がつまっています。',
    nutrients: [
      { name: 'アリシン', benefit: '特有の香りと辛味成分で、元気な毎日やエネルギー活用を助けます。' },
      { name: 'β-カロテン', benefit: '特に緑の部分に豊富で、皮膚や粘膜の健康を保ちます。' },
      { name: 'ビタミンC', benefit: '季節の体調管理をサポートする働きがあります。' },
    ],
    recommendedDishes: [
      '豚ねぎ塩だれ丼',
      '焼き長ねぎの甘み南蛮漬け',
      'ねぎたっぷりのお味噌汁・納豆',
    ],
    aliases: ['ねぎ', 'ネギ', '葱', '長ねぎ', '長ネギ', '白ねぎ', '青ねぎ', '小ねぎ', '万能ねぎ', '九条ねぎ', 'わけぎ', '葉ねぎ'],
  },
  {
    id: 'bean_sprouts',
    number: 17,
    name: 'もやし',
    category: '豆・その他',
    season: '通年',
    shortNote: 'お財布にやさしく、さっと加熱するだけでシャキシャキおいしい頼れる食材です。',
    nutrients: [
      { name: 'アスパラギン酸', benefit: 'エネルギーづくりに関わり、疲労ケアを応援するアミノ酸です。' },
      { name: 'ビタミンC', benefit: '発芽することで豆の頃より増え、日々の元気を支えます。' },
      { name: '食物繊維', benefit: 'お腹の調子を整え、食べ応えをプラスしてくれます。' },
    ],
    recommendedDishes: [
      'もやしとニラのスタミナ炒め',
      'もやしナムル（ごま油＆塩）',
      '豚もやしレンジ蒸し（ポン酢かけ）',
    ],
    aliases: ['もやし', 'モヤシ', '緑豆もやし', '大豆もやし', '豆もやし', '黒豆もやし'],
  },
  {
    id: 'asparagus',
    number: 18,
    name: 'アスパラガス',
    category: '葉物・茎',
    season: '4月〜6月（春〜初夏）',
    shortNote: '穂先に栄養がつまった爽やかな茎野菜。お弁当の彩りにもぴったりです。',
    nutrients: [
      { name: 'アスパラギン酸', benefit: 'その名の通りアスパラから見つかった成分で、活力維持を助けます。' },
      { name: 'ルチン', benefit: '穂先に多く含まれ、体のめぐりを健やかに保つとされます。' },
      { name: '葉酸', benefit: '健やかな細胞づくりを支えるビタミンです。' },
    ],
    recommendedDishes: [
      'アスパラのベーコン巻きソテー',
      'アスパラとエビのマヨ炒め',
      'アスパラガスと半熟卵の温サラダ',
    ],
    aliases: ['アスパラガス', 'アスパラ', 'あすぱらがす', 'あすぱら', 'グリーンアスパラ', 'ホワイトアスパラ'],
  },
  {
    id: 'lotus_root',
    number: 19,
    name: 'れんこん',
    category: '根菜',
    season: '10月〜1月（秋冬）',
    shortNote: 'シャキシャキにもホクホクにもなる不思議な食感が楽しい穴あき根菜です。',
    nutrients: [
      { name: 'ビタミンC', benefit: 'でんぷんに守られて加熱に強く、肌や体調維持を助けます。' },
      { name: 'タンニン', benefit: 'ポリフェノールの一種で、すっきりとしたコンディションを応援します。' },
      { name: '食物繊維', benefit: '不溶性食物繊維が多く、お腹の調子を整えてくれます。' },
    ],
    recommendedDishes: [
      'れんこんと鶏肉の甘酢照り焼き',
      'シャキシャキれんこんのきんぴら',
      'れんこんとひじきのマヨサラダ',
    ],
    aliases: ['れんこん', 'レンコン', '蓮根'],
  },
  {
    id: 'burdock',
    number: 20,
    name: 'ごぼう',
    category: '根菜',
    season: '11月〜1月（秋冬）',
    shortNote: '独特の香ばしさと噛みごたえがあり、食物繊維がとっても豊富な根菜です。',
    nutrients: [
      { name: '食物繊維（イヌリン・リグニン）', benefit: '腸内環境を整えて、毎日のすっきり感を強くサポートします。' },
      { name: 'クロロゲン酸', benefit: '皮付近に含まれるポリフェノールで、健やかさを守ります。' },
      { name: 'カリウム', benefit: '体のめぐりや水分バランスを整えます。' },
    ],
    recommendedDishes: [
      'ごぼうとにんじんのきんぴら',
      '根菜たっぷり豚汁',
      'ごぼうと鶏肉の炊き込みご飯',
    ],
    aliases: ['ごぼう', 'ゴボウ', '牛蒡', '新ごぼう', 'サラダごぼう'],
  },
  {
    id: 'snap_pea',
    number: 21,
    name: 'スナップえんどう',
    category: '豆・その他',
    season: '4月〜6月（春〜初夏）',
    shortNote: 'さやごとポリっと食べられる甘い春野菜。さっと塩ゆでするだけでもごちそうです。',
    nutrients: [
      { name: 'ビタミンC', benefit: '豆とさやの両方から摂れ、肌のケアや元気を支えます。' },
      { name: 'β-カロテン', benefit: '皮膚や粘膜の健康維持を助ける緑黄色野菜の栄養です。' },
      { name: '食物繊維', benefit: 'お腹の調子を整える働きが期待できます。' },
    ],
    recommendedDishes: [
      'スナップえんどうの塩ゆで（マヨネーズ添え）',
      'スナップえんどうと卵の炒め物',
      '春野菜のペペロンチーノ',
    ],
    aliases: ['スナップえんどう', 'スナップエンドウ', 'スナックえんどう'],
  },
  {
    id: 'edamame',
    number: 22,
    name: '枝豆',
    category: '豆・その他',
    season: '7月〜9月（夏・冷凍で通年）',
    shortNote: '大豆の仲間でありながらビタミンも含む、たんぱく質豊富なグリーンのおつまみ野菜。',
    nutrients: [
      { name: '植物性たんぱく質', benefit: '筋肉や肌・髪など、体をつくる大切な材料になります。' },
      { name: 'ビタミンB1', benefit: '食事の糖質をエネルギーに変えるのを助けます。' },
      { name: '葉酸', benefit: '体のめぐりや健やかな細胞づくりをサポートします。' },
    ],
    recommendedDishes: [
      '塩ゆで枝豆・ガーリックペッパー枝豆',
      '枝豆と塩昆布のおにぎり',
      '枝豆とコーンの彩りサラダ',
    ],
    aliases: ['枝豆', 'えだまめ', 'エダマメ', 'だだちゃ豆', '茶豆'],
  },
  {
    id: 'corn',
    number: 23,
    name: 'とうもろこし',
    category: '豆・その他',
    season: '6月〜9月（夏）',
    shortNote: 'プチプチ甘くて子どもから大人まで大人気。サラダやスープの定番です。',
    nutrients: [
      { name: '食物繊維（セルロース）', benefit: '粒の皮に豊富で、お腹のスッキリを助けます。' },
      { name: 'ビタミンB1・B2', benefit: '日々のエネルギーづくりやコンディション維持に関わります。' },
      { name: 'ビタミンE', benefit: '若々しさをサポートする抗酸化ビタミンのひとつです。' },
    ],
    recommendedDishes: [
      '焼きとうもろこし（バター醤油）',
      'コーンと枝豆のバターソテー',
      'とうもろこしの炊き込みご飯',
    ],
    aliases: ['とうもろこし', 'トウモロコシ', '玉蜀黍', 'コーン', 'スイートコーン', 'ヤングコーン', 'ベビーコーン'],
  },
  {
    id: 'okra',
    number: 24,
    name: 'オクラ',
    category: '実もの',
    season: '7月〜9月（夏）',
    shortNote: '切ると星型になるかわいい野菜。ネバネバ成分がお腹にやさしく寄り添います。',
    nutrients: [
      { name: '食物繊維（ペクチン）', benefit: '独特のネバネバのもとで、お腹の調子を整える働きがあります。' },
      { name: 'β-カロテン', benefit: '皮膚や粘膜の健康を保つサポートをします。' },
      { name: '葉酸', benefit: '健やかな体づくりを応援する栄養素です。' },
    ],
    recommendedDishes: [
      'オクラのおかかポン酢和え',
      'オクラと長芋のネバネバ丼',
      'オクラの肉巻き照り焼き',
    ],
    aliases: ['オクラ', 'おくら', '丸オクラ', '赤オクラ'],
  },
  {
    id: 'zucchini',
    number: 25,
    name: 'ズッキーニ',
    category: '実もの',
    season: '6月〜8月（夏）',
    shortNote: 'きゅうりに似ていますがかぼちゃの仲間。焼くとじゅわっとジューシーになります。',
    nutrients: [
      { name: 'カリウム', benefit: '体の余分な塩分や水分バランスを整えるのを助けます。' },
      { name: 'β-カロテン', benefit: '油と一緒に調理すると吸収しやすく、健康維持を支えます。' },
      { name: 'ビタミンC', benefit: '肌のコンディションや元気をサポートします。' },
    ],
    recommendedDishes: [
      'ズッキーニとなすのラタトゥイユ',
      'ズッキーニのオリーブオイルグリル（粉チーズがけ）',
      'ズッキーニとベーコンのパスタ',
    ],
    aliases: ['ズッキーニ', 'ずっきーに', '黄ズッキーニ'],
  },
  {
    id: 'garlic_chives',
    number: 26,
    name: 'にら',
    category: '葉物・茎',
    season: '3月〜5月（春にらが柔らか）・通年',
    shortNote: '香り豊かなスタミナ野菜。卵やもやしと合わせるだけでご飯が進む一品になります。',
    nutrients: [
      { name: 'アリシン', benefit: 'ビタミンB1の働きを高め、元気な毎日を応援する香り成分です。' },
      { name: 'β-カロテン', benefit: '緑黄色野菜ならではの豊富なカロテンで健康維持を支えます。' },
      { name: 'ビタミンK', benefit: '骨や体のめぐりに関わるビタミンのひとつです。' },
    ],
    recommendedDishes: [
      'ふんわりニラ玉炒め',
      '豚肉ともやし・ニラのうま塩炒め',
      '手作りニラ餃子',
    ],
    aliases: ['にら', 'ニラ', '韮', '黄ニラ'],
  },
  {
    id: 'mizuna',
    number: 27,
    name: '水菜',
    category: '葉物・茎',
    season: '11月〜3月（冬・通年流通）',
    shortNote: '細長い葉がシャキシャキしてクセがなく、生のサラダにも鍋物にもよく合います。',
    nutrients: [
      { name: 'ビタミンC', benefit: '生で食べることが多いので効率よく摂りやすく、美容を応援します。' },
      { name: 'カルシウム', benefit: '丈夫な骨づくりに役立つミネラルを含んでいます。' },
      { name: 'β-カロテン', benefit: '肌や粘膜のコンディションを整える働きがあります。' },
    ],
    recommendedDishes: [
      '水菜とツナ・油揚げのハリハリサラダ',
      '水菜と豚肉のしゃぶしゃぶ（ハリハリ鍋）',
      '水菜と大根の和風サラダ',
    ],
    aliases: ['水菜', 'みずな', 'ミズナ', '京水菜', 'サラダ水菜'],
  },
  {
    id: 'pea_sprouts',
    number: 28,
    name: '豆苗',
    category: '葉物・茎',
    season: '通年',
    shortNote: 'えんどう豆の若い芽。価格が安定していて、実は緑黄色野菜なみの栄養価です。',
    nutrients: [
      { name: 'β-カロテン', benefit: '体内でビタミンAに変わり、目や肌の健康を保ちます。' },
      { name: 'ビタミンK', benefit: '健やかな骨づくりをサポートします。' },
      { name: '葉酸・ビタミンC', benefit: '日々の体調維持とめぐりを応援します。' },
    ],
    recommendedDishes: [
      '豆苗と豚バラのレンジ蒸し',
      '豆苗と卵のにんにく塩炒め',
      '豆苗ともやしのナムル',
    ],
    aliases: ['豆苗', 'とうみょう', 'トウミョウ'],
  },
  {
    id: 'turnip',
    number: 29,
    name: 'かぶ',
    category: '根菜',
    season: '10月〜12月・3月〜5月',
    shortNote: '白い実はやわらかく甘みがあり、緑の葉っぱにも栄養がたっぷりつまっています。',
    nutrients: [
      { name: 'ビタミンC', benefit: '白い実にも葉にも含まれ、健やかな毎日を支えます。' },
      { name: 'アミラーゼ（消化酵素）', benefit: '生のまま食べると消化をやさしく助けてくれます。' },
      { name: 'カリウム', benefit: '体の水分バランスを整えるのをサポートします。' },
    ],
    recommendedDishes: [
      'かぶと鶏ひき肉のとろみあんかけ',
      'かぶの浅漬け（ゆず風味）',
      'かぶとベーコンのコンソメスープ',
    ],
    aliases: ['かぶ', 'カブ', '蕪', '小かぶ', '聖護院かぶ', '赤かぶ'],
  },
  {
    id: 'bok_choy',
    number: 30,
    name: 'チンゲン菜',
    category: '葉物・茎',
    season: '9月〜12月（秋〜冬・通年流通）',
    shortNote: 'クセがなく甘みがあり、中華炒めやスープ、おひたしにもぴったりの中国野菜です。',
    nutrients: [
      { name: 'β-カロテン', benefit: '緑色の濃い葉に豊富で、皮膚や粘膜の健康を保つとされています。' },
      { name: 'カルシウム', benefit: '丈夫な骨や歯づくりを支えるミネラルが含まれています。' },
      { name: 'ビタミンC', benefit: '日々の体調管理や肌のうるおいをサポートします。' },
    ],
    recommendedDishes: [
      'チンゲン菜と豚肉の中華うま煮',
      'チンゲン菜のオイスターソース炒め',
      'チンゲン菜と卵の中華スープ',
    ],
    aliases: ['チンゲン菜', 'チンゲンサイ', 'ちんげんさい', '青梗菜', 'ミニチンゲン菜'],
  },
  {
    id: 'garland_chrysanthemum',
    number: 31,
    name: '春菊',
    category: '葉物・茎',
    season: '11月〜2月（冬）',
    shortNote: 'さわやかな香りとほろ苦さが魅力。お鍋だけでなく生サラダや白和えでも人気です。',
    nutrients: [
      { name: 'β-カロテン', benefit: '非常に豊富に含まれ、目や皮膚・のどの健康維持を助けます。' },
      { name: 'カルシウム・鉄分', benefit: '健やかな骨と元気な毎日の土台を支えるミネラルです。' },
      { name: '葉酸', benefit: '体のめぐりや新しい細胞づくりをサポートします。' },
    ],
    recommendedDishes: [
      '春菊とツナのナムル（生サラダ風）',
      '春菊の胡麻和え',
      'すき焼き・寄せ鍋の春菊',
    ],
    aliases: ['春菊', 'しゅんぎく', 'シュンギク', '菊菜', 'きくな'],
  },
  {
    id: 'sunny_lettuce',
    number: 32,
    name: 'サニーレタス',
    category: '葉物・茎',
    season: '4月〜6月・10月〜12月（通年流通）',
    shortNote: '葉先の赤紫色がきれいな非結球レタス。玉レタスよりβ-カロテンが豊富です。',
    nutrients: [
      { name: 'β-カロテン', benefit: '緑黄色野菜に分類されるほど豊富で、肌や粘膜のケアに役立ちます。' },
      { name: 'ビタミンC', benefit: '生で食べやすく、美容と健康維持を応援します。' },
      { name: 'カリウム・食物繊維', benefit: '体の水分バランスとお腹の調子を整えます。' },
    ],
    recommendedDishes: [
      'サニーレタスと豆腐のチョレギサラダ',
      'サムギョプサル風の焼き肉レタス包み',
      'サニーレタスとツナの海苔サラダ',
    ],
    aliases: ['サニーレタス', 'さにーれたす', 'レッドリーフレタス', '赤チマサンチュ'],
  },
  {
    id: 'cauliflower',
    number: 33,
    name: 'カリフラワー',
    category: '葉物・茎',
    season: '11月〜3月（冬）',
    shortNote: 'ほっくりした食感とやさしい甘みの白い花野菜。ビタミンCが加熱しても壊れにくいのが強みです。',
    nutrients: [
      { name: 'ビタミンC', benefit: '加熱による損失が少なく、お肌や日々の元気をしっかり支えます。' },
      { name: 'カリウム', benefit: '余分な塩分の排出を助け、すっきり感をサポートします。' },
      { name: '食物繊維', benefit: 'お腹の調子を整え、満足感を高めてくれます。' },
    ],
    recommendedDishes: [
      'カリフラワーのカレー風味マヨ焼き',
      'カリフラワーとベーコンの豆乳ポタージュ',
      'カリフラワーのピクルス',
    ],
    aliases: ['カリフラワー', 'かりふらわー', '花キャベツ', 'ロマネスコ'],
  },
  {
    id: 'celery',
    number: 34,
    name: 'セロリ',
    category: '葉物・茎',
    season: '11月〜5月（冬〜春）',
    shortNote: 'シャキシャキ食感とさわやかな香りが特徴。スープの香りづけやピクルスにぴったりです。',
    nutrients: [
      { name: 'カリウム', benefit: '体のめぐりや水分バランスを整えるサポートをします。' },
      { name: '食物繊維', benefit: '噛みごたえのある繊維質がお腹の調子を助けます。' },
      { name: 'アピイン（香り成分）', benefit: '独特のさわやかな香りで、リラックスや食後のすっきり感を応援します。' },
    ],
    recommendedDishes: [
      'セロリときゅうりの浅漬け・ピクルス',
      'セロリと鶏ささみの塩だれ和え',
      '野菜たっぷりミネストローネ',
    ],
    aliases: ['セロリ', 'せろり', 'セルリー', 'セロリの葉'],
  },
  {
    id: 'bitter_melon',
    number: 35,
    name: 'ゴーヤ',
    category: '実もの',
    season: '6月〜8月（夏）',
    shortNote: 'ほろ苦さがクセになる夏の定番野菜。わたを取って塩もみすると食べやすくなります。',
    nutrients: [
      { name: 'ビタミンC', benefit: '加熱に強く、夏の日差しや季節のコンディションケアを助けます。' },
      { name: 'モモルデシン', benefit: '独特の苦味成分で、食欲や胃腸の元気を応援するとされます。' },
      { name: 'カリウム・葉酸', benefit: '夏場の水分バランスや健やかな体づくりを支えます。' },
    ],
    recommendedDishes: [
      '定番のゴーヤチャンプルー',
      'ゴーヤとツナのさっぱりマヨサラダ',
      'ゴーヤの肉詰め焼き',
    ],
    aliases: ['ゴーヤ', 'ごーや', 'ゴーヤー', 'ごーやー', '苦瓜', 'にがうり', 'ニガウリ'],
  },
  {
    id: 'bamboo_shoot',
    number: 36,
    name: 'たけのこ',
    category: '豆・その他',
    season: '3月〜5月（春）',
    shortNote: 'コリコリとした歯ざわりと春の香りが楽しめる食材。食物繊維やカリウムが豊富です。',
    nutrients: [
      { name: '食物繊維', benefit: '不溶性食物繊維が多く、お腹の中をすっきり整えてくれます。' },
      { name: 'カリウム', benefit: '体内の余分な塩分バランスを整えるサポートをします。' },
      { name: 'チロシン', benefit: '白い粒に見られるアミノ酸で、やる気や集中を支える成分とされます。' },
    ],
    recommendedDishes: [
      '香りゆたかなたけのこご飯',
      'たけのことわかめの若竹煮',
      'チンジャオロース（細切りたけのこ＆ピーマン）',
    ],
    aliases: ['たけのこ', 'タケノコ', '筍', '竹の子', '竹のこ', '姫竹', '細竹'],
  },
  {
    id: 'broad_bean',
    number: 37,
    name: 'そら豆',
    category: '豆・その他',
    season: '4月〜6月（春〜初夏）',
    shortNote: 'ほくほくした食感とやさしい甘みが人気の季節の豆野菜。焼いても茹でても絶品です。',
    nutrients: [
      { name: '植物性たんぱく質', benefit: '体づくりのもとになる良質なたんぱく質を手軽に補えます。' },
      { name: 'ビタミンB1・B2', benefit: '食事からエネルギーをつくる働きをサポートします。' },
      { name: 'カリウム・食物繊維', benefit: '体のめぐりとお腹の調子を整えます。' },
    ],
    recommendedDishes: [
      'さやごとグリルで焼きそら豆',
      'そら豆とエビのガーリックソテー',
      'そら豆とベーコンのチーズパスタ',
    ],
    aliases: ['そら豆', 'そらまめ', 'ソラマメ', '空豆', '蚕豆'],
  },
  {
    id: 'green_bean',
    number: 38,
    name: 'さやいんげん',
    category: '豆・その他',
    season: '6月〜9月（夏・通年流通）',
    shortNote: '彩りのきれいな細長い豆野菜。胡麻和えや肉巻き、炒め物のアクセントに大活躍します。',
    nutrients: [
      { name: 'β-カロテン', benefit: '皮膚や粘膜の健康維持を助ける緑の栄養素です。' },
      { name: 'ビタミンC', benefit: '日々の元気とお肌の調子をサポートします。' },
      { name: '食物繊維・葉酸', benefit: 'お腹の調子と体のめぐりを応援します。' },
    ],
    recommendedDishes: [
      'さやいんげんの胡麻和え',
      'いんげんと豚バラの甘辛肉巻き',
      'いんげんとベーコンのペペロンチーノ炒め',
    ],
    aliases: ['さやいんげん', 'サヤインゲン', 'いんげん', 'インゲン', 'いんげん豆', 'インゲン豆', '三度豆'],
  },
  {
    id: 'snow_pea',
    number: 39,
    name: '絹さや',
    category: '豆・その他',
    season: '3月〜6月（春〜初夏）',
    shortNote: '平たいさやを丸ごと味わう上品な甘みの春野菜。お味噌汁や卵とじの彩りに重宝します。',
    nutrients: [
      { name: 'β-カロテン', benefit: '緑黄色野菜のひとつで、粘膜や肌の健康を保つとされます。' },
      { name: 'ビタミンC', benefit: 'さっと火を通すだけで摂りやすく、体調管理を助けます。' },
      { name: '葉酸', benefit: '健やかな体づくりを支える大切なビタミンです。' },
    ],
    recommendedDishes: [
      '絹さやと新玉ねぎのお味噌汁',
      '絹さやと卵のふんわり炒め',
      'ちらし寿司や煮物の彩りトッピング',
    ],
    aliases: ['絹さや', 'きぬさや', 'キヌサヤ', 'さやえんどう', 'サヤエンドウ', '絹さやえんどう'],
  },
  {
    id: 'green_peas',
    number: 40,
    name: 'グリーンピース',
    category: '豆・その他',
    season: '4月〜6月（春〜初夏・冷凍で通年）',
    shortNote: 'コロコロかわいい緑のえんどう豆。豆ご飯やオムライス、シチューの彩りにぴったりです。',
    nutrients: [
      { name: '食物繊維', benefit: '豆類ならではの豊富な食物繊維でお腹スッキリを応援します。' },
      { name: 'ビタミンB1', benefit: '糖質をエネルギーに変えるのを助け、毎日の活力を支えます。' },
      { name: '植物性たんぱく質・葉酸', benefit: '体づくりや健やかなめぐりに役立ちます。' },
    ],
    recommendedDishes: [
      '旬のほくほく豆ご飯',
      'グリーンピースの濃厚ポタージュ',
      'エビとグリーンピースのオムライス・ピラフ',
    ],
    aliases: ['グリーンピース', 'グリンピース', 'ぐりーんぴーす', '実えんどう', 'えんどう豆'],
  },
  {
    id: 'shiso',
    number: 41,
    name: '大葉',
    category: '葉物・茎',
    season: '6月〜9月（夏・通年流通）',
    shortNote: 'さわやかな香りで和食にもパスタにも大活躍。実は緑黄色野菜トップクラスの栄養を誇ります。',
    nutrients: [
      { name: 'β-カロテン', benefit: '驚くほど豊富に含まれ、皮膚や粘膜の健康維持に働きます。' },
      { name: 'カルシウム・鉄分', benefit: '少し添えるだけでもミネラル補給のきっかけになります。' },
      { name: 'ロズマリン酸・ペリルアルデヒド', benefit: '香り成分とポリフェノールがすっきりとした食後感を助けます。' },
    ],
    recommendedDishes: [
      '豚肉の大葉チーズ巻き',
      'しらすと大葉の和風パスタ',
      '大葉たっぷり混ぜご飯・冷ややっこ',
    ],
    aliases: ['大葉', 'おおば', 'オオバ', '青じそ', '青ジソ', '青紫蘇', 'しそ', 'シソ', '紫蘇', '赤しそ', '赤ジソ'],
  },
  {
    id: 'garlic',
    number: 42,
    name: 'にんにく',
    category: '根菜',
    season: '5月〜7月（新にんにく・通年）',
    shortNote: '食欲をそそる香ばしい香味野菜。料理の香りづけやスタミナメニューに欠かせません。',
    nutrients: [
      { name: 'アリシン', benefit: 'ビタミンB1と結びついてエネルギー代謝を助け、元気に働くとされます。' },
      { name: 'ビタミンB6', benefit: 'たんぱく質の代謝やコンディション維持に関わるビタミンです。' },
      { name: 'カリウム', benefit: '体のめぐりや水分バランスをサポートします。' },
    ],
    recommendedDishes: [
      'ガーリックシュリンプ（えびのにんにく炒め）',
      'シンプルで香ばしいペペロンチーノ',
      'ホイル焼きにんにく（ほくほく味噌添え）',
    ],
    aliases: ['にんにく', 'ニンニク', '大蒜', 'ガーリック', 'おろしにんにく'],
  },
  {
    id: 'ginger',
    number: 43,
    name: 'しょうが',
    category: '根菜',
    season: '6月〜8月（新生姜）・9月〜11月（根生姜）',
    shortNote: 'ピリッとした辛みと香りが料理を引き締める香味野菜。体をぽかぽか温める食材として親しまれています。',
    nutrients: [
      { name: 'ジンゲロール・ショウガオール', benefit: '辛味と香りの成分で、体の巡りやポカポカ感を応援するとされます。' },
      { name: 'カリウム', benefit: '体内の水分バランスを整えるのを助けます。' },
      { name: '食物繊維', benefit: '料理に添えることで健やかな食生活をサポートします。' },
    ],
    recommendedDishes: [
      '定番の豚のしょうが焼き',
      'たっぷり千切りしょうがの炊き込みご飯',
      '鶏団子としょうがのあったかスープ',
    ],
    aliases: ['しょうが', 'ショウガ', '生姜', '新生姜', 'おろししょうが', 'おろし生姜', '紅しょうが', '紅生姜', 'ジンジャー'],
  },
  {
    id: 'myoga',
    number: 44,
    name: 'みょうが',
    category: '葉物・茎',
    season: '6月〜10月（夏〜秋）',
    shortNote: 'シャキッとした歯ざわりと独特の清涼感が魅力の薬味野菜。そうめんや冷ややっこに相性抜群です。',
    nutrients: [
      { name: 'α-ピネン（香り成分）', benefit: 'さわやかな香りで気分をリフレッシュし、食欲を支えます。' },
      { name: 'カリウム', benefit: '夏場の水分バランスや塩分調整をやさしく助けます。' },
      { name: 'アントシアニン・食物繊維', benefit: '皮の赤紫色に含まれるポリフェノールと繊維質が健康を支えます。' },
    ],
    recommendedDishes: [
      'みょうがときゅうりの梅おかか和え',
      'みょうがの甘酢漬け',
      '薬味たっぷり冷やしうどん・そうめん',
    ],
    aliases: ['みょうが', 'ミョウガ', '茗荷'],
  },
  {
    id: 'mitsuba',
    number: 45,
    name: '三つ葉',
    category: '葉物・茎',
    season: '3月〜5月（春・通年水耕栽培）',
    shortNote: '親子丼やお吸い物にふわっと香る和のハーブ。少量でもβ-カロテンが含まれています。',
    nutrients: [
      { name: 'β-カロテン', benefit: '緑の葉に含まれ、皮膚や粘膜の健やかさを保つとされます。' },
      { name: 'カリウム', benefit: '体内の余分な塩分バランスを整えるサポートをします。' },
      { name: 'クリプトテーネン（香り成分）', benefit: '上品な和の香りで食事の満足感を高めてくれます。' },
    ],
    recommendedDishes: [
      '三つ葉のせふわとろ親子丼',
      '三つ葉と油揚げの卵とじ・お吸い物',
      '三つ葉とささみのわさび醤油和え',
    ],
    aliases: ['三つ葉', 'みつば', 'ミツバ', '糸三つ葉', '切り三つ葉', '根三つ葉'],
  },
  {
    id: 'parsley',
    number: 46,
    name: 'パセリ',
    category: '葉物・茎',
    season: '3月〜5月・9月〜11月（通年流通）',
    shortNote: '添え物と思われがちですが、実はビタミンや鉄分がぎゅっと詰まった栄養の宝庫です。',
    nutrients: [
      { name: 'ビタミンC', benefit: '野菜の中でもトップクラスの含有量で、美容と元気をサポートします。' },
      { name: 'β-カロテン', benefit: '豊富なカロテンが皮膚や粘膜の健康維持に働きます。' },
      { name: '鉄分・葉酸', benefit: '健やかなめぐりを支える栄養素もしっかり含まれています。' },
    ],
    recommendedDishes: [
      '刻みパセリたっぷりのガーリックバターライス',
      'イタリアンパセリとあさりのボンゴレ',
      'パセリとトマトのタブレ風サラダ',
    ],
    aliases: ['パセリ', 'ぱせり', 'イタリアンパセリ'],
  },
  {
    id: 'rapeseed_blossom',
    number: 47,
    name: '菜の花',
    category: '葉物・茎',
    season: '2月〜4月（早春〜春）',
    shortNote: '春を告げるほろ苦い花野菜。ビタミンCやβ-カロテン、葉酸などがバランスよく詰まっています。',
    nutrients: [
      { name: 'ビタミンC', benefit: '春先のコンディション維持や肌の調子を整えるサポートをします。' },
      { name: 'β-カロテン', benefit: '緑のつぼみや葉に豊富で、皮膚や粘膜の健康を保ちます。' },
      { name: '葉酸・鉄分', benefit: '健やかな体づくりや血のめぐりを応援する栄養素です。' },
    ],
    recommendedDishes: [
      '菜の花の辛子和え・胡麻和え',
      '菜の花とあさりの春パスタ',
      '菜の花とベーコンのガーリックソテー',
    ],
    aliases: ['菜の花', 'なのはな', 'ナノハナ', 'なばな', '菜花', 'なの花'],
  },
];

export const CATALOG_BY_ID: Record<string, VegetableCatalogEntry> = Object.fromEntries(
  VEGETABLE_CATALOG.map((entry) => [entry.id, entry]),
);

function toHiragana(text: string): string {
  return text.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );
}

export function cleanVariantText(rawName: string): string {
  return rawName
    .trim()
    .replace(/[（(].*?[)）]/g, '')
    .replace(/[・／/\s]+/g, '')
    .toLowerCase();
}

const ALIAS_LOOKUP: Array<{ key: string; hiraKey: string; entry: VegetableCatalogEntry }> = [];
for (const entry of VEGETABLE_CATALOG) {
  const names = [entry.name, ...entry.aliases];
  for (const n of names) {
    const key = cleanVariantText(n);
    if (key) {
      ALIAS_LOOKUP.push({
        key,
        hiraKey: toHiragana(key),
        entry,
      });
    }
  }
}
// Longer keys first so e.g. ミニトマト matches before トマト, サニーレタス before レタス
ALIAS_LOOKUP.sort((a, b) => b.key.length - a.key.length);

/**
 * 表記ゆれを吸収して野菜図鑑のマスター項目に紐づけます。
 * 該当しない場合は null を返します。
 */
export function resolveCatalogVegetable(rawName: string): VegetableCatalogEntry | null {
  const cleaned = cleanVariantText(rawName);
  if (!cleaned) return null;
  const hira = toHiragana(cleaned);

  // 1. Exact match (case / kana / parenthetical normalized)
  for (const item of ALIAS_LOOKUP) {
    if (item.key === cleaned || item.hiraKey === hira) {
      return item.entry;
    }
  }

  // 2. Substring match for compound names like "蒸しブロッコリー" or "焼きなす"
  // Avoid matching single-char aliases loosely
  for (const item of ALIAS_LOOKUP) {
    if (item.hiraKey.length >= 2 && (hira.includes(item.hiraKey) || item.hiraKey.includes(hira))) {
      if (item.entry.id === 'green_onion' && (hira.includes('たま') || hira.includes('玉'))) {
        continue;
      }
      if (item.entry.id === 'daikon' && hira.includes('切り干し')) {
        return item.entry;
      }
      if (item.entry.id === 'cabbage' && hira.includes('はくさい')) {
        continue;
      }
      if (item.entry.id === 'turnip' && hira.includes('めかぶ')) {
        continue;
      }
      return item.entry;
    }
  }

  return null;
}

/**
 * 保存・集計時に表記ゆれを統一するための標準名を返します。
 */
export function getCanonicalVegetableName(rawName: string): string {
  const matched = resolveCatalogVegetable(rawName);
  if (matched) {
    return matched.name;
  }
  return (
    rawName
      .trim()
      .replace(/[（(].*?[)）]/g, '')
      .replace(/\s+/g, ' ')
      .trim() || rawName.trim()
  );
}
