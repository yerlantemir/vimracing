import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';
import Editor from '../utils/editor';
import router from '../router';
import {
  ServerRaceChangeEvent,
  ServerRaceEnterEvent,
  FrontendRaceChangeEvent,
  SocketEventType
} from '@vimracing/shared';
import { parseData, stringifyData } from '../utils/raw';
import { CacheStorage } from '../utils/storage';
import '../components/ContentCard.ts';
import '../components/Modal.ts';
import '../components/UserCard.ts';

@customElement('race-view')
export class Race extends LitElement {
  @state()
  editor?: Editor;

  @state()
  raceId?: string;

  @state()
  usersPayload?: ServerRaceChangeEvent['data']['usersPayload'];

  @state()
  socketConnection?: WebSocket;

  @state()
  currentUser?: {
    id: string;
    username: string;
    doc: string[];
  };

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

    .usersContainer {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      justify-content: center;
      align-items: center;
    }
  `;
  private _sendChangeEvent() {
    if (!this.raceId || !this.currentUser || !this.currentUser) {
      console.error('No userId or raceId');
      return;
    }

    const eventDataString: FrontendRaceChangeEvent = {
      event: SocketEventType.CHANGE,
      data: {
        userId: this.currentUser.id,
        raceId: this.raceId,
        raceDoc: this.currentUser.doc,
        username: this.currentUser.username
      }
    };
    this.socketConnection?.send(stringifyData(eventDataString));
  }

  private _onDocChange(doc: string[]) {
    if (this.currentUser) this.currentUser = { ...this.currentUser, doc };
  }

  private _onRaceEnter({
    userId,
    username,
    raceDoc
  }: ServerRaceEnterEvent['data']) {
    this.currentUser = { id: userId, username, doc: raceDoc.start };

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

  _connectToRace() {
    this.raceId = router.location.params.raceId as string;
    const user = CacheStorage.getUser();

    this.socketConnection = new WebSocket(
      `ws://localhost:8999/?raceId=${this.raceId}${
        user?.username ? `&username=${user.username}` : ''
      }${user?.id ? `&userId=${user.id}` : ''}`
    );

    this.socketConnection.addEventListener(
      'message',
      this._onMessage.bind(this)
    );
  }

  _onCurrentUserUsernameChange(newUsername: string) {
    const currentUser = this.currentUser;
    if (!currentUser) return;

    this.usersPayload = this.usersPayload?.map((u) => {
      if (currentUser.id === u.id) {
        return { ...u, username: newUsername };
      }

      return u;
    });

    this.currentUser = { ...currentUser, username: newUsername };
  }

  _renderUsers() {
    const currentUser = this.currentUser;
    if (!this.usersPayload || !this.currentUser) return null;

    return html`
      <div class="usersContainer">
        ${this.usersPayload
          .sort((a, b) => b['completeness'] - a['completeness'])
          .map(
            ({ id, username, completeness }, index) =>
              html`<user-card-element
                place="${index + 1}"
                userId="${id}"
                username="${username}${currentUser?.id === id ? ' (you)' : ''}"
                completeness="${completeness}"
                ?isCurrentUser="${currentUser?.id === id}"
                .onUsernameChangeCallback="${this._onCurrentUserUsernameChange.bind(
                  this
                )}"
              ></user-card-element> `
          )}
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    this._connectToRace();
  }

  disconnectedCallback(): void {
    this.socketConnection?.close();
  }

  update(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.update(changedProperties);

    if (changedProperties.has('currentUser')) {
      this._sendChangeEvent();
    }
  }

  render() {
    return html`
      <content-card>
        <div class="content">
          <h5>The race is on! Refactor the code below:</h5>

          ${this._renderUsers()}
          <div class="editor">
            <div id="cm"></div>
          </div>
        </div>
      </content-card>
    `;
  }
}
