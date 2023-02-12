import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';

@customElement('button-component')
export class Button extends LitElement {
  static styles = css`
    button {
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      background: var(--blue-2);
      color: var(--white-1);
      font-size: 1rem;
      cursor: pointer;
      border: none;
      min-width: 200px;
    }
  `;
  render() {
    return html`<button><slot></slot></button>`;
  }
}
