import { customElement } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import { Github, Sun } from './icons';

@customElement('header-component')
export class Header extends LitElement {
  static styles = css`
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 5rem;
    }

    h4 {
      font-size: 2rem;
    }

    .iconsContainer {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `;
  render() {
    return html` <div class="container">
      <h4>Vimracing</h4>

      <div class="iconsContainer">${Sun} ${Github}</div>
    </div>`;
  }
}
