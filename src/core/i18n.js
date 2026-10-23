/**
 * Words shown on the weather and glance tiles, in the languages the Studio offers.
 * Dates, times and numbers already come from Intl; this covers the fixed labels and the
 * weather conditions. Any other language falls back to English.
 *
 * Placeholders in braces are filled by `tr()`: {n}, {d}, {t}.
 */

const EN = {
  sunrise: 'Sunrise', sunset: 'Sunset', wind: 'Wind', humidity: 'Humidity', aqi: 'AQI',
  sample: 'Sample', weather: 'Weather', high: 'H', low: 'L',
  week: 'Week {n}', dayOf: 'Day {d} of {n}', weekOfYear: 'Week of the year',
  nothingElse: 'Nothing else today', allDay: 'All day', nowUntil: 'Now · until {t}',
};

const T = {
  fr: {
    sunrise: 'Lever', sunset: 'Coucher', wind: 'Vent', humidity: 'Humidité', aqi: 'IQA',
    sample: 'Exemple', weather: 'Météo', high: 'H', low: 'B',
    week: 'Semaine {n}', dayOf: 'Jour {d} sur {n}', weekOfYear: 'Semaine de l’année',
    nothingElse: 'Rien d’autre aujourd’hui', allDay: 'Toute la journée', nowUntil: 'En cours · jusqu’à {t}',
    cond: {
      'Clear': 'Dégagé', 'Mostly Clear': 'Plutôt dégagé', 'Partly Cloudy': 'Partiellement nuageux', 'Overcast': 'Couvert',
      'Fog': 'Brouillard', 'Freezing Fog': 'Brouillard givrant', 'Light Drizzle': 'Bruine légère', 'Drizzle': 'Bruine',
      'Heavy Drizzle': 'Forte bruine', 'Freezing Drizzle': 'Bruine verglaçante', 'Light Rain': 'Pluie faible', 'Rain': 'Pluie',
      'Heavy Rain': 'Forte pluie', 'Freezing Rain': 'Pluie verglaçante', 'Light Snow': 'Neige faible', 'Snow': 'Neige',
      'Heavy Snow': 'Forte neige', 'Snow Grains': 'Neige en grains', 'Showers': 'Averses', 'Heavy Showers': 'Fortes averses',
      'Snow Showers': 'Averses de neige', 'Thunderstorm': 'Orage', 'Unknown': 'Inconnu',
    },
  },
  de: {
    sunrise: 'Aufgang', sunset: 'Untergang', wind: 'Wind', humidity: 'Feuchte', aqi: 'LQI',
    sample: 'Beispiel', weather: 'Wetter', high: 'H', low: 'T',
    week: 'Woche {n}', dayOf: 'Tag {d} von {n}', weekOfYear: 'Kalenderwoche',
    nothingElse: 'Heute nichts mehr', allDay: 'Ganztägig', nowUntil: 'Jetzt · bis {t}',
    cond: {
      'Clear': 'Klar', 'Mostly Clear': 'Überwiegend klar', 'Partly Cloudy': 'Teilweise bewölkt', 'Overcast': 'Bedeckt',
      'Fog': 'Nebel', 'Freezing Fog': 'Gefrierender Nebel', 'Light Drizzle': 'Leichter Nieselregen', 'Drizzle': 'Nieselregen',
      'Heavy Drizzle': 'Starker Nieselregen', 'Freezing Drizzle': 'Gefrierender Nieselregen', 'Light Rain': 'Leichter Regen', 'Rain': 'Regen',
      'Heavy Rain': 'Starker Regen', 'Freezing Rain': 'Gefrierender Regen', 'Light Snow': 'Leichter Schneefall', 'Snow': 'Schnee',
      'Heavy Snow': 'Starker Schneefall', 'Snow Grains': 'Schneegriesel', 'Showers': 'Schauer', 'Heavy Showers': 'Starke Schauer',
      'Snow Showers': 'Schneeschauer', 'Thunderstorm': 'Gewitter', 'Unknown': 'Unbekannt',
    },
  },
  es: {
    sunrise: 'Amanecer', sunset: 'Atardecer', wind: 'Viento', humidity: 'Humedad', aqi: 'ICA',
    sample: 'Ejemplo', weather: 'Tiempo', high: 'Máx.', low: 'Mín.',
    week: 'Semana {n}', dayOf: 'Día {d} de {n}', weekOfYear: 'Semana del año',
    nothingElse: 'Nada más hoy', allDay: 'Todo el día', nowUntil: 'Ahora · hasta las {t}',
    cond: {
      'Clear': 'Despejado', 'Mostly Clear': 'Mayormente despejado', 'Partly Cloudy': 'Parcialmente nublado', 'Overcast': 'Cubierto',
      'Fog': 'Niebla', 'Freezing Fog': 'Niebla helada', 'Light Drizzle': 'Llovizna ligera', 'Drizzle': 'Llovizna',
      'Heavy Drizzle': 'Llovizna intensa', 'Freezing Drizzle': 'Llovizna helada', 'Light Rain': 'Lluvia ligera', 'Rain': 'Lluvia',
      'Heavy Rain': 'Lluvia intensa', 'Freezing Rain': 'Lluvia helada', 'Light Snow': 'Nieve ligera', 'Snow': 'Nieve',
      'Heavy Snow': 'Nevada intensa', 'Snow Grains': 'Granos de nieve', 'Showers': 'Chubascos', 'Heavy Showers': 'Chubascos fuertes',
      'Snow Showers': 'Chubascos de nieve', 'Thunderstorm': 'Tormenta', 'Unknown': 'Desconocido',
    },
  },
  it: {
    sunrise: 'Alba', sunset: 'Tramonto', wind: 'Vento', humidity: 'Umidità', aqi: 'IQA',
    sample: 'Esempio', weather: 'Meteo', high: 'Max', low: 'Min',
    week: 'Settimana {n}', dayOf: 'Giorno {d} di {n}', weekOfYear: 'Settimana dell’anno',
    nothingElse: 'Nient’altro oggi', allDay: 'Tutto il giorno', nowUntil: 'Ora · fino alle {t}',
    cond: {
      'Clear': 'Sereno', 'Mostly Clear': 'Prevalentemente sereno', 'Partly Cloudy': 'Parzialmente nuvoloso', 'Overcast': 'Coperto',
      'Fog': 'Nebbia', 'Freezing Fog': 'Nebbia gelata', 'Light Drizzle': 'Pioviggine leggera', 'Drizzle': 'Pioviggine',
      'Heavy Drizzle': 'Pioviggine intensa', 'Freezing Drizzle': 'Pioviggine gelata', 'Light Rain': 'Pioggia leggera', 'Rain': 'Pioggia',
      'Heavy Rain': 'Pioggia forte', 'Freezing Rain': 'Pioggia gelata', 'Light Snow': 'Neve leggera', 'Snow': 'Neve',
      'Heavy Snow': 'Neve forte', 'Snow Grains': 'Neve granulosa', 'Showers': 'Rovesci', 'Heavy Showers': 'Forti rovesci',
      'Snow Showers': 'Rovesci di neve', 'Thunderstorm': 'Temporale', 'Unknown': 'Sconosciuto',
    },
  },
  ja: {
    sunrise: '日の出', sunset: '日の入り', wind: '風', humidity: '湿度', aqi: 'AQI',
    sample: 'サンプル', weather: '天気', high: '最高', low: '最低',
    week: '第{n}週', dayOf: '{n}日中{d}日目', weekOfYear: '週番号',
    nothingElse: '今日の予定はもうありません', allDay: '終日', nowUntil: '進行中 · {t}まで',
    cond: {
      'Clear': '快晴', 'Mostly Clear': '晴れ', 'Partly Cloudy': '晴れ時々曇り', 'Overcast': '曇り',
      'Fog': '霧', 'Freezing Fog': '着氷性の霧', 'Light Drizzle': '弱い霧雨', 'Drizzle': '霧雨',
      'Heavy Drizzle': '強い霧雨', 'Freezing Drizzle': '着氷性の霧雨', 'Light Rain': '小雨', 'Rain': '雨',
      'Heavy Rain': '大雨', 'Freezing Rain': '着氷性の雨', 'Light Snow': '小雪', 'Snow': '雪',
      'Heavy Snow': '大雪', 'Snow Grains': '霧雪', 'Showers': 'にわか雨', 'Heavy Showers': '強いにわか雨',
      'Snow Showers': 'にわか雪', 'Thunderstorm': '雷雨', 'Unknown': '不明',
    },
  },
  fa: {
    sunrise: 'طلوع', sunset: 'غروب', wind: 'باد', humidity: 'رطوبت', aqi: 'AQI',
    sample: 'نمونه', weather: 'هوا', high: 'بیشینه', low: 'کمینه',
    week: 'هفته {n}', dayOf: 'روز {d} از {n}', weekOfYear: 'هفته‌ی سال',
    nothingElse: 'امروز برنامه‌ی دیگری نیست', allDay: 'تمام روز', nowUntil: 'اکنون · تا {t}',
    cond: {
      'Clear': 'صاف', 'Mostly Clear': 'عمدتاً صاف', 'Partly Cloudy': 'نیمه‌ابری', 'Overcast': 'ابری',
      'Fog': 'مه', 'Freezing Fog': 'مه یخ‌زده', 'Light Drizzle': 'نم‌نم باران سبک', 'Drizzle': 'نم‌نم باران',
      'Heavy Drizzle': 'نم‌نم باران شدید', 'Freezing Drizzle': 'نم‌نم باران یخ‌زده', 'Light Rain': 'باران سبک', 'Rain': 'باران',
      'Heavy Rain': 'باران شدید', 'Freezing Rain': 'باران یخ‌زده', 'Light Snow': 'برف سبک', 'Snow': 'برف',
      'Heavy Snow': 'برف سنگین', 'Snow Grains': 'دانه‌های برف', 'Showers': 'رگبار', 'Heavy Showers': 'رگبار شدید',
      'Snow Showers': 'رگبار برف', 'Thunderstorm': 'توفان تندری', 'Unknown': 'نامشخص',
    },
  },
};

/** The word for `key` in a locale ("fr-FR", "ja"), with {placeholders} filled in. */
export function tr(locale, key, vars = {}) {
  const lang = String(locale ?? '').split('-')[0].toLowerCase();
  const text = T[lang]?.[key] ?? EN[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/** A weather condition (the English label from the data) in a locale; unknown labels pass through. */
export function condition(locale, label) {
  const lang = String(locale ?? '').split('-')[0].toLowerCase();
  return T[lang]?.cond?.[label] ?? label ?? '';
}

/** "H:16° L:9°" in the locale's own words. */
export function highLow(locale, high, low) {
  return `${tr(locale, 'high')}:${high} ${tr(locale, 'low')}:${low}`;
}
