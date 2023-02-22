import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import Editor from '../utils/editor';
import router from '../router';
import {
  ServerRaceChangeEvent,
  ServerRaceEnterEvent,
  FrontendRaceChangeEvent,
  SocketEventType
} from '@vimracing/shared';
import { parseData, stringifyData } from '../utils/raw';
import { CacheStorage, CacheStorageKey } from '../utils/storage';
import '../components/ContentCard.ts';

@customElement('race-view')
export class Race extends LitElement {
  @property()
  editor?: Editor;

  @property()
  raceId?: string;

  @property()
  goalDoc?: string[];

  @property()
  usersPayload?: ServerRaceChangeEvent['data']['usersPayload'];

  @property()
  socketConnection?: WebSocket;

  @property()
  showUsernameModal = false;

  @property()
  username?: string;

  @query('#username')
  usernameInput?: HTMLInputElement;

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 3.75rem;
    }
    h5 {
      font-size: 1.25rem;
      margin: 0;
      font-weight: 500;
    }

    .editor {
      border: 1px solid black;
      border-radius: 0.75rem;
      padding: 0.25rem;
    }
  `;
  private _sendChangeEvent(doc: string[]) {
    const user = CacheStorage.getUser();
    const raceId = this.raceId;

    if (!user || !raceId) {
      console.error('No userId or raceId');
      return;
    }

    const { id: userId } = user;
    const eventDataString: FrontendRaceChangeEvent = {
      event: SocketEventType.CHANGE,
      data: {
        userId,
        raceId,
        raceDoc: doc
      }
    };
    this.socketConnection?.send(stringifyData(eventDataString));
  }

  private _onDocChange(doc: string[]) {
    this._sendChangeEvent.apply(this, [doc]);
  }

  private _onRaceEnter({ userId, raceDoc }: ServerRaceEnterEvent['data']) {
    const user = CacheStorage.getUser();

    if (!user && userId && this.username) {
      CacheStorage.setUser({ id: userId, username: this.username });
    }

    const parentElement = this.renderRoot.querySelector('#cm');

    if (this.shadowRoot && parentElement && raceDoc)
      this.editor = new Editor({
        onChange: this._onDocChange.bind(this),
        root: this.shadowRoot,
        parent: parentElement,
        raceDoc
      });
  }

  private _onMessage(event: WebSocketEventMap['message']) {
    const { event: socketEvent, data } = parseData(event.data);

    if (socketEvent === SocketEventType.RACE_ENTER) {
      this._onRaceEnter.apply(this, [data]);
    } else if (socketEvent === SocketEventType.CHANGE) {
      this._onRacePayloadChange.apply(this, [data]);
    }
  }

  private _onRacePayloadChange({
    usersPayload
  }: ServerRaceChangeEvent['data']) {
    this.usersPayload = usersPayload;
  }

  connectedCallback() {
    super.connectedCallback();

    const user = CacheStorage.getUser();
    if (!user) {
      this.showUsernameModal = true;
    } else {
      this._connectToRace({ userId: user.id, username: user.username });
    }
  }

  _connectToRace({ userId, username }: { userId?: string; username: string }) {
    this.raceId = router.location.params.raceId as string;

    this.socketConnection = new WebSocket(
      `ws://localhost:8999/?raceId=${this.raceId}&username=${username}${
        userId ? `&userId=${userId}` : ''
      }`
    );

    this.socketConnection.addEventListener(
      'message',
      this._onMessage.bind(this)
    );
  }

  disconnectedCallback(): void {
    this.socketConnection?.close();
  }

  renderUsers() {
    if (!this.usersPayload) return null;

    return html`
      <ul>
        ${this.usersPayload
          .sort((a, b) => a['completeness'] - b['completeness'])
          .map(
            ({ username, completeness }) =>
              html`<li>${username} - ${completeness}</li>`
          )}
      </ul>
    `;
  }

  onUsernameSave() {
    const username = this.usernameInput?.value;

    if (!username) return;

    this.username = username;
    this.showUsernameModal = false;
    this._connectToRace({ username });
  }

  renderUsernameModal() {
    return html` <div>
      <h5>Enter your username</h5>
      <input id="username" />
      <button @click=${this.onUsernameSave}>save</button>
    </div>`;
  }

  render() {
    return html`
      ${this.showUsernameModal
        ? this.renderUsernameModal()
        : html`
            <content-card>
              ${this.renderUsers()}
              <div class="content">
                <h5>The race is on! Refactor the code below:</h5>
                <div class="editor">
                  <div id="cm"></div>
                </div>
              </div>
            </content-card>
          `}
    `;
  }
}
