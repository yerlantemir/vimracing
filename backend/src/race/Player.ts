import {
  Player as PlayerType,
  SharedCompletedDocsPayload
} from '@vimracing/shared';

export class Player implements PlayerType {
  id: string;
  username: string;
  raceData?: {
    completeness?: number;
    currentDocIndex?: number;
    completedDocs?: ({
      doc?: string[];
    } & SharedCompletedDocsPayload)[];
    place?: number;
    isFinished?: boolean;
  };

  constructor(id: string, username: string, raceData?: PlayerType['raceData']) {
    this.id = id;

    this.username = username;
    this.raceData = raceData ?? {
      completeness: 0,
      currentDocIndex: 0,
      completedDocs: [],
      isFinished: false
    };
  }

  updateDoc(
    newDoc: string[],
    docIndex: number,
    newCompleteness: number,
    sharedDocPayload?: SharedCompletedDocsPayload
  ) {
    let newDocs: NonNullable<Player['raceData']>['completedDocs'] = [];
    // update existing one
    if (this.raceData?.completedDocs?.[docIndex]?.doc) {
      newDocs = this.raceData.completedDocs.map(
        (completedDocPayload, index) => {
          if (index === docIndex) {
            return {
              ...completedDocPayload,
              ...(sharedDocPayload && sharedDocPayload),
              doc: newDoc
            };
          }
          return completedDocPayload;
        }
      );
    } else {
      newDocs = [
        ...(this.raceData?.completedDocs ?? []),
        {
          doc: newDoc,
          executedCommands: sharedDocPayload?.executedCommands ?? [],
          keysCount: sharedDocPayload?.keysCount ?? 0,
          seconds: sharedDocPayload?.seconds ?? 0
        }
      ];
    }

    if (this.raceData) {
      this.raceData = {
        ...this.raceData,
        completedDocs: newDocs,
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
