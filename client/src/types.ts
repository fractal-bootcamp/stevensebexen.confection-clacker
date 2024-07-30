// export type GetClacksResponse = {
//   count: number;
// }

// export enum PostClacksResponseCode {
//   Ok,
//   RateLimitReached,
// }

// export type PostClackResponse = {
//   code: PostClacksResponseCode;
// }

export enum MessageType {
  Identity = 0x00,
  Clack = 0x01
}

export class Message {
  messageType: MessageType;

  constructor(messageType: MessageType) {
    this.messageType = messageType;
  }
}

export class IdentityMessage extends Message {
  user: string;

  constructor(user: string) {
    super(MessageType.Identity);
    this.user = user;
  }
}

export class ClackMessage extends Message {
  constructor() {
    super(MessageType.Clack);
  }
}