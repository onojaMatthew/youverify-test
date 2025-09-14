
import { redis } from "../config/redis";
import { pagination } from "./pagination";

const cache = {
  get: async (key) => {
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  },

  set: async (key, data, ttl = 3600) => {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  },

  invalidate: async (key) => {
    await redis.del(key);
  },

  clear: async () => {
    await redis.flushall();
  },
};

export { cache }



export const getCachedData = async (key, query, pagination_data, model, ttl = 3600) => {
  const cachedData = await cache.get(key);

  if (cachedData) {
    console.log("cache hit!");
    return cachedData;
  }
  console.log("cache missed!")
  const data = await model.paginate(query, pagination_data);
  await cache.set(key, data, ttl);
  return data;
};

export const getSingleCachedData = async (key, query, model, ttl = 3600) => {
  const cachedData = await cache.get(key);

  if (cachedData) {
    console.log("cache hit!")
    return cachedData;
  }
  console.log("cache missed!")
  const data = await model.findOne(query).exec();
  await cache.set(key, data, ttl);

  return data;
};

export const getAggregateCachedData = async (key, query, model, ttl = 3600) => {
  const cachedData = await cache.get(key);

  if (cachedData) {
    console.log("cache hit!")
    return cachedData;
  }
  console.log("cache missed!")
  const data = await model.aggregate(query);
  await cache.set(key, data, ttl);

  return data;
};