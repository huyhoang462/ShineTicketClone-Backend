import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const connectString = `mongodb+srv://${username}:${password}@shineticket.whrqihl.mongodb.net/ShineTicket_DB?retryWrites=true&w=majority`;
export default class Database {
  constructor() {
    this.connect();
  }

  connect(type = `mongodb`) {
    if (1 === 1) {
      mongoose.set(`debug`, true);
      mongoose.set(`debug`, { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connected Mongodb Success`))
      .catch((err) => console.log(`Error Connect!`, err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
