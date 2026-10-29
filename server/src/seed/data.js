// Демонстраційні дані для наповнення бази.
// Координати наближені; ціни квитків умовні й призначені лише для прикладу.
//
// photo — звідки брати фото у Wikimedia Commons (див. seed/photos.js):
//   files    — конкретні файли, перевірені вручну (беремо перший доступний)
//   category — категорія Commons, з якої обирається найкраще фото, якщо файлів немає
//   search   — пошуковий запит як останній варіант

export const categories = [
  { name: 'Гори', slug: 'mountains', icon: '⛰️' },
  { name: 'Озера й водоспади', slug: 'water', icon: '💧' },
  { name: 'Парки й каньйони', slug: 'parks', icon: '🌿' },
  { name: 'Замки й фортеці', slug: 'castles', icon: '🏰' },
  { name: 'Архітектура й храми', slug: 'architecture', icon: '🏛️' },
  { name: 'Гастрономія', slug: 'food', icon: '🍷' },
];

export const startCities = [
  { name: 'Київ', lat: 50.4501, lng: 30.5234 },
  { name: 'Львів', lat: 49.8397, lng: 24.0297 },
  { name: 'Одеса', lat: 46.4825, lng: 30.7233 },
  { name: 'Вінниця', lat: 49.2331, lng: 28.4682 },
  { name: 'Івано-Франківськ', lat: 48.9226, lng: 24.7111 },
  { name: 'Ужгород', lat: 48.6208, lng: 22.2879 },
  { name: 'Чернівці', lat: 48.2921, lng: 25.9358 },
  { name: 'Тернопіль', lat: 49.5535, lng: 25.5948 },
  { name: 'Луцьк', lat: 50.7472, lng: 25.3254 },
  { name: 'Рівне', lat: 50.6199, lng: 26.2516 },
  { name: 'Хмельницький', lat: 49.4229, lng: 26.9871 },
  { name: 'Мукачево', lat: 48.4394, lng: 22.7175 },
];

