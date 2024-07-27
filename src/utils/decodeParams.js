// src/utils/decodeParams.js
export const decodeParams = (encodedString) => {
  const jsonString = atob(encodedString);
  const params = JSON.parse(jsonString);
  return { ...params, date: new Date(params.date) };
};
