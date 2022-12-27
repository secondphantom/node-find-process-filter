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
export declare const findExactlyByProcessName: (processName: string, options?: Options) => Promise<{
    isExist: boolean;
    taskList: Task[];
}>;
export declare const findByProcessName: (processName: string, options?: Options) => Promise<{
    isExist: boolean;
    taskList: Task[];
}>;
export declare const findByPID: (PID: number, options?: Options) => Promise<{
    isExist: boolean;
    taskList: Task[];
}>;
export declare const getTaskList: () => Promise<Task[]>;
export {};
