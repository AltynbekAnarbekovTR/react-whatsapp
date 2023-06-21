import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import { getTime } from "../utils/getTime";
import { RootStateType } from "./store";
import { ChatType } from "../types/types";

const initialState: MessengerStateType = {
  chats: [],
  error: null,
  pending: false,
};

export const sendMessage = createAsyncThunk(
  "messenger/sendMessage",
  async ({ currentChatNumber, message }: SendMessageType, thunkApi) => {
    const state = thunkApi.getState() as RootStateType;
    await fetch(
      `https://api.green-api.com/waInstance${state.auth.idInstance}/sendMessage/${state.auth.apiTokenInstance}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: `${currentChatNumber}@c.us`,
          message: message,
        }),
      }
    );
    return { currentChatNumber, message };
  }
);

export const receiveMessage = createAsyncThunk(
  "messenger/receiveMessage",
  async (data, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootStateType;

      const response = await fetch(
        `https://api.green-api.com/waInstance${state.auth.idInstance}/receiveNotification/${state.auth.apiTokenInstance}`
      );
      const data = await response.json();
      if (data) {
        const timestamp = data.body.timestamp;
        const messageTime = getTime(new Date(timestamp * 1000));
        if (data?.receiptId) {
          const receiptId = data?.receiptId.toString();
          await fetch(
            `https://api.green-api.com/waInstance${state.auth.idInstance}/deleteNotification/${state.auth.apiTokenInstance}/${receiptId}`,
            {
              method: "DELETE",
              redirect: "follow",
            }
          );
        }
        if (data?.body.messageData.textMessageData) {
          const chatId = data.body.senderData.chatId.replace(/\D/g, "");
          const receiptId = data.receiptId.toString();
          const message = data.body.messageData.textMessageData.textMessage;

          return { chatId, id: receiptId, message, messageTime };
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }
);

const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    addChat: (state, action) => {
      if (
        !state.chats.find(
          (chat) => chat.chatPhoneNum === action.payload.phoneNumInput
        )
      ) {
        const seed = Math.floor(Math.random() * 5000);
        const avatarUrl = `https://avatars.dicebear.com/api/adventurer-neutral/${seed}.svg`;

        state.chats.push({
          chatPhoneNum: action.payload.phoneNumInput,
          avatarUrl,
          messages: [],
        });
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        const chatIndex = state.chats.findIndex(
          (chat) => chat.chatPhoneNum === action.payload.currentChatNumber
        );
        if (chatIndex > -1) {
          state.chats[chatIndex].messages.push({
            id: "id" + Math.random().toString(16).slice(3),
            message: action.payload.message,
            sentByOwner: true,
            messageTime: getTime(new Date()),
          });
        }
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(receiveMessage.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(receiveMessage.fulfilled, (state, action) => {
        if (action.payload) {
          const chatIndex = state.chats.findIndex(
            (chat) => chat.chatPhoneNum === action.payload?.chatId
          );
          if (chatIndex > -1) {
            state.chats[chatIndex].messages.push({
              id: action.payload.id,
              message: action.payload.message,
              sentByOwner: false,
              messageTime: action.payload.messageTime,
            });
          }
        }
        state.error = null;
        state.pending = false;
      })
      .addCase(receiveMessage.rejected, (state, action) => {
        state.error = action.error;
        state.pending = false;
      }),
});

export const messengerActions = messengerSlice.actions;
export const messengerAsyncActions = { sendMessage, receiveMessage };
export const messengerReducer = messengerSlice.reducer;

type MessengerStateType = {
  chats: Array<ChatType>;
  error: SerializedError | null;
  pending: boolean;
};

type SendMessageType = {
  currentChatNumber: string;
  message: string;
};
