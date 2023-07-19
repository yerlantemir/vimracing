import { ExecutedCommand, Player as PlayerType } from '@vimracing/shared';

export class Player implements PlayerType {
  id: string;
  username: string;
  raceData?: {
    completeness?: number;
    currentDocIndex?: number;
    docs?: string[][]; // TODO: probably should be deleted
    place?: number;
    executedCommands?: ExecutedCommand[][];
    isFinished?: boolean;
  };

  constructor(id: string, username: string, raceData?: PlayerType['raceData']) {
    this.id = id;

    this.username = username;
    this.raceData = raceData ?? {
      completeness: 0,
      currentDocIndex: 0,
      docs: [],
      isFinished: false
    };
  }

  updateDoc(
    newDoc: string[],
    docIndex: number,
    newCompleteness: number,
    executedCommands?: ExecutedCommand[] // send only when docIndex is changed
  ) {
    let newDocs = [];
    // update existing one
    if (this.raceData?.docs?.[docIndex]) {
      newDocs = this.raceData.docs.map((doc, index) => {
        if (index === docIndex) {
          return newDoc;
        }
        return doc;
      });
    } else {
      newDocs = [...(this.raceData?.docs ?? []), newDoc];
    }

    if (this.raceData) {
      this.raceData = {
        ...this.raceData,
        docs: newDocs,
        ...(executedCommands && {
          executedCommands: this.raceData.executedCommands
            ? [...this.raceData.executedCommands, executedCommands]
            : [executedCommands]
        }),
        completeness: newCompleteness,
        currentDocIndex: docIndex
      };
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
}
