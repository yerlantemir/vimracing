import {
  Player as PlayerType,
  SharedCompletedDocsPayload
} from '@vimracing/shared';
import { DEFAULT_RACE_TIME_IN_S } from '../../shared/defaults';

// be careful when assigning default values to raceData, it can be shared between players
export const raceDataDefaults = {
  completeness: 0,
  currentDocIndex: 0,
  isFinished: false
};

export class Player implements PlayerType {
  id: string;
  username: string;
  raceData?: {
    completeness: number;
    currentDocIndex: number;
    completedDocs: ({
      doc?: string[];
    } & SharedCompletedDocsPayload)[];
    place?: number;
    isFinished: boolean;
  };

  constructor(id: string, username: string, raceData?: PlayerType['raceData']) {
    this.id = id;

    this.username = username;
    this.raceData = raceData ?? { ...raceDataDefaults, completedDocs: [] };
  }

  updateDoc(
    newDoc: string[],
    newCompleteness: number,
    sharedDocPayload?: SharedCompletedDocsPayload // if exists, it means that this doc was completed
  ) {
    if (!this.raceData) return;
    this.raceData.completedDocs[this.raceData.currentDocIndex] = {
      doc: newDoc,
      executedCommands: sharedDocPayload?.executedCommands ?? [],
      keysCount: sharedDocPayload?.keysCount ?? 0,
      seconds: DEFAULT_RACE_TIME_IN_S - (sharedDocPayload?.seconds ?? 0)
    };

    if (newCompleteness === 100) {
      this.raceData.currentDocIndex++;
      this.raceData.completeness = 0;
    } else {
      this.raceData.completeness = newCompleteness;
    }
  }

  finishRace(place: number) {
    if (this.raceData) {
      this.raceData = {
        ...this.raceData,
        isFinished: true,
        place
      };
    }
    return true;
  }

  updateUsername(newUsername: string) {
    this.username = newUsername;
  }

  getSharedCompletedDocsData(): SharedCompletedDocsPayload[] {
    return (
      this.raceData?.completedDocs?.map((completedDocPayload) => {
        return {
          keysCount: completedDocPayload.keysCount,
          seconds: completedDocPayload.seconds,
          executedCommands: completedDocPayload.executedCommands
        };
      }) ?? []
    );
  }
}
