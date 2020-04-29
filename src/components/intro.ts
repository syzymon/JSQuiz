import {Component} from './component.js';

export class Intro extends Component {
  private _startQuizButton: HTMLButtonElement;

  constructor(startCallback: () => void) {
    super(document.querySelector('.before-quiz') as HTMLDivElement);
    this._startQuizButton = document.querySelector(
      '.start-btn'
    ) as HTMLButtonElement;
    this._startQuizButton.onclick = startCallback;
    this._startQuizButton.disabled = false;
  }
}
