import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './race';

@customElement('index-root')
export class Index extends LitElement {
  static styles = css`
    :host {
      color: blue;
    }
  `;

  private _onCreateRaceClick() {
    Router.go('/corridor/123');
  }
  render() {
    return html`hello there!
      <button @click="${this._onCreateRaceClick}">create race!</button> `;
  }
}
