const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URI || 'redis://localhost:6379');

module.exports = { connection };
