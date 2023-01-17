import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRoom } from '../api/createRoom';

@customElement('index-root')
export class Index extends LitElement {
  static styles = css`
    :host {
      color: blue;
    }
  `;

  private async _onCreateRaceClick() {
    const newRoomId = await createRoom();

    Router.go(`/corridor/${newRoomId}`);
  }
  render() {
    return html`hello there!
      <button @click="${this._onCreateRaceClick}">create race!</button> `;
  }
}
