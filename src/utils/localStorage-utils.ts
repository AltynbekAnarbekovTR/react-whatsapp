export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return { idInstance: null, apiTokenInstance: null, ownerPhoneNum: null };
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};
