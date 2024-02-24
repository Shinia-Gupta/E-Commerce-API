import fs from "fs";
import winston from "winston";

//WAY 1
// const fsPromise = fs.promises;
// async function log(logData) {
//   try {
//     logData = `\n ${new Date().toString()} - ${logData}`;
//     await fsPromise.appendFile("log.txt", logData);
//   } catch (error) {
//     console.log(error);
//   }
// }

//WAY 2-WINSTON LIBRARY
const logger=winston.createLogger({
  level:'info',
  format:winston.format.json(),
  defaultMeta:{service:'request-logging'},
  transports:[
    new winston.transports.File({filename:'winstonlogs.txt'})
  ]

})

const loggerMiddleware = async (req, res, next) => {
  //1. log request body
  if (!req.url.includes("signin")) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    // await log(logData);
    logger.info(logData);
}
    next();

};

export default loggerMiddleware;
