import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './Header.ts';
import './Footer.ts';

@customElement('layout-component')
export class Layout extends LitElement {
  static styles = css`
    :host {
      font-family: 'Roboto', sans-serif;
      --white-1: #f8f8f8;
      --white-2: #ededed;
      --blue-1: #68d0ff;
      --blue-2: #03a9f4;
      --green-1: #7bdc90;
      --other-dots: #c29a4d;
      --red: red;

      display: flex;
      justify-content: center;
      align-item: center;

      width: 100vw;
      height: 100vh;
      background: var(--white-2);
      box-sizing: border-box;
      padding: 0 7.5rem;
      margin: -8px;
    }

    .container {
      max-width: 75rem;
      flex-grow: 1;

      position: relative;
    }
    .content {
      margin-top: 6rem;
    }
  `;

  render() {
    return html`
      <div class="container">
        <header-component></header-component>

        <div class="content">
          <slot></slot>
        </div>

        <footer-component></footer-component>
      </div>
    `;
  }
}
