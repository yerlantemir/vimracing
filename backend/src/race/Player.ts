import { ExecutedCommand, Player as PlayerType } from '@vimracing/shared';

export class Player implements PlayerType {
  id: string;
  username: string;
  raceData?: {
    completeness?: number;
    currentDocIndex?: number;
    docs?: string[][];
    currentPlace?: number;
    executedCommands?: ExecutedCommand[][];
    isFinished?: boolean;
  };

  constructor(id: string, username: string) {
    this.id = id;

    this.username = username;
    this.raceData = {
      completeness: 0,
      currentDocIndex: 0,
      docs: [],
      currentPlace: 0
    };
  }

  updateDoc(newDoc: string[], docIndex: number, newCompleteness: number) {
    if (this.raceData) {
      this.raceData = {
        ...this.raceData,
        docs: this.raceData.docs?.map((doc, index) => {
          if (index === docIndex) {
            return newDoc;
          }
          return doc;
        }),
        completeness: newCompleteness,
        currentDocIndex: docIndex
      };
    }
  }

  finishRace(executedCommands: ExecutedCommand[][]) {
    if (!this._canFinishRace()) return false;

    if (this.raceData) {
      this.raceData = {
        ...this.raceData,
        executedCommands,
        isFinished: true
      };
      return true;
    }
  }

  _canFinishRace(): boolean {
    if (!this.raceData || !this.raceData.docs) return false;

    const { currentDocIndex, docs, completeness } = this.raceData;
    return currentDocIndex === docs?.length - 1 && completeness === 100;
  }

  updateUsername(newUsername: string) {
    this.username = newUsername;
  }
}
