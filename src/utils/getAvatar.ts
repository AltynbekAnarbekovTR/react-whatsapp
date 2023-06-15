export const getAvatar = () => {
  const seed = Math.floor(Math.random() * 5000);
  return `https://avatars.dicebear.com/api/human/${seed}.svg`;
};
