import { Router } from '@vaadin/router';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import router from '../router';

@customElement('corridor-view')
export class Corridor extends LitElement {
  @property()
  raceId?: string = '';

  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log('ASDDDDDDDDDDD');

    this.raceId = router.location.params.raceId as string;
  }
  private _onRaceEnterClick() {
    if (this.raceId) Router.go(`/race/${this.raceId}`);
    else {
      console.error('raceId does not exist');
    }
  }
  render() {
    return html`hello there! Your raceId = ${this.raceId}
      <button @click="${this._onRaceEnterClick}">enter the race!</button> `;
  }
}
