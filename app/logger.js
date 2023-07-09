"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
let currentTime = new Date().toISOString();
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: `logs/app-${currentTime}.log` })
    ]
});
exports.default = logger;
