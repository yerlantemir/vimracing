import { Router } from '@vaadin/router';
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import router from '../router';
import '../components/ContentCard.ts';
import '../components/CopyInput';

@customElement('corridor-view')
export class Corridor extends LitElement {
  @property()
  raceId?: string = '';

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 3.75rem;
    }
    h5 {
      font-size: 1.5rem;
      margin: 0;
    }
    .enterRaceButton {
      width: 160px;
    }
  `;

  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();

    this.raceId = router.location.params.raceId as string;
  }

  private _onRaceEnterClick() {
    if (this.raceId) Router.go(`/race/${this.raceId}`);
    else {
      console.error('raceId does not exist');
    }
  }

  render() {
    return html`
      <content-card>
        <div class="content">
          <h5>Join race, whenever you’re ready</h5>
          <copy-input
            link="https://vimracing.com/race/${this.raceId}"
          ></copy-input>
          <button-component
            class="enterRaceButton"
            @click=${this._onRaceEnterClick}
          >
            Enter the race
          </button-component>
        </div>
      </content-card>
    `;
  }
}
