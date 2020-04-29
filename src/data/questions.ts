export interface Question {
  readonly statement: string;
  readonly answer: number;
  readonly secondsPenalty: number;
}

export const questions = [
  {
    statement: '(!+[]+[]+![]).length',
    answer: 9,
    secondsPenalty: 10,
  },
  {
    statement: '"2"+"2"-"2"',
    answer: 20,
    secondsPenalty: 7,
  },
  {
    statement: '11-"1"',
    answer: 10,
    secondsPenalty: 4,
  },
  {
    statement: '{}+[]',
    answer: 0,
    secondsPenalty: 5,
  },
] as Question[];
