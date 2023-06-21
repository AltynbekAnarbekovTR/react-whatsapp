export type ChatType = {
  chatPhoneNum: string;
  avatarUrl: string;
  messages: Array<MessageType>;
};

export type MessageType = {
  id: string;
  message: string;
  sentByOwner: boolean;
  messageTime: string;
};
