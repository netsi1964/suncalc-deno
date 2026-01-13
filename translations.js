// i18n Translation System
const translations = {
  da: {
    title: '☀️ Sol & Måne Information 🌙',
    location: 'Placering',
    sunInfo: '☀️ Sol Information',
    sunrise: 'Solopgang',
    sunset: 'Solnedgang',
    solarNoon: 'Solens højdepunkt',
    daylight: 'Dagslys',
    daylightDiff: 'Forskel i dagslængde',
    fromShortest: 'Korteste dag',
    fromLongest: 'Længste dag',
    moonInfo: '🌙 Måne Information',
    moonrise: 'Måneopgang',
    moonset: 'Månenedgang',
    timeline: '📊 24-timers tidslinje',
    loading: 'Indlæser...',
    loadingMap: 'Indlæser kort...',
    loadingGraph: 'Indlæser graf...',
    
    // Features
    moonPhase: 'Månefase',
    goldenHour: 'Gyldne Time',
    morningGoldenHour: 'Morgen',
    eveningGoldenHour: 'Aften',
    sunElevation: 'Sol Elevation',
    compass: 'Solens Retning',
    uvIndex: 'UV-Indeks',
    
    // Tabs
    dataTab: 'Data',
    infoTab: 'Info',
    
    // Date picker
    selectDate: 'Vælg Dato',
    datePickerInfo: 'Vælg en dato for at se sol- og månetider for den specifikke dag. Du kan navigere mellem måneder og hurtigt springe til i dag.',
    
    // Timeline phases
    night: 'Nat',
    twilight: 'Tusmørke',
    daylight: 'Dagslys',
    start: 'Start',
    duration: 'Varighed',
    morning: 'Morgen',
    hourAbbr: 't',
    minuteAbbr: 'm',
    
    // Feature info
    sunInfoDesc: 'Viser vigtige soltider for din placering inklusiv solopgang, solnedgang og dagslængde. Forskellen i dagslængde sammenligner dagens længde med årets korteste dag (21. december) og længste dag (21. juni). I polarnætter eller midnatssol kan disse værdier variere ekstremt.',
    moonInfoDesc: 'Viser månens op- og nedgangstider for din placering. Månen kan være synlig både dag og nat afhængig af fasen.',
    moonPhaseDesc: 'Aktuel månefase og belysningsprocent.',
    sunElevationDesc: '24-timers diagram over solens højde.',
    goldenHourDesc: 'Bedste tider for fotografering med gyldent lys.',
    compassDesc: 'Solens position og retning.',
    uvIndexDesc: 'UV-indeks og solbeskyttelsesanbefalinger.',
    moonPhaseInfo: 'Viser den aktuelle månefase med visuel repræsentation. Månen gennemgår 8 faser fra nymåne til fuldmåne og tilbage, med en cyklus på cirka 29,5 dage.',
    goldenHourInfo: 'Den gyldne time opstår to gange dagligt - kort efter solopgang og før solnedgang. I denne tid er solen lav på horisonten og skaber blødt, varmt, diffust lys perfekt til fotografering.',
    sunElevationInfo: 'Viser solens højdevinkel over horisonten gennem hele dagen. Grafen viser hvordan solen stiger, topper ved solens højdepunkt og går ned. Højere elevation betyder mere intens sollys.',
    compassInfo: 'Viser solens azimut - kompasretningen hvorfra sollyset kommer. 0° er nord, 90° er øst, 180° er syd og 270° er vest. Pilen peger mod solens aktuelle position.',
    uvIndexInfo: 'UV-indekset estimerer intensiteten af ultraviolet stråling fra solen baseret på solens højde. Højere værdier betyder større risiko for solskader. Brug solcreme, solbriller og hat ved høje UV-niveauer.',
    
    // Moon phases
    newMoon: 'Nymåne',
    waxingCrescent: 'Tiltagende Halvmåne',
    firstQuarter: 'Første Kvarter',
    waxingGibbous: 'Tiltagende Måne',
    fullMoon: 'Fuldmåne',
    waningGibbous: 'Aftagende Måne',
    lastQuarter: 'Sidste Kvarter',
    waningCrescent: 'Aftagende Halvmåne',
    
    // Other
    illuminated: 'belyst',
    evening: 'Aften',
    morning: 'Morgen',
    azimuth: 'Azimut',
    dynamicBackground: 'Dynamisk Baggrund',
    changesWithTime: 'Ændres med tiden på dagen',
    sunBelowHorizon: 'Solen er {degrees} grader under horisonten',
    yesterday: 'i går',
    today: 'i dag',
    tomorrow: 'i morgen',
    polarNight: 'Polarnatt',
    midnightSun: 'Midnatssol',
    polarNightDesc: 'Solen står ikke op i dag',
    midnightSunDesc: 'Solen går ikke ned i dag',
    
    // UV Index levels
    low: 'Lav',
    moderate: 'Moderat',
    high: 'Høj',
    veryHigh: 'Meget høj',
    extreme: 'Ekstrem',
    noProtectionNeeded: 'Ingen beskyttelse nødvendig',
    wearSunscreen: 'Brug solcreme',
    wearSunscreenAndHat: 'Brug solcreme og hat',
    extraProtection: 'Ekstra beskyttelse krævet',
    avoidSun: 'Undgå solen mellem 10-16',
    shareButton: 'Del',
    shareTitle: 'Del denne lokation',
    linkCopied: 'Link kopieret!',
    copyFailed: 'Kopiering fejlede',
    gpsTooltip: 'Brug din enheds GPS til at finde din aktuelle placering',
    todayTooltip: 'Spring til dagens dato',
    searchTooltip: 'Søg efter en placering hvor som helst i verden',
    getMyLocation: 'Hent min lokation',
    searchLocation: 'Søg lokation',
    searchPlaceholder: 'Indtast stednavn...',
    showButton: 'Vis',
    locationNotFound: 'Lokation ikke fundet',
    locationSearchHint: 'Prøv at søge med bynavn, land eller landekode. Eksempler:\n• "København, Danmark"\n• "Paris, France"\n• "New York, USA"',
    locationSearchError: 'Fejl under søgning',
    technicalError: 'Teknisk fejl',
    gpsError: 'Kunne ikke hente GPS-position',
    daylightComparison: 'Du får i dag {diffMinutes} {moreOrLess} dagslys end den korteste dag, men i forhold til årets længste dag er dagen i dag {hoursShort} timer kortere',
    moreDaylight: 'minutter mere',
    lessDaylight: 'minutter mindre',
    
    // Calendar
    months: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
    weekdays: ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
  },
  en: {
    title: '☀️ Sun & Moon Information 🌙',
    location: 'Location',
    sunInfo: '☀️ Sun Information',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    solarNoon: 'Solar Noon',
    daylight: 'Daylight',
    daylightDiff: 'Daylight difference',
    fromShortest: 'Shortest day',
    fromLongest: 'Longest day',
    moonInfo: '🌙 Moon Information',
    moonrise: 'Moonrise',
    moonset: 'Moonset',
    timeline: '📊 24-Hour Timeline',
    loading: 'Loading...',
    loadingMap: 'Loading map...',
    loadingGraph: 'Loading graph...',
    
    // Features
    moonPhase: 'Moon Phase',
    goldenHour: 'Golden Hour',
    morningGoldenHour: 'Morning',
    eveningGoldenHour: 'Evening',
    sunElevation: 'Sun Elevation',
    compass: 'Sun Direction',
    uvIndex: 'UV Index',
    
    // Tabs
    dataTab: 'Data',
    infoTab: 'Info',
    
    // Date picker
    selectDate: 'Select Date',
    datePickerInfo: 'Choose any date to view sun and moon times for that specific day. Navigate between months or quickly jump to today.',
    
    // Timeline phases
    night: 'Night',
    twilight: 'Twilight',
    daylight: 'Daylight',
    start: 'Start',
    duration: 'Duration',
    morning: 'Morning',
    hourAbbr: 'h',
    minuteAbbr: 'm',
    
    // Feature info
    sunInfoDesc: 'Shows important sun times for your location including sunrise, sunset and daylight duration. Daylight difference compares today\'s length with the year\'s shortest day (December 21) and longest day (June 21). In polar nights or midnight sun these values can vary extremely.',
    moonInfoDesc: 'Shows moon rise and set times for your location. The moon can be visible both day and night depending on its phase.',    moonPhaseDesc: 'Current moon phase and illumination percentage.',
    sunElevationDesc: '24-hour sun elevation chart.',
    goldenHourDesc: 'Best times for photography with golden light.',
    compassDesc: 'Sun position and direction.',
    uvIndexDesc: 'UV index and sun protection recommendations.',    moonPhaseInfo: 'Shows the current lunar phase with visual representation. The moon goes through 8 phases from New Moon to Full Moon and back, cycling approximately every 29.5 days.',
    goldenHourInfo: 'The golden hour occurs twice daily - shortly after sunrise and before sunset. During this time, the sun is low on the horizon, creating soft, warm, diffused light perfect for photography.',
    sunElevationInfo: 'Displays the sun\'s altitude angle above the horizon throughout the day. The graph shows how the sun rises, peaks at solar noon, and sets. Higher elevations mean more intense sunlight.',
    compassInfo: 'Shows the sun\'s azimuth - the compass direction from which sunlight is coming. 0° is North, 90° is East, 180° is South, and 270° is West. The arrow points toward the sun\'s current position.',
    uvIndexInfo: 'The UV index estimates the intensity of ultraviolet radiation from the sun based on solar elevation. Higher values mean greater risk of sun damage. Use sunscreen, sunglasses, and a hat at high UV levels.',
    
    // Moon phases
    newMoon: 'New Moon',
    waxingCrescent: 'Waxing Crescent',
    firstQuarter: 'First Quarter',
    waxingGibbous: 'Waxing Gibbous',
    fullMoon: 'Full Moon',
    waningGibbous: 'Waning Gibbous',
    lastQuarter: 'Last Quarter',
    waningCrescent: 'Waning Crescent',
    
    // Other
    illuminated: 'illuminated',
    evening: 'Evening',
    morning: 'Morning',
    azimuth: 'Azimuth',
    dynamicBackground: 'Dynamic Background',
    changesWithTime: 'Changes with time of day',
    sunBelowHorizon: 'The sun is {degrees} degrees below the horizon',
    yesterday: 'yesterday',
    today: 'today',
    tomorrow: 'tomorrow',
    polarNight: 'Polar Night',
    midnightSun: 'Midnight Sun',
    polarNightDesc: 'The sun does not rise today',
    midnightSunDesc: 'The sun does not set today',
    
    // UV Index levels
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    veryHigh: 'Very High',
    extreme: 'Extreme',
    noProtectionNeeded: 'No protection needed',
    wearSunscreen: 'Wear sunscreen',
    wearSunscreenAndHat: 'Wear sunscreen and hat',
    extraProtection: 'Extra protection required',
    avoidSun: 'Avoid sun between 10am-4pm',
    shareButton: 'Share',
    shareTitle: 'Share this location',
    linkCopied: 'Link copied!',
    copyFailed: 'Copy failed',
    gpsTooltip: 'Use your device GPS to detect current location',
    todayTooltip: 'Jump to today\'s date',
    searchTooltip: 'Search for any location worldwide',
    getMyLocation: 'Get my location',
    searchLocation: 'Search location',
    searchPlaceholder: 'Enter place name...',
    showButton: 'Show',
    locationNotFound: 'Location not found',
    locationSearchHint: 'Try searching with city name, country or country code. Examples:\n• "Copenhagen, Denmark"\n• "Paris, France"\n• "New York, USA"',
    locationSearchError: 'Search error',
    technicalError: 'Technical error',
    gpsError: 'Could not get GPS position',
    daylightComparison: 'Today you get {diffMinutes} {moreOrLess} daylight than the shortest day, but compared to the year\'s longest day, today is {hoursShort} hours shorter',
    moreDaylight: 'minutes more',
    lessDaylight: 'minutes less',
    
    // Calendar
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  de: {
    title: '☀️ Sonnen- & Mondinformationen 🌙',
    location: 'Standort',
    sunInfo: '☀️ Sonneninformationen',
    sunrise: 'Sonnenaufgang',
    sunset: 'Sonnenuntergang',
    solarNoon: 'Sonnenhöchststand',
    daylight: 'Tageslicht',    daylightDiff: 'Tageslichtverschied',
    fromShortest: 'Kürzester Tag',
    fromLongest: 'Längster Tag',    moonInfo: '🌙 Mondinformationen',
    moonrise: 'Mondaufgang',
    moonset: 'Monduntergang',
    timeline: '📊 24-Stunden-Zeitleiste',
    loading: 'Wird geladen...',
    loadingMap: 'Karte wird geladen...',
    loadingGraph: 'Grafik wird geladen...',
    
    // Features
    moonPhase: 'Mondphase',
    goldenHour: 'Goldene Stunde',
    morningGoldenHour: 'Morgen',
    eveningGoldenHour: 'Abend',
    sunElevation: 'Sonnenhöhe',
    compass: 'Sonnenrichtung',
    uvIndex: 'UV-Index',
    
    // Tabs
    dataTab: 'Daten',
    infoTab: 'Info',
    
    // Date picker
    selectDate: 'Datum auswählen',
    datePickerInfo: 'Wählen Sie ein Datum, um Sonnen- und Mondzeiten für diesen bestimmten Tag anzuzeigen. Navigieren Sie zwischen Monaten oder springen Sie schnell zu heute.',
    
    // Timeline phases
    night: 'Nacht',
    twilight: 'Dämmerung',
    daylight: 'Tageslicht',
    start: 'Start',
    duration: 'Dauer',
    morning: 'Morgen',
    hourAbbr: 'Std',
    minuteAbbr: 'Min',
    
    // Feature info
    sunInfoDesc: 'Zeigt wichtige Sonnenzeiten für Ihren Standort einschließlich Sonnenaufgang, Sonnenuntergang und Tageslänge. Der Tageslichtverschied vergleicht die heutige Länge mit dem kürzesten Tag des Jahres (21. Dezember) und dem längsten Tag (21. Juni). In Polarnächten oder Mitternachtssonne können diese Werte extrem variieren.',
    moonInfoDesc: 'Zeigt Mondauf- und -untergangszeiten für Ihren Standort. Der Mond kann je nach Phase sowohl Tag als auch Nacht sichtbar sein.',    moonPhaseDesc: 'Aktuelle Mondphase und Beleuchtungsprozentsatz.',
    sunElevationDesc: '24-Stunden-Sonnenelationsdiagramm.',
    goldenHourDesc: 'Beste Zeiten zum Fotografieren mit goldenem Licht.',
    compassDesc: 'Sonnenposition und -richtung.',
    uvIndexDesc: 'UV-Index und Sonnenschutzempfehlungen.',    moonPhaseInfo: 'Zeigt die aktuelle Mondphase mit visueller Darstellung. Der Mond durchläuft 8 Phasen vom Neumond zum Vollmond und zurück, in einem Zyklus von etwa 29,5 Tagen.',
    goldenHourInfo: 'Die goldene Stunde tritt zweimal täglich auf - kurz nach Sonnenaufgang und vor Sonnenuntergang. Während dieser Zeit steht die Sonne tief am Horizont und erzeugt weiches, warmes, diffuses Licht, perfekt für die Fotografie.',
    sunElevationInfo: 'Zeigt den Höhenwinkel der Sonne über dem Horizont im Tagesverlauf. Die Grafik zeigt, wie die Sonne aufgeht, mittags ihren Höchststand erreicht und untergeht. Höhere Elevationen bedeuten intensiveres Sonnenlicht.',
    compassInfo: 'Zeigt den Azimut der Sonne - die Himmelsrichtung, aus der das Sonnenlicht kommt. 0° ist Norden, 90° ist Osten, 180° ist Süden und 270° ist Westen. Der Pfeil zeigt zur aktuellen Position der Sonne.',
    uvIndexInfo: 'Der UV-Index schätzt die Intensität der ultravioletten Strahlung der Sonne basierend auf der Sonnenhöhe. Höhere Werte bedeuten größeres Risiko für Sonnenschäden. Verwenden Sie Sonnencreme, Sonnenbrille und Hut bei hohen UV-Werten.',
    
    // Moon phases
    newMoon: 'Neumond',
    waxingCrescent: 'Zunehmende Sichel',
    firstQuarter: 'Erstes Viertel',
    waxingGibbous: 'Zunehmender Mond',
    fullMoon: 'Vollmond',
    waningGibbous: 'Abnehmender Mond',
    lastQuarter: 'Letztes Viertel',
    waningCrescent: 'Abnehmende Sichel',
    
    // Other
    illuminated: 'beleuchtet',
    evening: 'Abend',
    morning: 'Morgen',
    azimuth: 'Azimut',
    dynamicBackground: 'Dynamischer Hintergrund',
    changesWithTime: 'Ändert sich mit der Tageszeit',
    sunBelowHorizon: 'Die Sonne ist {degrees} Grad unter dem Horizont',
    yesterday: 'gestern',
    today: 'heute',
    tomorrow: 'morgen',
    polarNight: 'Polarnacht',
    midnightSun: 'Mitternachtssonne',
    polarNightDesc: 'Die Sonne geht heute nicht auf',
    midnightSunDesc: 'Die Sonne geht heute nicht unter',
    
    // UV Index levels
    low: 'Niedrig',
    moderate: 'Mäßig',
    high: 'Hoch',
    veryHigh: 'Sehr hoch',
    extreme: 'Extrem',
    noProtectionNeeded: 'Kein Schutz erforderlich',
    wearSunscreen: 'Sonnencreme verwenden',
    wearSunscreenAndHat: 'Sonnencreme und Hut verwenden',
    extraProtection: 'Extra Schutz erforderlich',
    avoidSun: 'Sonne zwischen 10-16 Uhr meiden',
    shareButton: 'Teilen',
    shareTitle: 'Diesen Standort teilen',
    linkCopied: 'Link kopiert!',
    copyFailed: 'Kopieren fehlgeschlagen',
    gpsTooltip: 'Verwenden Sie das GPS Ihres Geräts, um Ihren aktuellen Standort zu ermitteln',
    todayTooltip: 'Zum heutigen Datum springen',
    searchTooltip: 'Suchen Sie nach einem beliebigen Standort weltweit',
    getMyLocation: 'Meinen Standort abrufen',
    searchLocation: 'Standort suchen',
    searchPlaceholder: 'Ortsnamen eingeben...',
    showButton: 'Anzeigen',
    locationNotFound: 'Standort nicht gefunden',
    locationSearchHint: 'Versuchen Sie die Suche mit Stadtname, Land oder Ländercode. Beispiele:\n• "Kopenhagen, Dänemark"\n• "Paris, Frankreich"\n• "New York, USA"',
    locationSearchError: 'Suchfehler',
    technicalError: 'Technischer Fehler',
    gpsError: 'GPS-Position konnte nicht abgerufen werden',
    daylightComparison: 'Heute bekommen Sie {diffMinutes} {moreOrLess} Tageslicht als am kürzesten Tag, aber im Vergleich zum längsten Tag des Jahres ist der heutige Tag {hoursShort} Stunden kürzer',
    moreDaylight: 'Minuten mehr',
    lessDaylight: 'Minuten weniger',
    
    // Calendar
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  },
  zh: {
    title: '☀️ 太阳和月亮信息 🌙',
    location: '位置',
    sunInfo: '☀️ 太阳信息',
    sunrise: '日出',
    sunset: '日落',
    solarNoon: '正午',
    daylight: '日照',
    daylightDiff: '日照时长差异',
    fromShortest: '最短日',
    fromLongest: '最长日',
    moonInfo: '🌙 月亮信息',
    moonrise: '月出',
    moonset: '月落',
    timeline: '📊 24小时时间线',
    loading: '加载中...',
    loadingMap: '加载地图中...',
    loadingGraph: '加载图表中...',
    
    // Features
    moonPhase: '月相',
    goldenHour: '黄金时刻',
    morningGoldenHour: '早晨',
    eveningGoldenHour: '傍晚',
    sunElevation: '太阳高度',
    compass: '太阳方向',
    skyGradient: '天空渐变',
    
    // Tabs
    dataTab: '数据',
    infoTab: '信息',
    
    // Date picker
    selectDate: '选择日期',
    datePickerInfo: '选择任何日期以查看该特定日期的日出日落和月出月落时间。在月份之间导航或快速跳转到今天。',
    
    // Timeline phases
    night: '夜晚',
    twilight: '黄昏',
    daylight: '白天',    start: '开始',
    duration: '持续时间',
    morning: '早晨',    
    hourAbbr: '小时',
    minuteAbbr: '分钟',
    
    // Feature info
    sunInfoDesc: '显示您所在位置的重要日出日落时间，包括白昼时长。日照时长差异将今天的长度与一年中最短的一天（12月21日）和最长的一天（6月21日）进行比较。在极夜或极昼期间，这些值可能会极端变化。',
    moonInfoDesc: '显示您所在位置的月出月落时间。月亮根据其相位可在白天或夜晚可见。',
    moonPhaseDesc: '当前月相和照明百分比。',
    sunElevationDesc: '24小时太阳高度图。',
    goldenHourDesc: '金色时光摄影的最佳时间。',
    compassDesc: '太阳位置和方向。',
    uvIndexDesc: '紫外线指数和防晒建议。',
    uvIndexInfo: '紫外线指数根据太阳高度估算来自太阳的紫外线辐射强度。数值越高，表示晒伤风险越大。在高紫外线水平时使用防晒霜、太阳镜和帽子。',
    moonPhaseInfo: '显示当前月相的视觉表示。月球经历从新月到满月再返回的8个阶段，周期约为29.5天。',
    goldenHourInfo: '黄金时刻每天出现两次 - 日出后不久和日落前。在此期间，太阳低垂于地平线上，创造出柔和、温暖、漫射的光线，非常适合摄影。',
    sunElevationInfo: '显示太阳在一天中相对于地平线的高度角。图表显示太阳如何升起、在正午达到峰值并落下。更高的高度意味着更强烈的阳光。',
    compassInfo: '显示太阳的方位角 - 阳光来自的罗盘方向。0°是北，90°是东，180°是南，270°是西。箭头指向太阳的当前位置。',
    skyGradientInfo: '背景颜色会根据一天中的时间自动调整，在深夜、黎明、早晨、白天、傍晚、黄昏和夜晚之间过渡。这创造了与实际天空状况相匹配的沉浸式体验。',
    
    // Moon phases
    newMoon: '新月',
    waxingCrescent: '娥眉月',
    firstQuarter: '上弦月',
    waxingGibbous: '盈凸月',
    fullMoon: '满月',
    waningGibbous: '亏凸月',
    lastQuarter: '下弦月',
    waningCrescent: '残月',
    
    // Other
    illuminated: '照明',
    evening: '傍晚',
    morning: '早晨',
    azimuth: '方位角',
    dynamicBackground: '动态背景',
    changesWithTime: '随时间变化',
    sunBelowHorizon: '太阳在地平线以下 {degrees} 度',
    yesterday: '昨天',
    today: '今天',
    tomorrow: '明天',
    polarNight: '极夜',
    midnightSun: '极昼',
    polarNightDesc: '今天太阳不会升起',
    midnightSunDesc: '今天太阳不会落下',
    low: '低',
    moderate: '中等',
    high: '高',
    veryHigh: '很高',
    extreme: '极端',
    noProtectionNeeded: '无需防护',
    wearSunscreen: '使用防晒霜',
    wearSunscreenAndHat: '使用防晒霜和帽子',
    extraProtection: '需要额外防护',
    avoidSun: '避免10-16点的阳光',
    shareButton: '分享',
    shareTitle: '分享此位置',
    linkCopied: '链接已复制！',
    copyFailed: '复制失败',
    gpsTooltip: '使用您的设备GPS检测当前位置',
    todayTooltip: '跳转到今天的日期',
    searchTooltip: '搜索世界上任何位置',
    getMyLocation: '获取我的位置',
    searchLocation: '搜索位置',
    searchPlaceholder: '输入地名...',
    showButton: '显示',
    locationNotFound: '找不到位置',
    locationSearchHint: '尝试使用城市名称、国家或国家代码搜索。示例：\n• "哥本哈根，丹麦"\n• "巴黎，法国"\n• "纽约，美国"',
    locationSearchError: '搜索错误',
    technicalError: '技术错误',
    gpsError: '无法获取GPS位置',
    daylightComparison: '今天您比最短的一天获得{diffMinutes} {moreOrLess}日照时间，但与一年中最长的一天相比，今天要短{hoursShort}小时',
    moreDaylight: '分钟更多',
    lessDaylight: '分钟更少',
    
    // Calendar
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  es: {
    title: '☀️ Información del Sol y la Luna 🌙',
    location: 'Ubicación',
    sunInfo: '☀️ Información del Sol',
    sunrise: 'Amanecer',
    sunset: 'Atardecer',
    solarNoon: 'Mediodía solar',
    daylight: 'Luz del día',    daylightDiff: 'Diferencia de luz diurna',
    fromShortest: 'Día más corto',
    fromLongest: 'Día más largo',    moonInfo: '🌙 Información de la Luna',
    moonrise: 'Salida de la luna',
    moonset: 'Puesta de la luna',
    timeline: '📊 Línea de tiempo de 24 horas',
    loading: 'Cargando...',
    loadingMap: 'Cargando mapa...',
    loadingGraph: 'Cargando gráfico...',
    moonPhase: 'Fase lunar',
    goldenHour: 'Hora dorada',
    morningGoldenHour: 'Mañana',
    eveningGoldenHour: 'Tarde',
    sunElevation: 'Elevación solar',
    compass: 'Dirección del sol',
    uvIndex: 'Índice UV',
    
    // Tabs
    dataTab: 'Datos',
    infoTab: 'Info',
    
    // Date picker
    selectDate: 'Seleccionar Fecha',
    datePickerInfo: 'Elija cualquier fecha para ver los horarios del sol y la luna para ese día específico. Navegue entre meses o salte rápidamente a hoy.',
    
    // Timeline phases
    night: 'Noche',
    twilight: 'Crepúsculo',
    daylight: 'Luz del día',
    start: 'Inicio',
    duration: 'Duración',
    morning: 'Mañana',
    hourAbbr: 'h',
    minuteAbbr: 'min',
    
    // Feature info
    sunInfoDesc: 'Muestra los horarios importantes del sol para su ubicación, incluyendo amanecer, atardecer y duración del día. La diferencia de luz diurna compara la duración de hoy con el día más corto del año (21 de diciembre) y el día más largo (21 de junio). En noches polares o sol de medianoche estos valores pueden variar extremadamente.',
    moonInfoDesc: 'Muestra los horarios de salida y puesta de la luna para su ubicación. La luna puede ser visible tanto de día como de noche dependiendo de su fase.',    moonPhaseDesc: 'Fase lunar actual y porcentaje de iluminación.',
    sunElevationDesc: 'Gráfico de elevación solar de 24 horas.',
    goldenHourDesc: 'Mejores momentos para fotografía con luz dorada.',
    compassDesc: 'Posición y dirección del sol.',
    uvIndexDesc: 'Índice UV y recomendaciones de protección solar.',    moonPhaseInfo: 'Muestra la fase lunar actual con representación visual. La Luna pasa por 8 fases desde luna nueva hasta luna llena y viceversa, con un ciclo de aproximadamente 29,5 días.',
    goldenHourInfo: 'La hora dorada ocurre dos veces al día - poco después del amanecer y antes del atardecer. Durante este tiempo, el sol está bajo en el horizonte y crea luz suave, cálida y difusa perfecta para fotografía.',
    sunElevationInfo: 'Muestra el ángulo de elevación del sol sobre el horizonte durante todo el día. El gráfico muestra cómo el sol sube, alcanza su punto máximo al mediodía solar y desciende. Una mayor elevación significa luz solar más intensa.',
    compassInfo: 'Muestra el azimut del sol - la dirección de la brújula desde donde proviene la luz solar. 0° es norte, 90° es este, 180° es sur y 270° es oeste. La flecha apunta hacia la posición actual del sol.',
    uvIndexInfo: 'El índice UV estima la intensidad de la radiación ultravioleta del sol según la altura del sol. Valores más altos significan mayor riesgo de daño solar. Use protector solar, gafas de sol y sombrero con niveles UV altos.',
    newMoon: 'Luna nueva',
    waxingCrescent: 'Creciente',
    firstQuarter: 'Cuarto creciente',
    waxingGibbous: 'Gibosa creciente',
    fullMoon: 'Luna llena',
    waningGibbous: 'Gibosa menguante',
    lastQuarter: 'Cuarto menguante',
    waningCrescent: 'Menguante',
    illuminated: 'iluminada',
    evening: 'Tarde',
    morning: 'Mañana',
    azimuth: 'Azimut',
    dynamicBackground: 'Fondo dinámico',
    changesWithTime: 'Cambia con la hora del día',
    sunBelowHorizon: 'El sol está {degrees} grados bajo el horizonte',
    yesterday: 'ayer',
    today: 'hoy',
    tomorrow: 'mañana',
    polarNight: 'Noche polar',
    midnightSun: 'Sol de medianoche',
    polarNightDesc: 'El sol no sale hoy',
    midnightSunDesc: 'El sol no se pone hoy',
    low: 'Bajo',
    moderate: 'Moderado',
    high: 'Alto',
    veryHigh: 'Muy alto',
    extreme: 'Extremo',
    noProtectionNeeded: 'No se necesita protección',
    wearSunscreen: 'Use protector solar',
    wearSunscreenAndHat: 'Use protector solar y sombrero',
    extraProtection: 'Se requiere protección extra',
    avoidSun: 'Evite el sol entre 10-16h',
    shareButton: 'Compartir',
    shareTitle: 'Compartir esta ubicación',
    linkCopied: '¡Enlace copiado!',
    copyFailed: 'Copia fallida',
    gpsTooltip: 'Use el GPS de su dispositivo para detectar la ubicación actual',
    todayTooltip: 'Saltar a la fecha de hoy',
    searchTooltip: 'Buscar cualquier ubicación en todo el mundo',
    getMyLocation: 'Obtener mi ubicación',
    searchLocation: 'Buscar ubicación',
    searchPlaceholder: 'Introducir nombre del lugar...',
    showButton: 'Mostrar',
    locationNotFound: 'Ubicación no encontrada',
    locationSearchHint: 'Intente buscar con nombre de ciudad, país o código de país. Ejemplos:\n• "Copenhague, Dinamarca"\n• "París, Francia"\n• "Nueva York, EE.UU."',
    locationSearchError: 'Error de búsqueda',
    technicalError: 'Error técnico',
    gpsError: 'No se pudo obtener la posición GPS',
    daylightComparison: 'Hoy recibe {diffMinutes} {moreOrLess} luz del día que el día más corto, pero en comparación con el día más largo del año, hoy es {hoursShort} horas más corto',
    moreDaylight: 'minutos más',
    lessDaylight: 'minutos menos',
    
    // Calendar
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  }
};

// Global translation function
window.t = (key, lang = 'en') => {
  const locale = window.currentLanguage || lang;
  return translations[locale]?.[key] || translations['en'][key] || key;
};

// Detect browser/system language
function detectLanguage() {
  // Check localStorage first (user preference)
  const savedLang = localStorage.getItem('language');
  if (savedLang && translations[savedLang]) {
    return savedLang;
  }
  
  // Detect from browser/system
  const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];
  
  // Map of language codes to our supported languages
  const supportedLangs = {
    'da': 'da',      // Danish
    'da-DK': 'da',
    'en': 'en',      // English
    'en-US': 'en',
    'en-GB': 'en',
    'de': 'de',      // German
    'de-DE': 'de',
    'de-AT': 'de',
    'de-CH': 'de',
    'zh': 'zh',      // Chinese
    'zh-CN': 'zh',
    'zh-TW': 'zh',
    'zh-HK': 'zh'
  };
  
  // Try to find a match in browser languages
  for (const browserLang of browserLangs) {
    // Try exact match first
    if (supportedLangs[browserLang]) {
      return supportedLangs[browserLang];
    }
    // Try language code without region (e.g., 'da' from 'da-DK')
    const langCode = browserLang.split('-')[0];
    if (supportedLangs[langCode]) {
      return supportedLangs[langCode];
    }
  }
  
  // Default to English
  return 'en';
}

// Set default language with auto-detection
window.currentLanguage = detectLanguage();

// Language change event
window.setLanguage = (lang) => {
  window.currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Update URL with new language
  const component = document.querySelector('sun-moon-info');
  if (component && component.updateURL) {
    component.updateURL();
  }
  
  // Dispatch custom event for components to update
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
};
