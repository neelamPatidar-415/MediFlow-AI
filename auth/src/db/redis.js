const { Redis } = require("ioredis");

// During tests or when no Redis config is provided, export a lightweight stub
// to avoid ioredis connection attempts and retry errors.
if (process.env.NODE_ENV === 'test' || !process.env.REDIS_HOST) {
    const noopRedis = {
        async set() { return 'OK'; },
        async get() { return null; },
        async del() { return 0; },
        on() {},
    };
    module.exports = noopRedis;
} else {
    const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    });

    redis.on("connect", ()=>{
        console.log("Connected to redis");
    });

    module.exports = redis;
}