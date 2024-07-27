// src/utils/encodeParams.js
export const encodeParams = (params) => {
  const paramsWithDateAsString = { ...params, date: params.date.toISOString() };
  const jsonString = JSON.stringify(paramsWithDateAsString);
  return btoa(jsonString);
};
