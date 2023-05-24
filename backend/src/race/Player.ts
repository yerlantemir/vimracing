import { Player as PlayerType } from '@vimracing/shared';

export class Player implements PlayerType {
  id: string;
  username: string;
  raceData?: {
    completeness?: number;
    currentDocIndex?: number;
    docs?: string[][];
    currentPlace?: number;
  };

  constructor(id: string) {
    this.id = id;
    this.username = this.getRandomUsername();
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
  updateUsername(newUsername: string) {
    this.username = newUsername;
  }

  private getRandomUsername() {
    const usernames = ['bob', 'martin', 'jack', 'john', 'zan', 'jason'];
    return usernames[Math.floor(Math.random() * usernames.length)];
  }
}
