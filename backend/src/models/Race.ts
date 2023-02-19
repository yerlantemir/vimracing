import { Schema, model } from 'mongoose';
import { IUser, UserSchema } from './User';

interface IRace {
  id: string;
  users: Array<IUser>;
  title: string;
  doc: { start: string[]; goal: string[] };
}

const RaceSchema = new Schema<IRace>({
  id: { type: String, required: true },
  title: String,
  doc: {
    start: [],
    goal: []
  },
  users: UserSchema
});

const RaceModel = model('Race', RaceSchema);

export { IRace, RaceSchema, RaceModel };
