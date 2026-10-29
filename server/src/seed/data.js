// Демонстраційні дані для наповнення бази.
// Координати наближені; ціни квитків умовні й призначені лише для прикладу.

export const categories = [
  { name: 'Природа', slug: 'nature', icon: '🌲' },
  { name: 'Історія', slug: 'history', icon: '🏰' },
  { name: 'Архітектура', slug: 'architecture', icon: '🏛️' },
  { name: 'Гастрономія', slug: 'food', icon: '🧀' },
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
];

// category — slug з масиву categories
export const locations = [
  { name: 'Говерла', category: 'nature', region: 'Івано-Франківська', lat: 48.1601, lng: 24.5, visitMin: 360, ticketPrice: 0,
    description: 'Найвища вершина України (2061 м). Популярний маршрут починається від бази «Заросляк».' },
  { name: 'Озеро Синевир', category: 'nature', region: 'Закарпатська', lat: 48.6176, lng: 23.684, visitMin: 120, ticketPrice: 100,
    description: 'Найбільше гірське озеро Українських Карпат, оточене смерековим лісом.' },
  { name: 'Водоспад Шипіт', category: 'nature', region: 'Закарпатська', lat: 48.695, lng: 23.339, visitMin: 90, ticketPrice: 50,
    description: 'Каскадний водоспад біля села Пилипець на схилах Боржавського хребта.' },
  { name: 'Озеро Світязь', category: 'nature', region: 'Волинська', lat: 51.4995, lng: 23.853, visitMin: 240, ticketPrice: 0,
    description: 'Найглибше з Шацьких озер, відоме чистою водою та піщаними пляжами.' },
  { name: 'Дендропарк «Софіївка»', category: 'nature', region: 'Черкаська', lat: 48.7633, lng: 30.2222, visitMin: 180, ticketPrice: 150,
    description: 'Пейзажний парк кінця XVIII століття з каскадами, гротами та озерами.' },
  { name: 'Бакота', category: 'nature', region: 'Хмельницька', lat: 48.5866, lng: 26.987, visitMin: 180, ticketPrice: 0,
    description: 'Мальовничі краєвиди на Дністер і скельний монастир у національному парку «Подільські Товтри».' },
  { name: 'Тунель кохання', category: 'nature', region: 'Рівненська', lat: 50.7525, lng: 26.0436, visitMin: 60, ticketPrice: 0,
    description: 'Зелений тунель із дерев уздовж залізничної колії біля Клевані.' },

  { name: "Кам'янець-Подільська фортеця", category: 'history', region: 'Хмельницька', lat: 48.6735, lng: 26.5627, visitMin: 120, ticketPrice: 150,
    description: 'Одна з найвідоміших фортець України на скелястому каньйоні річки Смотрич.' },
  { name: 'Хотинська фортеця', category: 'history', region: 'Чернівецька', lat: 48.5214, lng: 26.4986, visitMin: 90, ticketPrice: 120,
    description: 'Середньовічна фортеця на березі Дністра, місце відомої битви 1621 року.' },
  { name: 'Олеський замок', category: 'history', region: 'Львівська', lat: 49.964, lng: 24.903, visitMin: 90, ticketPrice: 100,
    description: 'Замок на пагорбі серед парку, частина «Золотої підкови Львівщини».' },
  { name: 'Підгорецький замок', category: 'history', region: 'Львівська', lat: 49.9439, lng: 24.9842, visitMin: 60, ticketPrice: 100,
    description: 'Палацовий замок XVII століття в стилі ренесансу з терасами та парком.' },
  { name: 'Золочівський замок', category: 'history', region: 'Львівська', lat: 49.8076, lng: 24.9028, visitMin: 60, ticketPrice: 100,
    description: 'Фортеця з бастіонами та Китайським палацом усередині.' },
  { name: 'Меджибізька фортеця', category: 'history', region: 'Хмельницька', lat: 49.4348, lng: 27.4142, visitMin: 60, ticketPrice: 80,
    description: 'Фортеця при злитті Південного Бугу та Бужка, одна з найдавніших на Поділлі.' },
  { name: 'Луцький замок', category: 'history', region: 'Волинська', lat: 50.7387, lng: 25.3229, visitMin: 60, ticketPrice: 100,
    description: 'Замок Любарта — цегляна фортеця XIV століття в центрі Луцька.' },
  { name: 'Києво-Печерська лавра', category: 'history', region: 'Київ', lat: 50.4347, lng: 30.5571, visitMin: 180, ticketPrice: 200,
    description: 'Монастирський комплекс із печерами, об’єкт Світової спадщини ЮНЕСКО.' },
  { name: 'Софія Київська', category: 'history', region: 'Київ', lat: 50.4529, lng: 30.5143, visitMin: 90, ticketPrice: 150,
    description: 'Собор XI століття з давніми мозаїками та фресками, об’єкт ЮНЕСКО.' },

  { name: 'Резиденція буковинських митрополитів', category: 'architecture', region: 'Чернівецька', lat: 48.2965, lng: 25.9233, visitMin: 90, ticketPrice: 100,
    description: 'Ансамбль Чернівецького університету з поєднанням візантійських і романських рис.' },
  { name: 'Львівська опера', category: 'architecture', region: 'Львівська', lat: 49.844, lng: 24.0262, visitMin: 90, ticketPrice: 150,
    description: 'Оперний театр початку XX століття, одна з окрас центру Львова.' },
  { name: 'Палац у Качанівці', category: 'architecture', region: 'Чернігівська', lat: 50.7655, lng: 32.8667, visitMin: 120, ticketPrice: 100,
    description: 'Палацово-парковий ансамбль XVIII–XIX століть зі ставками та альтанками.' },
  { name: 'Замок Паланок', category: 'architecture', region: 'Закарпатська', lat: 48.4383, lng: 22.6858, visitMin: 90, ticketPrice: 100,
    description: 'Замок на вулканічній горі над Мукачевом з панорамою на місто.' },
  { name: 'Арсенальна площа і Вірменська вулиця', category: 'architecture', region: 'Львівська', lat: 49.8423, lng: 24.0325, visitMin: 60, ticketPrice: 0,
    description: 'Квартал старого Львова з кам’яницями, вірменським собором і бруківкою.' },

  { name: 'Львівська копальня кави', category: 'food', region: 'Львівська', lat: 49.8414, lng: 24.0322, visitMin: 60, ticketPrice: 0,
    description: 'Тематична кав’ярня біля площі Ринок із «шахтою» в підземеллі.' },
  { name: 'Сироварня в Нижньому Селищі', category: 'food', region: 'Закарпатська', lat: 48.195, lng: 23.451, visitMin: 60, ticketPrice: 150,
    description: 'Гірська сироварня з дегустацією сирів за швейцарськими технологіями.' },
  { name: 'Шабо: центр культури вина', category: 'food', region: 'Одеська', lat: 46.1342, lng: 30.3845, visitMin: 120, ticketPrice: 400,
    description: 'Виноробне господарство з екскурсією та дегустацією вин.' },
];
