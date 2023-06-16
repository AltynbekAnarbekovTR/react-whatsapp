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

const getTime = (date: Date) => {
  const day = date.getDate(); // Get the day (1-31)
  const month = date.getMonth() + 1; // Get the month (0-11) and add 1 to make it 1-12
  const year = date.getFullYear(); // Get the four-digit year
  const hours = date.getHours(); // Get the hours (0-23)
  const minutes = date.getMinutes(); // Get the minutes (0-59)

  const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedTime;
};

export const login = createAsyncThunk(
  "messenger/login",
  async ({ idInstance, apiTokenInstance }: LoginType, thunkApi) => {
    const state = thunkApi.getState() as RootStateType;
    const response = await fetch(
      `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`
    );
    const data = await response.json();
    console.log(data);

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
      console.log("response.ok: ", response.ok);
      const data = await response.json();
      console.log("received message: ", data);
      if (data) {
        const timestamp = data.body.timestamp;
        // const messageTime = new Date(timestamp * 1000).toLocaleString();
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
