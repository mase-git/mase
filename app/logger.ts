import winston, { createLogger, format, transports } from 'winston';


let currentTime : String = new Date().toISOString(); 

const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      })
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: `logs/app-${currentTime}.log` })
    ]
  });
  
  export default logger;