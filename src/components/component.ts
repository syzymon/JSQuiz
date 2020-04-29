import {Observable} from '../core/observable.js';

export abstract class Component {
  private _slideElem: HTMLDivElement;
  private _currentlyHidden: Observable<boolean>;

  protected constructor(slideElement: HTMLDivElement) {
    this._slideElem = slideElement;
    this._currentlyHidden = new Observable(this._slideElem.hidden);
    this.bindDisplay();
  }

  private bindDisplay(): void {
    this._currentlyHidden.subscribe(currentHiddenState => {
      this._slideElem.hidden = currentHiddenState;
    });
  }

  get display(): boolean {
    return !this._currentlyHidden.value;
  }

  set display(to: boolean) {
    this._currentlyHidden.value = !to;
  }
}
