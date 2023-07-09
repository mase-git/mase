"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./logger"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// Use the logger middleware
app.use((0, morgan_1.default)('dev'));
// define the static folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Middleware to log requests
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.url}`);
    next();
});
app.get('/', (req, res) => {
    logger_1.default.info('Received request to /');
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    logger_1.default.info(`Server is running on port ${port}`);
});
