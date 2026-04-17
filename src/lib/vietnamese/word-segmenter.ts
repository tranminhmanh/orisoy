// Vietnamese word segmentation utilities
// Vietnamese is an isolating language where compound words are formed by
// combining syllables separated by spaces. Proper segmentation is critical
// for accurate keyword analysis.

// Common Vietnamese compound words (two-syllable)
const COMPOUND_WORDS = new Set([
  "hoc sinh", "sinh vien", "giao vien", "bac si", "ky su",
  "cong nghe", "thong tin", "phat trien", "giai phap", "dich vu",
  "san pham", "khach hang", "thi truong", "kinh doanh", "tai chinh",
  "ngan hang", "bat dong san", "xay dung", "giao duc", "y te",
  "du lich", "am thuc", "thoi trang", "the thao", "van hoa",
  "xa hoi", "chinh tri", "moi truong", "nong nghiep", "cong nghiep",
  "thuong mai", "dien tu", "may tinh", "dien thoai", "internet",
  "marketing", "quang cao", "truyen thong", "bao chi", "nha hang",
  "khach san", "benh vien", "truong hoc", "dai hoc", "cong ty",
  "doanh nghiep", "to chuc", "chinh phu", "quoc gia", "thanh pho",
  "quan huyen", "phuong xa", "nha nuoc", "cong dan", "gia dinh",
  "tre em", "nguoi gia", "suc khoe", "the duc", "an toan",
  "chat luong", "hieu qua", "nang luc", "ky nang", "kinh nghiem",
  "nghien cuu", "ung dung", "phan mem", "he thong", "co so",
  "ha tang", "nang luong", "tai nguyen", "bien doi", "khi hau",
  "bao ve", "phat huy", "doi moi", "hoi nhap", "hop tac",
]);

// Three-syllable compound words
const TRIPLE_COMPOUNDS = new Set([
  "cong nghe thong tin", "bat dong san", "bao hiem xa hoi",
  "giao duc dao tao", "khoa hoc cong nghe", "kinh te xa hoi",
  "van hoa xa hoi", "quoc phong an ninh", "lao dong thuong binh",
  "tai nguyen moi truong", "nong nghiep nong thon", "giao thong van tai",
  "xay dung co ban", "ke hoach dau tu", "tai chinh ngan hang",
]);

export function segmentWords(text: string): string[] {
  // TODO: Integrate with a proper Vietnamese NLP library (e.g., vncorenlp, underthesea)
  // Current implementation uses a dictionary-based approach

  const normalized = text.toLowerCase().trim();
  const syllables = normalized.split(/\s+/).filter(Boolean);

  if (syllables.length === 0) return [];

  const result: string[] = [];
  let i = 0;

  while (i < syllables.length) {
    // Try three-syllable compound first
    if (i + 2 < syllables.length) {
      const triple = `${syllables[i]} ${syllables[i + 1]} ${syllables[i + 2]}`;
      if (TRIPLE_COMPOUNDS.has(triple)) {
        result.push(triple);
        i += 3;
        continue;
      }
    }

    // Try two-syllable compound
    if (i + 1 < syllables.length) {
      const double = `${syllables[i]} ${syllables[i + 1]}`;
      if (COMPOUND_WORDS.has(double)) {
        result.push(double);
        i += 2;
        continue;
      }
    }

    // Single syllable
    result.push(syllables[i]);
    i++;
  }

  return result;
}

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  const segments = segmentWords(text);
  return segments.length;
}

export function calculateKeywordDensity(
  text: string,
  keyword: string
): number {
  if (!text.trim() || !keyword.trim()) return 0;

  const totalWords = countWords(text);
  if (totalWords === 0) return 0;

  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();

  // Count keyword occurrences
  let count = 0;
  let pos = 0;
  while ((pos = textLower.indexOf(keywordLower, pos)) !== -1) {
    count++;
    pos += keywordLower.length;
  }

  // Keyword density = (keyword occurrences * words in keyword) / total words * 100
  const keywordWordCount = keywordLower.split(/\s+/).length;
  return (count * keywordWordCount) / totalWords * 100;
}
