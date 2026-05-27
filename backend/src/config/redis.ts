import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);

// If REDIS_HOST contains a full URL, use it directly
export const redisConnection = REDIS_HOST.startsWith("redis") 
  ? new Redis(REDIS_HOST, { maxRetriesPerRequest: null })
  : new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      maxRetriesPerRequest: null,
    });

redisConnection.on("error", (err) => {
  console.error("Redis error:", err);
});

redisConnection.on("connect", () => {
  console.log("Redis connected successfully");
});
