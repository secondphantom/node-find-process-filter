"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskList = exports.findByPID = exports.findByProcessName = exports.findExactlyByProcessName = void 0;
const process_1 = __importDefault(require("process"));
const child_process_1 = require("child_process");
const filterOptions = (task, options) => {
    if (options === undefined)
        return true;
    return ((options.processName === undefined
        ? true
        : options.processName === task.processName) &&
        (options.PID === undefined ? true : options.PID === task.PID) &&
        (options.sessionName === undefined
            ? true
            : options.sessionName === task.sessionName) &&
        (options.session === undefined ? true : options.session === task.session) &&
        (options.memoryUsage === undefined
            ? true
            : options.memoryUsage === task.memoryUsage));
};
const findExactlyByProcessName = (processName, options) => __awaiter(void 0, void 0, void 0, function* () {
    const taskList = yield (0, exports.getTaskList)();
    let filteredTaskList = [];
    filteredTaskList = taskList
        .filter(({ processName: eachProcessName }) => eachProcessName === processName)
        .filter((task) => {
        return filterOptions(task, options);
    });
    return {
        isExist: filteredTaskList.length > 0 ? true : false,
        taskList: filteredTaskList,
    };
});
exports.findExactlyByProcessName = findExactlyByProcessName;
const findByProcessName = (processName, options) => __awaiter(void 0, void 0, void 0, function* () {
    const taskList = yield (0, exports.getTaskList)();
    const filteredTaskList = taskList
        .filter(({ processName: eachProcessName }) => eachProcessName
        .toLocaleLowerCase()
        .includes(processName.toLocaleLowerCase()))
        .filter((task) => {
        return filterOptions(task, options);
    });
    return {
        isExist: filteredTaskList.length > 0 ? true : false,
        taskList: filteredTaskList,
    };
});
exports.findByProcessName = findByProcessName;
const findByPID = (PID, options) => __awaiter(void 0, void 0, void 0, function* () {
    const taskList = yield (0, exports.getTaskList)();
    const filteredTaskList = taskList
        .filter(({ PID: eachPID }) => eachPID === PID)
        .filter((task) => {
        return filterOptions(task, options);
    });
    return {
        isExist: filteredTaskList.length > 0 ? true : false,
        taskList: filteredTaskList,
    };
});
exports.findByPID = findByPID;
const getTaskList = () => {
    const cmd = (() => {
        switch (process_1.default.platform) {
            case "win32":
                return `tasklist`;
            // case "darwin":
            //   return `ps -ax | grep ${processName}`;
            // case "linux":
            //   return `ps -A`;
            default:
                return false;
        }
    })();
    return new Promise((resolve, reject) => {
        if (cmd === false)
            return;
        (0, child_process_1.exec)(cmd, (err, stdout, stderr) => {
            if (err)
                reject(err);
            const keyLengths = [];
            const task = {
                processName: "",
                PID: 0,
                sessionName: "",
                session: false,
                memoryUsage: 0,
            };
            const taskList = [];
            stdout.split("\r\n").forEach((line, index) => {
                if (index < 2)
                    return;
                if (index === 2) {
                    line.split(" ").forEach((str) => {
                        keyLengths.push(str.length);
                    });
                }
                const newTask = Object.assign({}, task);
                keyLengths.reduce((acc, cur, index) => {
                    const value = line
                        .slice(acc, acc + cur)
                        .trimStart()
                        .trimEnd();
                    switch (index) {
                        case 0:
                            newTask.processName = value;
                            break;
                        case 1:
                            newTask.PID = parseInt(value);
                            break;
                        case 2:
                            newTask.sessionName = value;
                            break;
                        case 3:
                            newTask.session = !!parseInt(value);
                            break;
                        case 4:
                            newTask.memoryUsage = parseInt(value.replace(",", "").replace("K", ""));
                            break;
                    }
                    return acc + cur + 1;
                }, 0);
                taskList.push(newTask);
            });
            resolve(taskList);
        });
    });
};
exports.getTaskList = getTaskList;
