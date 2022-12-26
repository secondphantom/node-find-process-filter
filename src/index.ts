import process from "process";
import { exec } from "child_process";

type Task = {
  processName: string;
  PID: number;
  sessionName: string;
  session: boolean;
  memoryUsage: number;
};

type Options = {
  [key in keyof Task]?: Task[key];
};

const filterOptions = (task: Task, options?: Options) => {
  if (options === undefined) return true;
  return (
    (options.processName === undefined
      ? true
      : options.processName === task.processName) &&
    (options.PID === undefined ? true : options.PID === task.PID) &&
    (options.sessionName === undefined
      ? true
      : options.sessionName === task.sessionName) &&
    (options.session === undefined ? true : options.session === task.session) &&
    (options.memoryUsage === undefined
      ? true
      : options.memoryUsage === task.memoryUsage)
  );
};

export const findExactlyByProcessName = async (
  processName: string,
  options?: Options
) => {
  const taskList = await getTaskList();
  let filteredTaskList: Task[] = [];

  filteredTaskList = taskList
    .filter(
      ({ processName: eachProcessName }) => eachProcessName === processName
    )
    .filter((task) => {
      return filterOptions(task, options);
    });

  return {
    isExist: filteredTaskList.length > 0 ? true : false,
    taskList: filteredTaskList,
  };
};

export const findByProcessName = async (
  processName: string,
  options?: Options
) => {
  const taskList = await getTaskList();
  const filteredTaskList = taskList
    .filter(({ processName: eachProcessName }) =>
      eachProcessName
        .toLocaleLowerCase()
        .includes(processName.toLocaleLowerCase())
    )
    .filter((task) => {
      return filterOptions(task, options);
    });
  return {
    isExist: filteredTaskList.length > 0 ? true : false,
    taskList: filteredTaskList,
  };
};

export const findByPID = async (PID: number, options?: Options) => {
  const taskList = await getTaskList();
  const filteredTaskList = taskList
    .filter(({ PID: eachPID }) => eachPID === PID)
    .filter((task) => {
      return filterOptions(task, options);
    });
  return {
    isExist: filteredTaskList.length > 0 ? true : false,
    taskList: filteredTaskList,
  };
};

export const getTaskList = () => {
  const cmd = (() => {
    switch (process.platform) {
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

  return new Promise<Task[]>((resolve, reject) => {
    if (cmd === false) return;

    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(err);
      const keyLengths: number[] = [];
      const task: Task = {
        processName: "",
        PID: 0,
        sessionName: "",
        session: false,
        memoryUsage: 0,
      };
      const taskList: Task[] = [];

      stdout.split("\r\n").forEach((line, index) => {
        if (index < 2) return;
        if (index === 2) {
          line.split(" ").forEach((str) => {
            keyLengths.push(str.length);
          });
        }
        const newTask = { ...task };
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
              newTask.memoryUsage = parseInt(
                value.replace(",", "").replace("K", "")
              );
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
