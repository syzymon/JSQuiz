import {Question, questions as que} from '../data/questions.js';
import {Observable, Computed} from '../core/observable.js';

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

type maybeNumber = number | undefined;

class AnswerView {
  private readonly _elem: HTMLInputElement;
  private _answer: Observable<maybeNumber>;

  constructor(initialAnswer: Observable<maybeNumber>) {
    this._elem = document.querySelector('#answer') as HTMLInputElement;
    this._elem.value = '';
    this._answer = initialAnswer;
    this._elem.onchange = () => {
      this._answer.value = this._elem.value
        ? Number(this._elem.value)
        : undefined;
    };
  }

  set answer(switchedAnswer: Observable<maybeNumber>) {
    this._answer = switchedAnswer;
    this._elem.value = switchedAnswer.value
      ? switchedAnswer.value.toString()
      : '';
  }
}

class QuizNavigation {
  private _canFinish: Computed<boolean>;

  constructor(answers: Observable<maybeNumber>[], parent: Quiz) {
    this._canFinish = new Computed<boolean>(
      () => answers.every(x => x.value),
      answers
    );
    this.bindActions(parent);
  }

  private bindActions(par: Quiz): void {
    document.querySelectorAll('[nav-action]').forEach(elem => {
      if (elem instanceof HTMLButtonElement) {
        const actionName = elem.getAttribute('nav-action') as string;
        console.log(actionName);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        elem.onclick = par[actionName].bind(par) as () => void;
      }
    });
  }
}

export class Quiz {
  private readonly _questions: Question[];
  private _idCounter: Counter;
  private _questionView: QuestionView;
  private readonly _answers: Observable<maybeNumber>[];
  private _answerView: AnswerView;
  private _navigation: QuizNavigation;

  constructor(questions: Question[] = que) {
    this._questions = questions;
    this._questionView = new QuestionView(questions[0]);
    this._answers = [...Array(this._questions.length)].map(
      () => new Observable<maybeNumber>(undefined)
    );
    this._answerView = new AnswerView(this._answers[0]);
    this._navigation = new QuizNavigation(this._answers, this);

    this._idCounter = new Counter(this._questions.length, num => {
      this._questionView.question = this._questions[num];
      this._answerView.answer = this._answers[num];
    });
  }

  // TODO: return quiz results here
  // public start(): void {
  //   const nxt = document.querySelector('.next-inline') as HTMLButtonElement;
  //   nxt.onclick = () => {
  //     this._idCounter.next();
  //   };
  //   console.log('Run quiz!');
  // }

  public next(): void {
    this._idCounter.next();
  }

  public prev(): void {
    console.log('prev');
    this._idCounter.prev();
  }

  public finish(): void {
    return;
  }

  public skip(): void {
    console.log(this);
    return;
  }
}
