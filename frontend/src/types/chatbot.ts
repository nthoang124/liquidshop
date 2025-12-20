export interface IChatMessage {
  role: "user" | "model" | "bot";
  content: string;
  _id?: string;
  createdAt?: string;
}

export interface IChatHistoryResponse {
  session: {
    _id: string;
    messages: IChatMessage[];
  };
}
