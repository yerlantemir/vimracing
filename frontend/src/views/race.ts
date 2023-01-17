import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Editor from '../utils/editor';
import router from '../router';

@customElement('race-view')
export class Race extends LitElement {
  @property()
  editor?: Editor;

  @property()
  raceId?: string;

  @property()
  socketConnection?: WebSocket;

  connectedCallback() {
    super.connectedCallback();
    this.raceId = router.location.params.raceId as string;
    const definedUserId = localStorage.getItem('userId');

    this.socketConnection = new WebSocket(
      `ws://localhost:8999/?raceId=${this.raceId}${
        definedUserId ? `&userId=${definedUserId}` : ''
      }`
    );

    this.socketConnection.addEventListener('message', (eve) => {
      if (!definedUserId) {
        const response = JSON.parse(eve.data);
        if (response['id']) localStorage.setItem('userId', response['id']);
      }
    });
  }
  disconnectedCallback(): void {
    this.socketConnection?.close();
  }

  firstUpdated() {
    const parentElement = this.renderRoot.querySelector('#cm');
    console.log(parentElement);
    if (this.shadowRoot && parentElement)
      this.editor = new Editor({
        root: this.shadowRoot,
        parent: parentElement
      });
  }
  render() {
    return html`<div id="cm"></div>`;
  }
}
