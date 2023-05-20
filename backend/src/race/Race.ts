import { RaceState } from '@vimracing/shared';
import { Player } from './Player';
import { EventEmitter } from 'events';
import { Tail } from '../types/Tail';
import { generateRaceDocs } from './raceDocsGenerator';

const DEFAULT_WAITING_TIME_IN_S = 3;
const DEFAULT_RACE_TIME_IN_S = 60;
const RACE_TIMER_UPDATE_INTERVAL_IN_MS = 1000;

interface RaceEvents {
  playerAdded: (race: Race, player: Player) => void;
  raceStarted: (race: Race) => void;
  timerUpdated: (
    race: Race,
    params: { raceStatus: RaceState; timer: number }
  ) => void;
  raceFinished: (race: Race) => void;
  playerDataChanged: (race: Race, player: Player) => void;
}

export class Race {
  private eventEmitter = new EventEmitter();
  private state: RaceState = RaceState.WAITING;
  private players: Player[] = [];
  private raceDocs: {
    start: string[];
    target: string[];
  }[];
  constructor(public id: string, public hostToken: string) {
    this.raceDocs = generateRaceDocs();
  }

  addPlayer(player: Player) {
    if (this.getPlayer(player.id) || this.state !== RaceState.WAITING) return;
    this.players.push(player);
    this.emit('playerAdded', player);
  }

  start() {
    let timer = DEFAULT_WAITING_TIME_IN_S;
    const currentInterval = setInterval(() => {
      if (timer === 1) {
        this.onRaceOn();
        clearInterval(currentInterval);
      } else {
        timer--;
        this.emit('timerUpdated', { raceStatus: this.state, timer });
      }
    }, RACE_TIMER_UPDATE_INTERVAL_IN_MS);
  }
  onRaceOn() {
    this.state = RaceState.ON;
    this.emit('raceStarted');

    let timer = DEFAULT_RACE_TIME_IN_S;
    const interval = setInterval(() => {
      if (timer === 1) {
        this.onRaceEnd();
        clearInterval(interval);
      } else {
        this.emit('timerUpdated', { raceStatus: this.state, timer });
        timer--;
      }
    }, RACE_TIMER_UPDATE_INTERVAL_IN_MS);
  }
  onRaceEnd() {
    this.state = RaceState.FINISHED;
    this.emit('raceFinished');
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public changeDoc(playerId: string, documentIndex: number, newDoc: string[]) {
    const player = this.getPlayer(playerId);
    if (!player) return;
    player.updateDoc(
      newDoc,
      documentIndex,
      this.getDocCompleteness(newDoc, documentIndex)
    );

    this.emit('playerDataChanged', player);
  }
  public getRaceDocs() {
    return this.raceDocs;
  }
  public getPlayer(id: string) {
    return this.players.find((p) => p.id === id);
  }
  public getDocCompleteness(doc: string[], docIndex: number): number {
    const targetDoc = this.raceDocs[docIndex].target;
    let completeness = 0;
    for (let i = 0; i < doc.length; i++) {
      if (doc[i] === targetDoc[i]) completeness++;
    }
    const completenessPercentage = (completeness / targetDoc.length) * 100;
    return Math.round(completenessPercentage);
  }

  on<Event extends keyof RaceEvents>(
    event: Event,
    listener: RaceEvents[Event]
  ) {
    this.eventEmitter.on(event, listener);
  }

  private emit<Event extends keyof RaceEvents>(
    event: Event,
    ...args: Tail<Parameters<RaceEvents[Event]>>
  ) {
    this.eventEmitter.emit(event, this, ...args);
  }
}
