import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';

@customElement('modal-component')
export class Modal extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
    }
    div {
      background: var(--white-1);
      border-radius: 0.75rem;
      padding: 1rem;
      width: 100%;
      max-width: 500px;
      min-height: 400;
    }
  `;
  render() {
    return html`<div><slot></slot></div>`;
  }
}
