import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  type Card,
  type Grade,
  Rating,
} from "ts-fsrs";
import type { SrsRank, Word } from "./types";

const params = generatorParameters({ enable_fuzz: true });
const f = fsrs(params);

export { Rating };

export function newCard(): Card {
  return createEmptyCard();
}

export function scheduleReview(card: Card, rating: Grade) {
  const result = f.repeat(card, new Date());
  return result[rating].card;
}

export function cardFromWord(word: Word): Card {
  return {
    due: word.srs_due ? new Date(word.srs_due) : new Date(),
    stability: word.srs_stability,
    difficulty: word.srs_difficulty,
    elapsed_days: word.srs_elapsed_days,
    scheduled_days: word.srs_scheduled_days,
    reps: word.srs_reps,
    lapses: word.srs_lapses,
    state: word.srs_state,
    last_review: undefined,
  } as Card;
}

export function cardToFields(card: Card) {
  return {
    srs_due: card.due.toISOString(),
    srs_stability: card.stability,
    srs_difficulty: card.difficulty,
    srs_elapsed_days: card.elapsed_days,
    srs_scheduled_days: card.scheduled_days,
    srs_reps: card.reps,
    srs_lapses: card.lapses,
    srs_state: card.state,
  };
}

export function rankFromCard(card: Card): SrsRank {
  if (card.reps === 0) return "新手";
  if (card.reps < 5) return "熟练";
  if (card.stability > 30) return "已毕业";
  return "精通";
}
