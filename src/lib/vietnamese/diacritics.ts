// Vietnamese diacritics handling
// Vietnamese uses Latin script with extensive diacritical marks for tones and vowel quality

const DIACRITICS_MAP: Record<string, string> = {
  // a variants
  "a": "a", "à": "a", "á": "a", "ả": "a", "ã": "a", "ạ": "a",
  "ă": "a", "ằ": "a", "ắ": "a", "ẳ": "a", "ẵ": "a", "ặ": "a",
  "â": "a", "ầ": "a", "ấ": "a", "ẩ": "a", "ẫ": "a", "ậ": "a",
  // e variants
  "e": "e", "è": "e", "é": "e", "ẻ": "e", "ẽ": "e", "ẹ": "e",
  "ê": "e", "ề": "e", "ế": "e", "ể": "e", "ễ": "e", "ệ": "e",
  // i variants
  "i": "i", "ì": "i", "í": "i", "ỉ": "i", "ĩ": "i", "ị": "i",
  // o variants
  "o": "o", "ò": "o", "ó": "o", "ỏ": "o", "õ": "o", "ọ": "o",
  "ô": "o", "ồ": "o", "ố": "o", "ổ": "o", "ỗ": "o", "ộ": "o",
  "ơ": "o", "ờ": "o", "ớ": "o", "ở": "o", "ỡ": "o", "ợ": "o",
  // u variants
  "u": "u", "ù": "u", "ú": "u", "ủ": "u", "ũ": "u", "ụ": "u",
  "ư": "u", "ừ": "u", "ứ": "u", "ử": "u", "ữ": "u", "ự": "u",
  // y variants
  "y": "y", "ỳ": "y", "ý": "y", "ỷ": "y", "ỹ": "y", "ỵ": "y",
  // d variant
  "đ": "d",
};

// Uppercase equivalents
const DIACRITICS_MAP_UPPER: Record<string, string> = {
  "A": "A", "À": "A", "Á": "A", "Ả": "A", "Ã": "A", "Ạ": "A",
  "Ă": "A", "Ằ": "A", "Ắ": "A", "Ẳ": "A", "Ẵ": "A", "Ặ": "A",
  "Â": "A", "Ầ": "A", "Ấ": "A", "Ẩ": "A", "Ẫ": "A", "Ậ": "A",
  "E": "E", "È": "E", "É": "E", "Ẻ": "E", "Ẽ": "E", "Ẹ": "E",
  "Ê": "E", "Ề": "E", "Ế": "E", "Ể": "E", "Ễ": "E", "Ệ": "E",
  "I": "I", "Ì": "I", "Í": "I", "Ỉ": "I", "Ĩ": "I", "Ị": "I",
  "O": "O", "Ò": "O", "Ó": "O", "Ỏ": "O", "Õ": "O", "Ọ": "O",
  "Ô": "O", "Ồ": "O", "Ố": "O", "Ổ": "O", "Ỗ": "O", "Ộ": "O",
  "Ơ": "O", "Ờ": "O", "Ớ": "O", "Ở": "O", "Ỡ": "O", "Ợ": "O",
  "U": "U", "Ù": "U", "Ú": "U", "Ủ": "U", "Ũ": "U", "Ụ": "U",
  "Ư": "U", "Ừ": "U", "Ứ": "U", "Ử": "U", "Ữ": "U", "Ự": "U",
  "Y": "Y", "Ỳ": "Y", "Ý": "Y", "Ỷ": "Y", "Ỹ": "Y", "Ỵ": "Y",
  "Đ": "D",
};

const FULL_MAP = { ...DIACRITICS_MAP, ...DIACRITICS_MAP_UPPER };

// Tone mark variants for each base vowel (for generating diacritic variants)
const _TONE_VARIANTS: Record<string, string[]> = {
  "a": ["a", "à", "á", "ả", "ã", "ạ"],
  "ă": ["ă", "ằ", "ắ", "ẳ", "ẵ", "ặ"],
  "â": ["â", "ầ", "ấ", "ẩ", "ẫ", "ậ"],
  "e": ["e", "è", "é", "ẻ", "ẽ", "ẹ"],
  "ê": ["ê", "ề", "ế", "ể", "ễ", "ệ"],
  "i": ["i", "ì", "í", "ỉ", "ĩ", "ị"],
  "o": ["o", "ò", "ó", "ỏ", "õ", "ọ"],
  "ô": ["ô", "ồ", "ố", "ổ", "ỗ", "ộ"],
  "ơ": ["ơ", "ờ", "ớ", "ở", "ỡ", "ợ"],
  "u": ["u", "ù", "ú", "ủ", "ũ", "ụ"],
  "ư": ["ư", "ừ", "ứ", "ử", "ữ", "ự"],
  "y": ["y", "ỳ", "ý", "ỷ", "ỹ", "ỵ"],
};

export function removeDiacritics(text: string): string {
  return text
    .split("")
    .map((char) => FULL_MAP[char] ?? char)
    .join("");
}

export function generateDiacriticVariants(keyword: string): string[] {
  // Generate common diacritic variations of a keyword
  // Useful for catching user searches with missing/wrong diacritics
  const variants = new Set<string>();
  variants.add(keyword);

  // Add version without diacritics
  const noDiacritics = removeDiacritics(keyword);
  variants.add(noDiacritics);

  // Generate common misspelling variants
  // For each word in the keyword, try removing diacritics one word at a time
  const words = keyword.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const variant = words
      .map((w, j) => (j === i ? removeDiacritics(w) : w))
      .join(" ");
    variants.add(variant);
  }

  // Try common d/đ confusion
  if (keyword.includes("đ")) {
    variants.add(keyword.replace(/đ/g, "d"));
  }
  if (keyword.includes("d") && !keyword.includes("đ")) {
    variants.add(keyword.replace(/d/g, "đ"));
  }

  return Array.from(variants);
}

export function normalizeDiacritics(text: string): string {
  // Normalize Unicode composition for Vietnamese text
  // Vietnamese can be encoded in different Unicode forms (NFC vs NFD)
  // This ensures consistent representation
  return text.normalize("NFC");
}
