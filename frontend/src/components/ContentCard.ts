import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('content-card')
export class ContentCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--white-1);
      border-radius: 0.75rem;
      padding: 2rem;
    }
  `;
  render() {
    return html`<slot></slot> `;
  }
}
