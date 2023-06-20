import {
  configureStore,
  createSlice,
  createAsyncThunk,
  SerializedError,
  createSelector,
} from "@reduxjs/toolkit";
import { getSavedAuth, saveAuth } from "../utils/localStorage";
import { getTime } from "../utils/getTime";

const { idInstance, apiTokenInstance, ownerPhoneNum } = getSavedAuth();

const initialState: MessengerStateType = {
  idInstance,
  apiTokenInstance,
  chats: [],
  error: null,
  ownerPhoneNum,
  pending: false,
};

export const login = createAsyncThunk(
  "messenger/login",
  async ({ idInstance, apiTokenInstance }: LoginType) => {
    try {
      const response = await fetch(
        `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`
      );
      const data = await response.json();
      const ownerPhoneNum = "+" + data.wid.replace(/\D/g, "");
      return { idInstance, apiTokenInstance, ownerPhoneNum };
    } catch (e) {
      alert(e);
    }
  }
);

export const sendMessage = createAsyncThunk<
  {
    currentChatNumber: string;
    message: string;
  },
  SendMessageType,
  { state: MessengerStateType }
>(
  "messenger/sendMessage",
  async ({ currentChatNumber, message }: SendMessageType, thunkApi) => {
    const state = thunkApi.getState();
    await fetch(
      `https://api.green-api.com/waInstance${state.idInstance}/sendMessage/${state.apiTokenInstance}`,
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

export const receiveMessage = createAsyncThunk<
  receiveMessageReturnType,
  undefined,
  { state: MessengerStateType }
>("messenger/receiveMessage", async (data, thunkApi) => {
  try {
    const state = thunkApi.getState();

    const response = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${state.apiTokenInstance}`
    );
    const data = await response.json();
    if (data) {
      const timestamp = data.body.timestamp;
      const messageTime = getTime(new Date(timestamp * 1000));
      if (data?.receiptId) {
        const receiptId = data?.receiptId.toString();
        await fetch(
          `https://api.green-api.com/waInstance${state.idInstance}/deleteNotification/${state.apiTokenInstance}/${receiptId}`,
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
});

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
    logout: (state) => {
      state.idInstance = null;
      state.apiTokenInstance = null;
      localStorage.removeItem("authState");
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
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload) {
          const idInstance = action.payload.idInstance;
          const apiTokenInstance = action.payload.apiTokenInstance;
          const ownerPhoneNum = action.payload.ownerPhoneNum;
          state.idInstance = idInstance;
          state.apiTokenInstance = apiTokenInstance;
          state.ownerPhoneNum = ownerPhoneNum;
          saveAuth(idInstance, apiTokenInstance, ownerPhoneNum);
          state.error = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error;
      }),
});

const store = configureStore({ reducer: messengerSlice.reducer });

export const messengerActions = messengerSlice.actions;
export default store;

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

type MessengerStateType = {
  idInstance: string | null;
  apiTokenInstance: string | null;
  chats: Array<ChatType>;
  error: SerializedError | null;
  ownerPhoneNum: string | null;
  pending: boolean;
};

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

type SendMessageType = {
  currentChatNumber: string;
  message: string;
};

type LoginType = {
  idInstance: string;
  apiTokenInstance: string;
};

export type receiveMessageReturnType =
  | {
      chatId: string;
      id: string;
      message: string;
      messageTime: string;
    }
  | undefined;
