export const enum MessageType {
  Identity = 0x00,
  Clack = 0x01,
  Count = 0x02,
  RateLimit = 0x03,
}

export class Message {
  type: MessageType;

  constructor(type: MessageType) {
    this.type = type;
  }
}

export class MessageIdentity extends Message {
  user: string;

  constructor(user: string) {
    super(MessageType.Identity);
    this.user = user;
  }
}

export class MessageClack extends Message {
  constructor() {
    super(MessageType.Clack);
  }
}

export class MessageCount extends Message {
  count: number;

  constructor(count: number) {
    super(MessageType.Count);
    this.count = count;
  }
}

export class MessageRateLimit extends Message {
  nextRefresh: number;

  constructor(nextRefresh: number) {
    super(MessageType.RateLimit);
    this.nextRefresh = nextRefresh;
  }
}