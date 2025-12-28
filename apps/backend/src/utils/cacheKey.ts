export const createCacheKey = (prefix: string, userId: string, extraParams: string = '') => {
  return `${prefix}:${userId}${extraParams ? `:${extraParams}` : ''}`;
};