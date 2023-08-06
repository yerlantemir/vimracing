import { RaceStatus, SharedCompletedDocsPayload } from '@vimracing/shared';
import { Player, raceDataDefaults } from './Player';
import { EventEmitter } from 'events';
import { Tail } from '../types/Tail';
import { calculateDocCompleteness } from '../utils/calculateDocCompleteness';
import { getRandomRaceData } from '../utils/getRandomRaceData';
import { SupportedLanguages, RaceDocs } from '@vimracing/shared';

const DEFAULT_WAITING_TIME_IN_S = 3;
const DEFAULT_RACE_TIME_IN_S = 60;
const RACE_TIMER_UPDATE_INTERVAL_IN_MS = 1000;

interface RaceEvents {
  playerAdded: (race: Race, player: Player) => void;
  raceStarted: (race: Race) => void;
  timerUpdated: (
    race: Race,
    params: { raceStatus: RaceStatus; timer: number }
  ) => void;
  raceFinished: (race: Race) => void;
  playerDataChanged: (race: Race, player: Player) => void;
}

export class Race {
  private eventEmitter = new EventEmitter();
  private status: RaceStatus = RaceStatus.WAITING;
  private timer: number = DEFAULT_WAITING_TIME_IN_S;
  private players: Player[] = [];
  private raceDocs: RaceDocs = [];
  constructor(public id: string, public hostToken: string) {}

  async init(lang: SupportedLanguages) {
    this.raceDocs = await getRandomRaceData(lang);
  }

  addPlayer(player: Player) {
    if (this.getPlayer(player.id) || this.status !== RaceStatus.WAITING) return;
    this.players.push(player);
    this.emit('playerAdded', player);
  }

  start() {
    this.timer = DEFAULT_WAITING_TIME_IN_S;

    const currentInterval = setInterval(() => {
      if (this.timer === 1) {
        this.onRaceOn();
        clearInterval(currentInterval);
      } else {
        this.timer--;
        this.emit('timerUpdated', {
          raceStatus: this.status,
          timer: this.timer
        });
      }
    }, RACE_TIMER_UPDATE_INTERVAL_IN_MS);
  }

  onRaceOn() {
    this.status = RaceStatus.ON;
    this.emit('raceStarted');

    this.timer = DEFAULT_RACE_TIME_IN_S;
    const interval = setInterval(() => {
      if (this.timer === 1 || this.isRaceFinished()) {
        this.onRaceEnd();
        clearInterval(interval);
      } else {
        this.emit('timerUpdated', {
          raceStatus: this.status,
          timer: this.timer
        });
        this.timer--;
      }
    }, RACE_TIMER_UPDATE_INTERVAL_IN_MS);
  }

  onRaceEnd() {
    this.status = RaceStatus.FINISHED;

    this.setPlayersPlace();
    this.emit('raceFinished');
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public changeDoc(
    playerId: string,
    newDoc: string[],
    sharedDocPayload?: SharedCompletedDocsPayload
  ) {
    if (this.status !== RaceStatus.ON) return;
    const player = this.getPlayer(playerId);
    if (!player || !player.raceData) return;

    const docCompleteness = calculateDocCompleteness(
      this.raceDocs[player.raceData.currentDocIndex].start,
      this.raceDocs[player.raceData.currentDocIndex].target,
      newDoc
    );
    player.updateDoc(newDoc, docCompleteness, sharedDocPayload);

    if (
      docCompleteness === 100 &&
      player.raceData.currentDocIndex === this.raceDocs.length - 1
    ) {
      this.finishPlayerRace(playerId);
    }

    this.emit('playerDataChanged', player);
  }

  public finishPlayerRace(playerId: string) {
    const player = this.getPlayer(playerId);
    if (!player) return;

    const raceFinished = player.finishRace(this.getFinishedPlayersCount() + 1);

    if (raceFinished) this.emit('playerDataChanged', player);
  }

  public changeUsername(playerId: string, newUsername: string) {
    if (this.status !== RaceStatus.WAITING) return;
    const player = this.getPlayer(playerId);
    if (!player) return;
    player.updateUsername(newUsername);
    this.emit('playerDataChanged', player);
  }

  public getRaceDocs() {
    return this.raceDocs;
  }

  public getPlayer(id: string) {
    return this.players.find((p) => p.id === id);
  }

  public getTimer() {
    return this.timer;
  }

  public getRaceStatus() {
    return this.status;
  }

  private isRaceFinished() {
    return this.players.every((player) => player.raceData?.isFinished);
  }

  private getFinishedPlayersCount() {
    return this.players.filter((player) => player.raceData?.isFinished).length;
  }

  private setPlayersPlace() {
    const notFinishedPlayers = this.players.filter(
      (player) => !player.raceData?.isFinished
    );
    notFinishedPlayers.sort((a, b) => {
      if (!a.raceData || !b.raceData) return 0;
      if (a.raceData.currentDocIndex === b.raceData.currentDocIndex) {
        return (b.raceData.completeness ?? 0) - (a.raceData.completeness ?? 0);
      }
      return (
        (b.raceData.currentDocIndex ?? 0) - (a.raceData.currentDocIndex ?? 0)
      );
    });

    const startPlace = this.players.length - notFinishedPlayers.length + 1;
    const finishedPlayers = this.players.map((player) => {
      if (player.raceData?.place) return player;
      const place =
        notFinishedPlayers.findIndex((p) => p.id === player.id) + startPlace;
      return new Player(player.id, player.username, {
        ...player.raceData,
        ...raceDataDefaults,
        place,
        isFinished: true
      });
    });
    this.players = finishedPlayers;
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
