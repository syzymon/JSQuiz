import {Question, questions as que} from '../data/questions.js';
import {Observable} from '../core/observable.js';

class Counter extends Observable<number> {
  private readonly _limit: number;
  private readonly _elem: HTMLSpanElement;

  constructor(n: number, changes: (x: number) => void) {
    super(0);
    this._limit = n;
    this._elem = document.querySelector('.question-nr') as HTMLSpanElement;
    this.subscribe(changes);
    this.subscribe(val => {
      this._elem.textContent = (1 + val).toString();
    });
  }

  public next() {
    this.value = (this.value + 1) % this._limit;
  }

  public prev() {
    this.value = (this.value + this._limit - 1) % this._limit;
  }
}

class QuestionView {
  private _question: Question;
  private readonly _statement: Observable<string>;
  private readonly _secondsPenalty: Observable<number>;

  constructor(question: Question) {
    this._question = question;
    this._statement = new Observable<string>(question.statement);
    this._secondsPenalty = new Observable<number>(question.secondsPenalty);
    this.bind();
  }

  private bind(): void {
    const bindings = {
      statement: this._statement,
      penalty: this._secondsPenalty,
    };
    Object.entries(bindings).forEach(([key, obs]) => {
      const elem = document.querySelector(
        `[data-bind="${key}"]`
      ) as HTMLElement;
      elem.textContent = obs.value.toString();
      obs.subscribe(() => (elem.textContent = obs.value.toString()));
    });
  }

  private update(): void {
    this._statement.value = this._question.statement;
    this._secondsPenalty.value = this._question.secondsPenalty;
  }

  set question(newQuestion: Question) {
    this._question = newQuestion;
    this.update();
  }
}

export class Quiz {
  private readonly _questions: Question[];
  private _idCounter: Counter;
  private _questionView: QuestionView;

  constructor(questions: Question[] = que) {
    this._questions = questions;
    this._questionView = new QuestionView(questions[0]);

    this._idCounter = new Counter(this._questions.length, num => {
      this._questionView.question = this._questions[num];
    });
  }

  // TODO: return quiz results here
  public run(): void {
    const nxt = document.querySelector('.next-inline') as HTMLButtonElement;
    nxt.onclick = () => {
      this._idCounter.next();
    };
    console.log('Run quiz!');
  }
}
