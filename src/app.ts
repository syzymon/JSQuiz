import {Quiz, QuestionResult} from './components/quiz.js';
import {Intro} from './components/intro.js';
import {Component} from './components/component.js';

export class App {
  private _currentComponent: Component;
  private readonly _intro: Intro;
  private _quiz: Quiz;

  constructor() {
    this._quiz = new Quiz(
      this.onQuizSkip.bind(this),
      this.onQuizFinish.bind(this)
    );
    this._intro = new Intro(() => {
      this.switchComponent(this._quiz);
      this._quiz.start();
    });
    this._currentComponent = this._intro;
  }

  private switchComponent(newComponent: Component) {
    this._currentComponent.display = false;
    this._currentComponent = newComponent;
    this._currentComponent.display = true;
  }

  private onQuizSkip(): void {
    this.switchComponent(this._intro);
    this.initializeNewQuiz();
  }

  private onQuizFinish(results: QuestionResult[]): void {
    this.switchComponent(this._intro);
    console.log(results);
    this.initializeNewQuiz();
  }

  private initializeNewQuiz() {
    this._quiz = new Quiz(
      this.onQuizSkip.bind(this),
      this.onQuizFinish.bind(this)
    );
  }
}
