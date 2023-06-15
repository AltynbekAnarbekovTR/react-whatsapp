import {
  configureStore,
  createSlice,
  createAsyncThunk,
  SerializedError,
  createSelector,
} from "@reduxjs/toolkit";
import { loadState } from "../utils/localStorage-utils";

const { idInstance, apiTokenInstance, ownerPhoneNum } = loadState();

const initialState: MessengerStateType = {
  idInstance,
  apiTokenInstance,
  chats: [],
  error: null,
  ownerPhoneNum,
  // loggedIn: false,
};

export const login = createAsyncThunk(
  "messenger/login",
  async ({ idInstance, apiTokenInstance }: LoginType, thunkApi) => {
    const state = thunkApi.getState() as RootStateType;
    const response = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`
    );
    const data = await response.json();
    const ownerPhoneNum = "+" + data.wid.replace(/\D/g, "");
    return { idInstance, apiTokenInstance, ownerPhoneNum };
  }
);

export const sendMessage = createAsyncThunk(
  "messenger/sendMessage",
  async ({ currentChatNumber, message }: SendMessageType, thunkApi) => {
    const state = thunkApi.getState() as RootStateType;
    const response = await fetch(
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

    const data = await response.json();
    // data = data.join("").replace(/\s{2,}/g, " ");
    return { currentChatNumber, message };
  }
);

export const receiveMessage = createAsyncThunk(
  "messenger/receiveMessage",
  async (params, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootStateType;
      const response = await fetch(
        `https://api.green-api.com/waInstance${state.idInstance}/receiveNotification/${state.apiTokenInstance}`
      );

      const data = await response.json();
      console.log(data);
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
      if (data?.body.messageData.textMessageData.textMessage) {
        const chatId = data.body.senderData.chatId.replace(/\D/g, "");
        const id = data.receiptId.toString();
        const message = data.body.messageData.textMessageData.textMessage;
        console.log("{chatId, message}: ", { chatId, message });

        return { chatId, message };
      }
    } catch (error) {
      console.log("error: ", error);
    }
    return null;
  }
);

const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    addChat: (state, action) => {
      if (
        !state.chats.find((chat) => {
          chat.chatPhoneNum === action.payload;
        })
      ) {
        state.chats.push({ chatPhoneNum: action.payload, messages: [] });
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
          });
        }
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(receiveMessage.fulfilled, (state, action) => {
        console.log("action.payload: ", action.payload);
        console.log("state.chats.: ", state.chats);
        if (action.payload) {
          const chatIndex = state.chats.findIndex(
            (chat) => chat.chatPhoneNum === action.payload.chatId
          );
          if (chatIndex > -1) {
            state.chats[chatIndex].messages.push({
              id: "id" + Math.random().toString(16).slice(3),
              message: action.payload.message,
              sentByOwner: true,
            });
          }
        }
        state.error = null;
      })
      .addCase(receiveMessage.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.idInstance = action.payload.idInstance;
        state.apiTokenInstance = action.payload.apiTokenInstance;
        state.ownerPhoneNum = action.payload.ownerPhoneNum;
        // state.loggedIn = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error;
      }),
});

const store = configureStore({ reducer: messengerSlice.reducer });

export const messengerActions = messengerSlice.actions;
export default store;

const selectIdInstance = (state: RootStateType) => state.idInstance;
const selectApiTokenInstance = (state: RootStateType) => state.apiTokenInstance;

export const selectLoggedIn = createSelector(
  [selectIdInstance, selectApiTokenInstance],
  (idInstance, apiTokenInstance) => idInstance && apiTokenInstance
);

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

type MessengerStateType = {
  idInstance: string | null;
  apiTokenInstance: string | null;
  chats: Array<ChatType>;
  error: SerializedError | null;
  ownerPhoneNum: string | null;
  // loggedIn: boolean;
};

type ChatType = {
  chatPhoneNum: string;
  messages: Array<MessageType>;
};

type MessageType = {
  id: string;
  message: string;
  sentByOwner: boolean;
};

type SendMessageType = {
  currentChatNumber: string;
  message: string;
};

type LoginType = {
  idInstance: string;
  apiTokenInstance: string;
};
