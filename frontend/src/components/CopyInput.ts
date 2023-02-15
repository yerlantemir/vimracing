import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('copy-input')
export class CopyInput extends LitElement {
  @property()
  copied?: boolean = false;

  @property({ type: String })
  link = '';

  @query('#raceIdInput')
  raceIdInput!: HTMLInputElement;

  static styles = css`
    .inputContainer {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 0.75rem;
      align-items: center;
      background: var(--white-3);
      border-radius: 0.25rem;
      height: 2.5rem;
      gap: 1rem;
    }
    .inputContainer button {
      border: none;
      border-radius: 0.25rem;
      padding: 0.5rem 1rem;
      color: var(--white-1);
      cursor: pointer;
      width: 6rem;

      transition: background 0.2s ease;
    }
    .buttonActive {
      background: var(--blue-1);
    }
    .buttonCopied {
      background: var(--green-1);
    }
    input {
      border: none;
      background: transparent;
      width: 100%;
      padding: 0.5rem 1rem;
    }
  `;

  private _onCopyClick() {
    if (this.copied) return;

    this.raceIdInput.select();
    navigator.clipboard.writeText(this.raceIdInput.value);

    this.copied = true;
    setInterval(() => {
      this.copied = false;
    }, 3000);
  }

  private _onInputClick(e: any) {
    e.target.select();
  }
  connectedCallback(): void {
    super.connectedCallback();
  }
  render() {
    return html`
      <div class="inputContainer">
        <input
          id="raceIdInput"
          value=${this.link}
          readonly="true"
          @click=${this._onInputClick}
        />
        <button
          class="${this.copied ? 'buttonCopied' : 'buttonActive'}"
          @click=${this._onCopyClick}
        >
          ${this.copied ? html`Copied!` : html`Copy`}
        </button>
      </div>
    `;
  }
}
