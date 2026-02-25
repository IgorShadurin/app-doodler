export type StudioLanguage = {
  code: string;
  name: string;
  flag: string;
};

const LANGUAGE_CATALOG: StudioLanguage[] = [
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'en-AU', name: 'English (Australia)', flag: '🇦🇺' },
  { code: 'en-CA', name: 'English (Canada)', flag: '🇨🇦' },
  { code: 'en-GB', name: 'English (U.K.)', flag: '🇬🇧' },
  { code: 'en-US', name: 'English (U.S.)', flag: '🇺🇸' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'fr-CA', name: 'French (Canada)', flag: '🇨🇦' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
];

const POPULAR_LATIN_LANGUAGE_CODES = [
  'en-US',
  'en-GB',
  'en-CA',
  'en-AU',
  'es-ES',
  'es-MX',
  'pt-BR',
  'pt-PT',
  'fr-FR',
  'fr-CA',
  'de-DE',
  'it',
  'nl-NL',
  'tr',
  'id',
  'ms',
  'vi',
  'ca',
  'da',
  'fi',
  'no',
  'sv',
  'ro',
] as const;

const SLAVIC_LANGUAGE_CODES = [
  'hr',
  'cs',
  'pl',
  'ru',
  'sk',
  'uk',
] as const;

const languageByCode = new Map(LANGUAGE_CATALOG.map((language) => [language.code, language] as const));
const usedCodes = new Set<string>();

function pickLanguages(codes: readonly string[]): StudioLanguage[] {
  return codes
    .map((code) => {
      const language = languageByCode.get(code);
      if (!language) return null;
      usedCodes.add(code);
      return language;
    })
    .filter((language): language is StudioLanguage => language !== null);
}

const popularLatinLanguages = pickLanguages(POPULAR_LATIN_LANGUAGE_CODES);
const slavicLanguages = pickLanguages(SLAVIC_LANGUAGE_CODES);
const remainingLanguages = LANGUAGE_CATALOG
  .filter((language) => !usedCodes.has(language.code))
  .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

export const STUDIO_LANGUAGES: StudioLanguage[] = [
  ...popularLatinLanguages,
  ...slavicLanguages,
  ...remainingLanguages,
];

export const DEFAULT_STUDIO_LANGUAGE = 'en-US';
