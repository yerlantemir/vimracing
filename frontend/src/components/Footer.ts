import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('footer-component')
export class Footer extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    footer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 0;
    }
  `;
  render() {
    return html`<footer>Made with love in 🇰🇿</footer>`;
  }
}
