export interface Word {
  id: string;
  original: string;
  kana: string;
  pitch: string;
  pos: string;
  meaning: string;
  tags: string[];
  srs_due: string | null;
  srs_stability: number;
  srs_difficulty: number;
  srs_elapsed_days: number;
  srs_scheduled_days: number;
  srs_reps: number;
  srs_lapses: number;
  srs_state: number;
  srs_rank: SrsRank;
  created_at: string;
}

export type SrsRank = "新手" | "熟练" | "精通" | "已毕业";

export interface SearchResult {
  original: string;
  kana: string;
  pitch: string;
  pos: string;
  meaning: string;
  tags: string[];
}

export interface ReviewCard {
  word: Word;
  quizType: QuizType;
  question: string;
  answer: string;
  options?: string[];
}

export type QuizType = "ja_to_zh" | "zh_to_ja" | "cloze" | "match";

export type ReviewRating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy
