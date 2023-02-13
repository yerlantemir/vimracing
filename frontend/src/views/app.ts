import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRoom } from '../api/createRoom';
import '../components/ContentCard.ts';
import '../components/Button';

@customElement('index-root')
export class Index extends LitElement {
  static styles = css`
    h5 {
      font-size: 1.5rem;
      color: var(--black-1);
      font-weight: 500;
      margin: 0;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 3.75rem;
    }
    .createButton {
      width: 200px;
    }
  `;

  private async _onCreateRaceClick() {
    const newRoomId = await createRoom();

    Router.go(`/corridor/${newRoomId}`);
  }
  render() {
    return html`
      <content-card>
        <div class="content">
          <h5>Vimracing - the global vim competition</h5>
          <button-component
            class="createButton"
            @click=${this._onCreateRaceClick}
          >
            Create race
          </button-component>
        </div>
      </content-card>
    `;
  }
}
