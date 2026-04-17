// Vietnamese regional dialect mapping
// Vietnamese has three main dialects: Northern (Bac), Central (Trung), and Southern (Nam)
// Keywords may vary significantly across regions

export interface DialectVariants {
  north: string;
  central: string;
  south: string;
}

// Common vocabulary differences between Northern, Central, and Southern Vietnamese
const DIALECT_DICTIONARY: Array<{ north: string; central: string; south: string }> = [
  // Food & Drink
  { north: "bát", central: "tô", south: "chén" },            // bowl
  { north: "thìa", central: "muỗng", south: "muỗng" },       // spoon
  { north: "cốc", central: "ly", south: "ly" },               // glass/cup
  { north: "quả", central: "trái", south: "trái" },           // fruit (classifier)
  { north: "lạc", central: "đậu phộng", south: "đậu phộng" }, // peanut
  { north: "ngô", central: "bắp", south: "bắp" },            // corn
  { north: "dứa", central: "thơm", south: "khóm" },          // pineapple
  { north: "ốc", central: "ốc", south: "ốc" },               // snail
  { north: "chè", central: "chè", south: "chè" },            // sweet soup
  { north: "phở", central: "phở", south: "phở" },            // pho
  { north: "bún chả", central: "bún thịt nướng", south: "bún thịt nướng" }, // grilled pork noodles
  { north: "nem rán", central: "chả ram", south: "chả giò" }, // spring rolls

  // People & Family
  { north: "bố", central: "ba", south: "ba" },               // father
  { north: "mẹ", central: "mạ", south: "má" },               // mother
  { north: "ông nội", central: "ông nội", south: "ông nội" }, // paternal grandfather
  { north: "bà ngoại", central: "bà ngoại", south: "bà ngoại" }, // maternal grandmother
  { north: "con gái", central: "con gái", south: "con gái" }, // daughter
  { north: "anh", central: "anh", south: "anh" },            // older brother
  { north: "chị", central: "chị", south: "chị" },            // older sister

  // Daily Life
  { north: "xe đạp", central: "xe đạp", south: "xe đạp" },   // bicycle
  { north: "xe máy", central: "xe máy", south: "xe máy" },    // motorbike
  { north: "ô tô", central: "xe hơi", south: "xe hơi" },     // car
  { north: "điện thoại", central: "điện thoại", south: "điện thoại" }, // phone
  { north: "nhà vệ sinh", central: "nhà vệ sinh", south: "nhà vệ sinh" }, // toilet

  // Actions & Descriptions
  { north: "nói", central: "nói", south: "nói" },             // speak
  { north: "chơi", central: "chơi", south: "chơi" },         // play
  { north: "thích", central: "thích", south: "thích" },       // like
  { north: "đẹp", central: "đẹp", south: "đẹp" },           // beautiful
  { north: "giỏi", central: "giỏi", south: "giỏi" },         // skillful/good at

  // Common search terms
  { north: "ở đâu", central: "ở đâu", south: "ở đâu" },     // where
  { north: "bao nhiêu", central: "bao nhiêu", south: "bao nhiêu" }, // how much
  { north: "thế nào", central: "răng", south: "sao" },        // how/what way
  { north: "tại sao", central: "tại sao", south: "tại sao" }, // why
  { north: "gì", central: "chi", south: "gì" },               // what

  // Shopping
  { north: "rẻ", central: "rẻ", south: "rẻ" },               // cheap
  { north: "mắc", central: "đắt", south: "mắc" },            // expensive
  { north: "hàng", central: "hàng", south: "hàng" },          // goods
  { north: "cửa hàng", central: "cửa hàng", south: "tiệm" }, // shop/store

  // Places
  { north: "nhà hàng", central: "nhà hàng", south: "nhà hàng" },     // restaurant
  { north: "quán ăn", central: "quán ăn", south: "quán ăn" },         // eatery
  { north: "bệnh viện", central: "bệnh viện", south: "nhà thương" }, // hospital
  { north: "trường học", central: "trường học", south: "trường học" }, // school
  { north: "chợ", central: "chợ", south: "chợ" },                     // market
];

// Build lookup maps for fast access
const northToEntry = new Map<string, DialectVariants>();
const centralToEntry = new Map<string, DialectVariants>();
const southToEntry = new Map<string, DialectVariants>();

for (const entry of DIALECT_DICTIONARY) {
  const variants: DialectVariants = { north: entry.north, central: entry.central, south: entry.south };
  northToEntry.set(entry.north.toLowerCase(), variants);
  centralToEntry.set(entry.central.toLowerCase(), variants);
  southToEntry.set(entry.south.toLowerCase(), variants);
}

export function getDialectVariants(word: string): DialectVariants {
  const wordLower = word.toLowerCase();

  // Check all three dialect maps
  const fromNorth = northToEntry.get(wordLower);
  if (fromNorth) return fromNorth;

  const fromCentral = centralToEntry.get(wordLower);
  if (fromCentral) return fromCentral;

  const fromSouth = southToEntry.get(wordLower);
  if (fromSouth) return fromSouth;

  // Word not found in dictionary - return same word for all dialects
  return { north: word, central: word, south: word };
}

export function mapRegionalKeywords(keyword: string): string[] {
  const variants = new Set<string>();
  variants.add(keyword);

  const keywordLower = keyword.toLowerCase();

  // Try to match each word or phrase in the keyword
  for (const entry of DIALECT_DICTIONARY) {
    const dialectValues = [entry.north, entry.central, entry.south];

    for (const dialectWord of dialectValues) {
      if (keywordLower.includes(dialectWord.toLowerCase())) {
        // Replace the dialect word with each regional variant
        for (const replacement of dialectValues) {
          if (replacement !== dialectWord) {
            const variant = keyword.replace(
              new RegExp(escapeRegExp(dialectWord), "gi"),
              replacement
            );
            variants.add(variant);
          }
        }
      }
    }
  }

  return Array.from(variants);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
