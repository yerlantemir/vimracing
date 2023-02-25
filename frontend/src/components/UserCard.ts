import { LitElement, css, html } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';
import { CacheStorage } from '../utils/storage';

@customElement('user-card-element')
export class UserCard extends LitElement {
  @property()
  place?: number;

  @property()
  userId?: string;

  @property()
  username?: string;

  @property()
  completeness?: number;

  @property({ type: Boolean, reflect: true })
  isCurrentUser?: boolean;

  @property()
  onUsernameChangeCallback?: (newUsername: string) => void;

  @state()
  editUsername = false;

  @state()
  internalUsername = '';

  static styles = css`
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      min-height: 50px;
      border-radius: 0.75rem;
      width: 20rem;
      border: 1px solid #f4eaea;
      padding: 0px 0.75rem;
      gap: 0.75rem;
    }

    span {
      font-size: 12px;
      font-weight: 700;
      color: #000000;
    }
    .avatar {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .avatar img {
      border-radius: 999px;
      max-width: 2rem;
      max-height: 2rem;
    }
    .completeness {
      opacity: 0.5;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.internalUsername = this.username || '';
    console.log('A?');
  }
  onUsernameDblClick() {
    if (this.isCurrentUser) {
      this.editUsername = true;
    }
  }
  onUsernameInputBlur() {
    this.onUsernameChangeCallback?.(this.internalUsername.replace('(you)', ''));
    this.editUsername = false;
  }

  onUsernameChange(e: any) {
    this.internalUsername = e.target.value;
  }
  renderUsername() {
    return this.editUsername
      ? html`<input
          type="text"
          value="${this.internalUsername}"
          @change=${this.onUsernameChange}
          @blur=${this.onUsernameInputBlur}
        />`
      : html` <span class="username" @dblclick=${this.onUsernameDblClick}
          >${this.username}</span
        >`;
  }
  render() {
    return html`
      <div class="container">
        <div class="avatar">
          <span>${this.place}</span>
          <img
            src="https://ih1.redbubble.net/image.683487337.7607/flat,750x1000,075,f.jpg"
            alt="avatar"
          />
        </div>
        ${this.renderUsername()}
        <span class="completeness">${this.completeness}</span>
      </div>
    `;
  }
}
