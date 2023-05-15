export class Player {
  constructor(
    public id: string,
    public username: string,
    public raceDoc: string[]
  ) {}

  updateDoc(newDoc: string[]) {
    this.raceDoc = newDoc;
  }
}
