import { customElement } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import { Github, Sun } from './icons';
import { Router } from '@vaadin/router';

@customElement('header-component')
export class Header extends LitElement {
  static styles = css`
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 5rem;
    }

    h1 {
      font-size: 2rem;
    }

    a {
      text-decoration: none;
      color: var(--black-1);
    }

    .iconsContainer {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `;

  private _onHeaderClick(e: any) {
    e.preventDefault();
    Router.go('/');
  }

  render() {
    return html` <div class="container">
      <h1>
        <a href="https://vimracing.com" @click=${this._onHeaderClick}>
          Vimracing
        </a>
      </h1>

      <div class="iconsContainer">${Sun} ${Github}</div>
    </div>`;
  }
}
