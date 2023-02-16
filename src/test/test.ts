import {
  findByPID,
  findByProcessName,
  findExactlyByProcessName,
  getTaskList,
} from "..";

(async () => {
  let result = await findByProcessName("notepad");
  console.log(result);
  result = await findExactlyByProcessName("notepad.exe");
  console.log(result);
  result = await findExactlyByProcessName("notepad.exe", { PID: 31832 });
  console.log(result);
  result = await findByPID(28332);
  console.log(result);
  const result2 = await getTaskList();
  console.log(result2);
})();
