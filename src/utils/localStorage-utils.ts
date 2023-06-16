export const getSavedAuth = () => {
  const authState = localStorage.getItem("authState");
  if (authState === null) {
    return { idInstance: null, apiTokenInstance: null, ownerPhoneNum: null };
  }

  return JSON.parse(authState);
};

export const saveAuth = (
  idInstance: string,
  apiTokenInstance: string,
  ownerPhoneNum: string
) => {
  const serializedState = JSON.stringify({
    idInstance,
    apiTokenInstance,
    ownerPhoneNum,
  });

  localStorage.setItem("authState", serializedState);
};
