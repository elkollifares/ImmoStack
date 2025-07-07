import { Message } from "./message.model";

export class Conversation {
    id!: number;
    user1Id!: number;
    user2Id!: number;
    dateCreated!: Date;
    messages: Message[] = [];
  }
  