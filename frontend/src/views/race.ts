import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Editor from '../utils/editor';
import router from '../router';
import {
  ChangeEvent,
  RaceEnterEvent,
  RaceWinEvent,
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
  socketConnection?: WebSocket;

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
  private _sendChangeEvent(doc: string) {
    const userId = CacheStorage.get(CacheStorageKey.UserId);
    const raceId = this.raceId;

    if (!userId || !raceId) {
      console.error('No userId or raceId', { userId, raceId });
      return;
    }

    const eventDataString: ChangeEvent = {
      event: SocketEventType.CHANGE,
      data: {
        id: userId,
        raceId,
        doc
      }
    };
    this.socketConnection?.send(stringifyData(eventDataString));
  }

  private _onDocChange(doc: string) {
    this._sendChangeEvent.apply(this, [doc]);
  }

  private _onRaceEnter({ id, raceDoc }: RaceEnterEvent['data']) {
    console.log({ id, raceDoc });

    const definedUserId = CacheStorage.get(CacheStorageKey.UserId);

    if (!definedUserId && id) {
      CacheStorage.set(CacheStorageKey.UserId, id);
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

  private _onRaceWin({ id }: RaceWinEvent['data']) {
    console.log({ id });

    const definedUserId = CacheStorage.get(CacheStorageKey.UserId);

    if (id === definedUserId) {
      alert('YOU WON!');
    } else {
      alert('YOU LOSE(');
    }
  }

  private _onMessage(event: WebSocketEventMap['message']) {
    const { event: socketEvent, data } = parseData(event.data);

    console.log(SocketEventType.RACE_ENTER, socketEvent);

    if (socketEvent === SocketEventType.RACE_ENTER) {
      console.log('A?');

      this._onRaceEnter.apply(this, [data]);
    } else if (socketEvent === SocketEventType.WIN) {
      console.log('B?');
      this._onRaceWin.apply(this, [data]);
    }

    console.log('C?');
  }

  connectedCallback() {
    super.connectedCallback();

    this.raceId = router.location.params.raceId as string;
    const definedUserId = CacheStorage.get(CacheStorageKey.UserId);

    this.socketConnection = new WebSocket(
      `ws://localhost:8999/?raceId=${this.raceId}${
        definedUserId ? `&userId=${definedUserId}` : ''
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

  render() {
    return html`
      <content-card>
        <div class="content">
          <h5>The race is on! Refactor the code below:</h5>
          <div class="editor">
            <div id="cm"></div>
          </div>
        </div>
      </content-card>
    `;
  }
}