export const locations = [
  // ---------- Гори ----------
  {
    name: 'Говерла', category: 'mountains', region: 'Івано-Франківська', lat: 48.1601, lng: 24.5, visitMin: 360, ticketPrice: 0,
    description: 'Найвища вершина України (2061 м). Найпопулярніший підйом починається від бази «Заросляк», а з вершини в ясну погоду видно весь Чорногірський хребет.',
    photo: { files: ['File:Hoverla view.jpg', 'File:Hoverla1.JPG'], category: 'Category:Hoverla', keywords: ['hoverla', 'говерл'] },
  },
  {
    name: 'Піп Іван Чорногірський', category: 'mountains', region: 'Івано-Франківська', lat: 48.0468, lng: 24.6276, visitMin: 480, ticketPrice: 0,
    description: 'Вершина з руїнами міжвоєнної обсерваторії «Білий слон» — одна з найвідоміших карпатських панорам. Маршрут довгий, тож виходити варто зранку.',
    photo: { files: ['File:Стара обсерваторія Білий слон на горі Піп Іван Чорногорський.jpg'], category: 'Category:Observatory on Mount Pip Ivan', keywords: ['pip', 'піп', 'обсерват'] },
  },
  {
    name: 'Петрос', category: 'mountains', region: 'Закарпатська', lat: 48.1725, lng: 24.4206, visitMin: 360, ticketPrice: 0,
    description: 'Третя за висотою вершина Українських Карпат із характерним пірамідальним силуетом. Звідси відкривається вид на Говерлу та Свидовецький хребет.',
    photo: { files: ['File:Ukraine-Petros Mountain-7.jpg', 'File:Petros 2.jpg'], search: 'Petros mountain Chornohora', keywords: ['petros', 'петрос'] },
  },
  {
    name: 'Пікуй', category: 'mountains', region: 'Львівська', lat: 48.8292, lng: 23.0283, visitMin: 300, ticketPrice: 0,
    description: 'Найвища точка Львівщини (1408 м) на межі із Закарпаттям. Полонини на схилах і кам’яниста вершина роблять маршрут мальовничим у будь-яку пору року.',
    photo: { files: ['File:Mount Pikui as the highest mountain in Lviv Oblast.JPG', 'File:Pikuy mountain.JPG'], category: 'Category:Pikuy', keywords: ['pik', 'пікуй'] },
  },
  {
    name: 'Хом’як', category: 'mountains', region: 'Івано-Франківська', lat: 48.3497, lng: 24.48, visitMin: 240, ticketPrice: 0,
    description: 'Горганська вершина з кам’яними розсипами-ґорґанами неподалік Яремча. Порівняно короткий підйом і чудові види на Чорногору.',
    photo: { files: ['File:Homyak.JPG'], category: 'Category:Mount Khomiak', keywords: ['khom', 'homyak', 'хом'] },
  },
  {
    name: 'Драгобрат', category: 'mountains', region: 'Закарпатська', lat: 48.2508, lng: 24.2458, visitMin: 240, ticketPrice: 0,
    description: 'Найвисокогірніший курорт України на схилах Свидовця. Узимку — лижі, улітку — походи до льодовикових озер хребта.',
    photo: { files: ['File:Svydovec, Drahobrat, Gorgany.jpg'], category: 'Category:Drahobrat', keywords: ['drahobrat', 'dragobrat', 'драгобрат'] },
  },

  // ---------- Озера й водоспади ----------
  {
    name: 'Озеро Синевир', category: 'water', region: 'Закарпатська', lat: 48.6176, lng: 23.684, visitMin: 120, ticketPrice: 100,
    description: 'Найбільше гірське озеро Українських Карпат, «морське око» серед смерекового лісу. Поруч — реабілітаційний центр бурого ведмедя.',
    photo: { files: ['File:Lake Synevyr.jpg', 'File:Synevyr Lake (Oct 2018) 3.jpg'], category: 'Category:Synevyr Lake', keywords: ['synevyr', 'синевир'] },
  },
  {
    name: 'Озеро Світязь', category: 'water', region: 'Волинська', lat: 51.4995, lng: 23.853, visitMin: 240, ticketPrice: 0,
    description: 'Найглибше природне озеро України серед Шацьких озер. Чиста вода, піщані пляжі й сосновий ліс навколо.',
    photo: { files: ['File:Світязь - найглибше озеро України (58 м).jpg', 'File:Jezioro Switaź, Ukraina.JPG'], category: 'Category:Lake Svitiaz', keywords: ['svit', 'світязь', 'switaź'] },
  },
  {
    name: 'Водоспад Шипіт', category: 'water', region: 'Закарпатська', lat: 48.695, lng: 23.339, visitMin: 90, ticketPrice: 50,
    description: 'Каскадний водоспад біля села Пилипець на схилах Боржавського хребта. Найповноводніший навесні під час танення снігу.',
    photo: { files: ['File:21-224-5005 Shypit Waterfall RB 18.jpg', 'File:Ukraine-Waterfall Shypot-8.jpg'], category: 'Category:Shypit Waterfall', keywords: ['shyp', 'shypot', 'шипіт'] },
  },
  {
    name: 'Озеро Несамовите', category: 'water', region: 'Івано-Франківська', lat: 48.1219, lng: 24.5464, visitMin: 300, ticketPrice: 0,
    description: 'Високогірне озеро під горою Туркул, оповите легендами про неспокійних духів. Популярна зупинка на маршруті Чорногірським хребтом.',
    photo: { category: 'Category:Nesamovyte', search: 'Nesamovyte lake', keywords: ['nesam', 'несамов'] },
  },
  {
    name: 'Водоспад Пробій', category: 'water', region: 'Івано-Франківська', lat: 48.4458, lng: 24.5531, visitMin: 60, ticketPrice: 0,
    description: 'Водоспад на Пруті в самому Яремчі, де річка пробиває кам’яну ущелину. Поруч — сувенірний ринок і підвісний міст.',
    photo: { files: ['File:Probij-2.JPG', 'File:Probij-4.JPG'], category: 'Category:Waterfall Probii', keywords: ['probi', 'пробій'] },
  },
  {
    name: 'Манявський водоспад', category: 'water', region: 'Івано-Франківська', lat: 48.645, lng: 24.425, visitMin: 120, ticketPrice: 50,
    description: 'Один із найвищих водоспадів Карпат у Горганах. Дорогою варто зайти до Манявського скиту XVII століття.',
    photo: { files: ['File:Maniava4.JPG', 'File:Maniava3.JPG'], category: 'Category:Waterfall Maniava', keywords: ['maniav', 'манявськ'] },
  },
  {
    name: 'Джуринський водоспад', category: 'water', region: 'Тернопільська', lat: 48.815, lng: 25.6233, visitMin: 60, ticketPrice: 0,
    description: 'Найвищий рівнинний водоспад України біля руїн Червоногородського замку. Вода падає з висоти близько 16 метрів.',
    photo: { files: ['File:Dzhuryn - Waterfall Chervonohorod.jpg'], category: 'Category:Waterfall Chervonohorod', keywords: ['dzhur', 'chervonohorod', 'джурин'] },
  },
  {
    name: 'Озеро Бребенескул', category: 'water', region: 'Закарпатська', lat: 48.1003, lng: 24.5639, visitMin: 360, ticketPrice: 0,
    description: 'Найвисокогірніше озеро України біля вершини Гутин Томнатик. Вода в ньому холодна навіть улітку.',
    photo: { files: ['File:Berbeneskul.JPG'], category: 'Category:Brebeneskul Lake', keywords: ['breben', 'berben', 'бребен'] },
  },
  {
    name: 'Тузлівські лимани', category: 'water', region: 'Одеська', lat: 45.8833, lng: 30.0833, visitMin: 180, ticketPrice: 0,
    description: 'Національний природний парк на узбережжі Чорного моря: лимани, піщані коси та тисячі перелітних птахів.',
    photo: { files: ['File:Tuzl liman (3).JPG', 'File:Tuz2.JPG'], category: 'Category:Tuzly Lagoons National Nature Park', keywords: ['tuz', 'тузл'] },
  },
  {
    name: 'Затока', category: 'water', region: 'Одеська', lat: 46.07, lng: 30.464, visitMin: 240, ticketPrice: 0,
    description: 'Курортне селище на піщаній косі між Чорним морем і Дністровським лиманом. Відоме розвідним мостом і широкими пляжами.',
    photo: { category: 'Category:Zatoka', search: 'Zatoka beach Black Sea', keywords: ['zatoka', 'затока'] },
  },

  // ---------- Парки й каньйони ----------
  {
    name: 'Дендропарк «Софіївка»', category: 'parks', region: 'Черкаська', lat: 48.7633, lng: 30.2222, visitMin: 180, ticketPrice: 150,
    description: 'Пейзажний парк кінця XVIII століття з каскадами, гротами, ставками й підземною річкою Ахеронт.',
    photo: { files: ['File:Умань, Парк «Софіївка», Урочище Звіринець.jpg'], category: 'Category:Sofiivka Park', keywords: ['sofi', 'софіїв'] },
  },
  {
    name: 'Бакота', category: 'parks', region: 'Хмельницька', lat: 48.5866, lng: 26.987, visitMin: 180, ticketPrice: 0,
    description: 'Затока Дністра серед схилів національного парку «Подільські Товтри» зі скельним монастирем XII століття.',
    photo: { files: ['File:Bakota.jpg', 'File:Бакота.JPG'], category: 'Category:Bakota', keywords: ['bakota', 'бакот'] },
  },
  {
    name: 'Тунель кохання', category: 'parks', region: 'Рівненська', lat: 50.7525, lng: 26.0436, visitMin: 60, ticketPrice: 0,
    description: 'Зелений тунель із дерев уздовж залізничної колії біля Клевані, що виглядає по-різному в кожну пору року.',
    photo: { files: ['File:Tunnel of love 01.jpg', 'File:Осінь у Тунелі кохання.JPG'], category: 'Category:Tunnel of Love', keywords: ['tunnel', 'тунел', 'тоннел'] },
  },
  {
    name: 'Скелі Довбуша', category: 'parks', region: 'Івано-Франківська', lat: 49.0283, lng: 23.9058, visitMin: 120, ticketPrice: 80,
    description: 'Лабіринт пісковикових скель у лісі біля Бубнища, де, за легендою, переховувалися опришки Олекси Довбуша.',
    photo: { files: ['File:"Dovbush-rocks" 14.JPG', 'File:Поляницький регіональний парк. Скелі Довбуша.jpg'], category: 'Category:Dovbush rocks', keywords: ['dovbush', 'довбуш'] },
  },
  {
    name: 'Дендропарк «Олександрія»', category: 'parks', region: 'Київська', lat: 49.8087, lng: 30.0786, visitMin: 120, ticketPrice: 100,
    description: 'Пейзажний парк у Білій Церкві, закладений наприкінці XVIII століття: колонади, павільйони й каскади ставків.',
    photo: { files: ['File:Колонада "Луна", дендрологічний парк "Олександрія", м. Біла Церква.jpg'], category: 'Category:Oleksandria Park', keywords: ['oleksandr', 'олександр'] },
  },
  {
    name: 'Актовський каньйон', category: 'parks', region: 'Миколаївська', lat: 47.7158, lng: 31.4547, visitMin: 180, ticketPrice: 100,
    description: 'Гранітний каньйон річки Мертвовод у національному парку «Бузький Гард». Його часто називають «Долиною диявола».',
    photo: { files: ['File:Актовский каньон.jpg', 'File:Actovo canyon 001.jpg'], category: 'Category:Aktove Canyon', keywords: ['akto', 'acto', 'актов'] },
  },
  {
    name: 'Буцький каньйон', category: 'parks', region: 'Черкаська', lat: 49.0889, lng: 30.0306, visitMin: 90, ticketPrice: 0,
    description: 'Гранітні скелі й пороги річки Гірський Тікич у селищі Буки. Тут знімали сцени кількох відомих фільмів.',
    photo: { files: ['File:Buky Canyon, Ukraine.jpg', 'File:Buky Vyr.jpg'], category: 'Category:Buky Canyon', keywords: ['buky', 'буки'] },
  },
  {
    name: 'Ботанічний сад імені Гришка', category: 'parks', region: 'Київ', lat: 50.4167, lng: 30.5639, visitMin: 120, ticketPrice: 100,
    description: 'Найбільший ботанічний сад Києва на схилах над Дніпром. Навесні тут цвіте знаменитий бузковий сад.',
    photo: { files: ['File:Lilacs Gardens in Kyiv.jpg', 'File:Grishko botanical garden-2.JPG'], category: 'Category:National M. M. Hryshko botanical garden (Kyiv)', keywords: ['grishko', 'hryshko', 'lilac', 'ботсад'] },
  },

  // ---------- Замки й фортеці ----------
  {
    name: 'Кам’янець-Подільська фортеця', category: 'castles', region: 'Хмельницька', lat: 48.6735, lng: 26.5627, visitMin: 120, ticketPrice: 150,
    description: 'Одна з найвідоміших фортець Європи на скелястому острові, оточеному каньйоном річки Смотрич.',
    photo: { files: ['File:Kamianets-Podilskyi Castle P1840618.jpg', 'File:Кам\'янець-Подільська фортеця P1270708.jpg'], category: 'Category:Kamianets-Podilskyi Castle', keywords: ['kamianets', 'кам'] },
  },
  {
    name: 'Хотинська фортеця', category: 'castles', region: 'Чернівецька', lat: 48.5214, lng: 26.4986, visitMin: 90, ticketPrice: 120,
    description: 'Середньовічна фортеця на березі Дністра, місце відомої Хотинської битви 1621 року.',
    photo: { files: ['File:73-250-0001 Khotyn Fortress RB 18.jpg', 'File:Khotyn fortress 5.jpg'], category: 'Category:Khotyn Fortress', keywords: ['khotyn', 'хотин'] },
  },
  {
    name: 'Олеський замок', category: 'castles', region: 'Львівська', lat: 49.964, lng: 24.903, visitMin: 90, ticketPrice: 100,
    description: 'Замок на пагорбі серед регулярного парку, частина туристичного маршруту «Золота підкова Львівщини».',
    photo: { category: 'Category:Olesko Castle', search: 'Olesko Castle exterior', keywords: ['olesk', 'олеськ'] },
  },
  {
    name: 'Підгорецький замок', category: 'castles', region: 'Львівська', lat: 49.9439, lng: 24.9842, visitMin: 60, ticketPrice: 100,
    description: 'Палацовий замок XVII століття в стилі ренесансу з терасами, бастіонами й видом на долину.',
    photo: { files: ['File:Підгорецький замок з повітря.jpg'], category: 'Category:Pidhirtsi Castle', keywords: ['pidhirt', 'podhorce', 'підгор'] },
  },
  {
    name: 'Золочівський замок', category: 'castles', region: 'Львівська', lat: 49.8076, lng: 24.9028, visitMin: 60, ticketPrice: 100,
    description: 'Фортеця з бастіонами та унікальним Китайським палацом усередині.',
    photo: { files: ['File:Zolochiv Castle 01.jpg', 'File:Замок Золочів13.jpg'], category: 'Category:Zolochiv Castle', keywords: ['zoloch', 'золоч'] },
  },
  {
    name: 'Меджибізька фортеця', category: 'castles', region: 'Хмельницька', lat: 49.4348, lng: 27.4142, visitMin: 60, ticketPrice: 80,
    description: 'Фортеця при злитті Південного Бугу та Бужка — одна з найдавніших на Поділлі.',
    photo: { files: ['File:Medzhybizh Castle (Меджибіж).JPG', 'File:Medzhybizh-2007.jpg'], category: 'Category:Medzhybizh Castle', keywords: ['medzh', 'medzy', 'меджиб'] },
  },
  {
    name: 'Луцький замок', category: 'castles', region: 'Волинська', lat: 50.7387, lng: 25.3229, visitMin: 60, ticketPrice: 100,
    description: 'Замок Любарта — цегляна фортеця XIV століття в історичному центрі Луцька.',
    photo: { files: ['File:Lubart\'s Castle P1070989.jpg', 'File:Lutsk castle tower.jpg'], category: 'Category:Lutsk castle', keywords: ['lubart', 'lutsk', 'луцьк'] },
  },
  {
    name: 'Замок Паланок', category: 'castles', region: 'Закарпатська', lat: 48.4383, lng: 22.6858, visitMin: 90, ticketPrice: 100,
    description: 'Замок на вулканічній горі над Мукачевом із панорамою на місто й долину Латориці.',
    photo: { files: ['File:Palanok.jpg'], category: 'Category:Palanok castle', keywords: ['palanok', 'паланок'] },
  },
  {
    name: 'Свірзький замок', category: 'castles', region: 'Львівська', lat: 49.6464, lng: 24.2422, visitMin: 60, ticketPrice: 80,
    description: 'Казковий замок, що віддзеркалюється у ставку, — один із найфотогенічніших в Україні.',
    photo: { files: ['File:Swirsh Castle - panoramio.jpg'], category: 'Category:Svirzh Castle', keywords: ['svirzh', 'swirsh', 'свірж'] },
  },
  {
    name: 'Невицький замок', category: 'castles', region: 'Закарпатська', lat: 48.6919, lng: 22.4131, visitMin: 60, ticketPrice: 0,
    description: 'Руїни замку XIV століття на вулканічному пагорбі над долиною Ужа неподалік Ужгорода.',
    photo: { files: ['File:Ukraine.Nevitske.Castle01.JPG', 'File:Nevitsky Castle 11.JPG'], category: 'Category:Nevitsky Castle', keywords: ['nevit', 'невиц'] },
  },
  {
    name: 'Острозький замок', category: 'castles', region: 'Рівненська', lat: 50.3292, lng: 26.5136, visitMin: 90, ticketPrice: 60,
    description: 'Родове гніздо князів Острозьких із Вежею Мурованою та Новою вежею.',
    photo: { files: ['File:Острозький замок, колишня резиденція князів Острозьких.JPG', 'File:New Tower of the Ostroh Castle (Klymenko).jpg'], category: 'Category:Ostroh Castle', keywords: ['ostroh', 'остроз'] },
  },
  {
    name: 'Дубенський замок', category: 'castles', region: 'Рівненська', lat: 50.4161, lng: 25.7553, visitMin: 90, ticketPrice: 100,
    description: 'Бастіонний замок князів Острозьких і Любомирських із палацом та підземеллями.',
    photo: { files: ['File:Dubno castle, Rivne Oblast (3).jpg', 'File:Castle in Dubno Ukraine.jpg'], category: 'Category:Dubno Castle', keywords: ['dubno', 'дубн'] },
  },
  {
    name: 'Збаразький замок', category: 'castles', region: 'Тернопільська', lat: 49.665, lng: 25.7792, visitMin: 90, ticketPrice: 100,
    description: 'Квадратний бастіонний замок XVII століття, відомий облогою 1649 року.',
    photo: { files: ['File:61-224-0001 Zbarazh Castle RB.jpg', 'File:Збаразький замок DSC7849.jpg'], category: 'Category:Zbarazh castle', keywords: ['zbarazh', 'збараж'] },
  },
  {
    name: 'Бережанський замок', category: 'castles', region: 'Тернопільська', lat: 49.4433, lng: 24.9361, visitMin: 60, ticketPrice: 0,
    description: 'Замок Сенявських на острові серед боліт, який називали «Подільським Вавелем».',
    photo: { files: ['File:Berezhany Castle 1 RB.jpg', 'File:Berezhany Castle 9.jpg'], category: 'Category:Berezhany Castle', keywords: ['berezh', 'бережан'] },
  },
  {
    name: 'Аккерманська фортеця', category: 'castles', region: 'Одеська', lat: 46.2006, lng: 30.3497, visitMin: 120, ticketPrice: 100,
    description: 'Одна з найбільших фортець України на березі Дністровського лиману в Білгороді-Дністровському.',
    photo: { files: ['File:Akkerman-fortress-aerial-4.jpg', 'File:Akkerman fortress in Bilhorod-Dnistrovskyi, 2013.jpg'], category: 'Category:Akkerman fortress', keywords: ['akkerman', 'ackerman', 'аккерман'] },
  },
  {
    name: 'Наскельна фортеця Тустань', category: 'castles', region: 'Львівська', lat: 49.1633, lng: 23.4617, visitMin: 120, ticketPrice: 100,
    description: 'Залишки дерев’яної фортеці IX–XVI століть, вбудованої просто в скелі біля села Урич.',
    photo: { category: 'Category:Tustan', search: 'Tustan rock fortress Urych', keywords: ['tustan', 'тустан', 'urych'] },
  },
  {
    name: 'Червоногородський замок', category: 'castles', region: 'Тернопільська', lat: 48.8167, lng: 25.6208, visitMin: 60, ticketPrice: 0,
    description: 'Романтичні руїни замку в мальовничому вигині річки Джурин, поруч із водоспадом.',
    photo: { files: ['File:Chervonohorod Castle 01.jpg', 'File:Nyrkiv Castle 1 RB.jpg'], category: 'Category:Czerwonogród Castle', keywords: ['chervon', 'nyrk', 'червоног'] },
  },
  {
    name: 'Замок Радзивіллів в Олиці', category: 'castles', region: 'Волинська', lat: 50.7194, lng: 25.815, visitMin: 60, ticketPrice: 0,
    description: 'Ренесансний замок-палац XVI століття з бастіонами в смт Олика.',
    photo: { files: ['File:Olyka6.JPG'], category: 'Category:Radziwiłł Castle in Olyka', keywords: ['olyka', 'олик'] },
  },

  // ---------- Архітектура й храми ----------
  {
    name: 'Резиденція буковинських митрополитів', category: 'architecture', region: 'Чернівецька', lat: 48.2965, lng: 25.9233, visitMin: 90, ticketPrice: 100,
    description: 'Ансамбль Чернівецького університету, що поєднує візантійські й романські риси. Об’єкт Світової спадщини ЮНЕСКО.',
    photo: { files: ['File:Резиденція митрополитів Буковини і Далмації 1.jpg'], category: 'Category:Palace Residence of the Metropolitans (Chernivtsi)', keywords: ['резиденц', 'residen', 'czernowitz'] },
  },
  {
    name: 'Львівська опера', category: 'architecture', region: 'Львівська', lat: 49.844, lng: 24.0262, visitMin: 90, ticketPrice: 150,
    description: 'Оперний театр початку XX століття з пишним фасадом — одна з окрас центру Львова.',
    photo: { files: ['File:Lviv Opera House.jpg', 'File:46-101-1483 Lviv Opera SAM 7712 Panorama.jpg'], category: 'Category:Lviv Opera House', keywords: ['opera', 'опер'] },
  },
  {
    name: 'Палац у Качанівці', category: 'architecture', region: 'Чернігівська', lat: 50.7655, lng: 32.8667, visitMin: 120, ticketPrice: 100,
    description: 'Палацово-парковий ансамбль XVIII–XIX століть зі ставками та альтанками, де гостювали Шевченко й Гоголь.',
    photo: { files: ['File:Kachanovka palace.JPG'], category: 'Category:Palace in Kachanivka', keywords: ['kachan', 'качан'] },
  },
  {
    name: 'Вірменський собор і Вірменська вулиця', category: 'architecture', region: 'Львівська', lat: 49.8423, lng: 24.0325, visitMin: 60, ticketPrice: 0,
    description: 'Один із найдавніших храмів Львова та тиха бруківка старого вірменського кварталу.',
    photo: { files: ['File:Ukraine-Lviv-Armenian Church-14.jpg'], category: 'Category:Armenian Cathedral of Lviv', keywords: ['armenian', 'вірмен'] },
  },
  {
    name: 'Києво-Печерська лавра', category: 'architecture', region: 'Київ', lat: 50.4347, lng: 30.5571, visitMin: 180, ticketPrice: 200,
    description: 'Монастирський комплекс із печерами та Великою лаврською дзвіницею, об’єкт Світової спадщини ЮНЕСКО.',
    photo: { files: ['File:Kyiv Pechersk Lavra View from the Dnieper River.jpg', 'File:Kiev Pechersk Lavra (8600718511).jpg'], category: 'Category:Kyiv Pechersk Lavra', keywords: ['lavra', 'лавр'] },
  },
  {
    name: 'Софія Київська', category: 'architecture', region: 'Київ', lat: 50.4529, lng: 30.5143, visitMin: 90, ticketPrice: 150,
    description: 'Собор XI століття з давніми мозаїками та фресками, об’єкт Світової спадщини ЮНЕСКО.',
    photo: { files: ['File:80-391-0151 Kyiv St.Sophia\'s Cathedral RB 18 2 (cropped).jpg', 'File:Saint Sophia Cathedral Kiev.jpg'], search: 'Saint Sophia Cathedral Kyiv exterior', keywords: ['sophia', 'софі'] },
  },
  {
    name: 'Андріївська церква', category: 'architecture', region: 'Київ', lat: 50.4589, lng: 30.5178, visitMin: 60, ticketPrice: 100,
    description: 'Барокова церква Растреллі над Подолом, на початку знаменитого Андріївського узвозу.',
    photo: { files: ['File:Андріївська церква на світанку.jpg', 'File:St. Andrew\'s Church, Kyiv.jpg'], category: 'Category:St. Andrew\'s Church, Kyiv', keywords: ['andr', 'андріїв'] },
  },
  {
    name: 'Одеський оперний театр', category: 'architecture', region: 'Одеська', lat: 46.4853, lng: 30.7411, visitMin: 90, ticketPrice: 300,
    description: 'Один із найкрасивіших театрів Європи, збудований наприкінці XIX століття віденськими архітекторами.',
    photo: { files: ['File:Odessa Opera and Ballet Theater P1250978.jpg', 'File:Odessa Opera House.jpg'], category: 'Category:Building of the Odesa Opera Theatre', keywords: ['opera', 'опер'] },
  },
  {
    name: 'Потьомкінські сходи', category: 'architecture', region: 'Одеська', lat: 46.4886, lng: 30.7428, visitMin: 30, ticketPrice: 0,
    description: 'Монументальні сходи до моря з оптичною ілюзією: згори видно лише майданчики, знизу — лише сходинки.',
    photo: { files: ['File:Potemkin stairs, Odessa.jpg', 'File:Odessa Potemkin Stairs.jpg'], category: 'Category:Potemkin Stairs', keywords: ['potemkin', 'потьом'] },
  },
  {
    name: 'Почаївська лавра', category: 'architecture', region: 'Тернопільська', lat: 50.0058, lng: 25.5075, visitMin: 120, ticketPrice: 0,
    description: 'Монастирський ансамбль із золотими банями на пагорбі, видний за кілометри довкола.',
    photo: { files: ['File:1. Почаївська лавра.JPG'], category: 'Category:Pochayiv Lavra', keywords: ['pochay', 'почаїв'] },
  },
  {
    name: 'Церква святого Юра в Дрогобичі', category: 'architecture', region: 'Львівська', lat: 49.3517, lng: 23.5047, visitMin: 60, ticketPrice: 50,
    description: 'Дерев’яна церква XVI–XVII століть із розписами, об’єкт Світової спадщини ЮНЕСКО.',
    photo: { files: ['File:Церква святого Юра, Дрогобич.JPG', 'File:Церква святого Юра (Дрогобич), зимовий аспект.jpg'], category: 'Category:Saint George church, Drohobych', keywords: ['юра', 'george', 'drohob'] },
  },
  {
    name: 'Вишнівецький палац', category: 'architecture', region: 'Тернопільська', lat: 49.9128, lng: 25.7428, visitMin: 90, ticketPrice: 100,
    description: 'Палац Вишневецьких XVIII століття з парком над річкою Горинь.',
    photo: { files: ['File:Wisniowiec12.JPG'], category: 'Category:Vyshnivets Palace complex', keywords: ['wisniow', 'vyshniv', 'вишнів'] },
  },
  {
    name: 'Фонтан Roshen у Вінниці', category: 'architecture', region: 'Вінницька', lat: 49.2296, lng: 28.4725, visitMin: 60, ticketPrice: 0,
    description: 'Один із найбільших плавучих фонтанів Європи на Південному Бузі з вечірніми світломузичними шоу.',
    photo: { search: 'Roshen fountain Vinnytsia', keywords: ['roshen', 'фонтан', 'vinny'] },
  },

  // ---------- Гастрономія ----------
  {
    name: 'Площа Ринок і львівські кав’ярні', category: 'food', region: 'Львівська', lat: 49.8419, lng: 24.0316, visitMin: 90, ticketPrice: 0,
    description: 'Серце старого Львова: ратуша, кам’яниці та десятки кав’ярень із традиціями львівської кави.',
    photo: { files: ['File:Lviv Market Square 16.jpg'], search: 'Lviv Market Square', keywords: ['market square', 'rynok', 'ринок'] },
  },
  {
    name: 'Сироварня в Нижньому Селищі', category: 'food', region: 'Закарпатська', lat: 48.195, lng: 23.451, visitMin: 60, ticketPrice: 150,
    description: 'Гірська сироварня з екскурсією та дегустацією сирів, зроблених за швейцарськими технологіями.',
    photo: { files: ['File:N selishe.JPG'], category: 'Category:Nyzhnie Selysche', keywords: ['selish', 'selysh', 'селищ'] },
  },
  {
    name: 'Шабо: центр культури вина', category: 'food', region: 'Одеська', lat: 46.1342, lng: 30.3845, visitMin: 120, ticketPrice: 400,
    description: 'Виноробне господарство з історією від швейцарських колоністів: екскурсія підвалами та дегустація.',
    photo: { category: 'Category:Shabo Winery', search: 'Shabo winery', keywords: ['shabo', 'шабо'] },
  },
  {
    name: 'Шато Чизай', category: 'food', region: 'Закарпатська', lat: 48.205, lng: 22.644, visitMin: 120, ticketPrice: 500,
    description: 'Винний дім у Береговому зі старовинними підвалами та дегустацією закарпатських вин.',
    photo: { category: 'Category:Chateau Chizay', search: 'Berehove wine', keywords: ['chizay', 'чизай'] },
  },
  {
    name: 'Ринок Привоз', category: 'food', region: 'Одеська', lat: 46.4672, lng: 30.7319, visitMin: 90, ticketPrice: 0,
    description: 'Найвідоміший ринок Одеси: свіжа риба, фрукти й гастрономічні сувеніри в колоритній атмосфері.',
    photo: { files: ['File:Privoz market in Odessa.JPG'], category: 'Category:Pryvoz Market, Odesa', keywords: ['privoz', 'pryvoz', 'привоз'] },
  },
];
