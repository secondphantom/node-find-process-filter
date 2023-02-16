# Find Process Filter
Find Process by Name or with options

# Table of Contents
- [Find Process Filter](#find-process-filter)
- [Table of Contents](#table-of-contents)
- [Support](#support)
- [Input \& Return](#input--return)
			- [`processName` : string](#processname--string)
			- [`PID`: number](#pid-number)
			- [`options`: object](#options-object)
			- [`return`: Array of Task](#return-array-of-task)
- [Functions](#functions)
	- [`findByProcessName(string,options)`](#findbyprocessnamestringoptions)
	- [`findExactlyByProcessName(string,options?)`](#findexactlybyprocessnamestringoptions)
	- [`findByPID(number)`](#findbypidnumber)
	- [`getTaskList()`](#gettasklist)

# Support
- Windows
# Input & Return
#### `processName` : string
#### `PID`: number
#### `options`: object
```ts
{
	processName: string;
	PID: number;
	sessionName: string;
	session: boolean;
	memoryUsage: number;
}
```
#### `return`: Array of Task
```ts
type Task = {
  processName: string;
  PID: number;
  sessionName: string;
  session: boolean;
  memoryUsage: number;
}
```
# Functions
## `findByProcessName(string,options)`
find process name list that contains `processName`

Input: [`processName`](#processname--string), [`options?`](#options-object)
> `options` is optional

Return: [`return`](#return-array-of-task)
```ts
const result = findByProcessName("notepad")
```
## `findExactlyByProcessName(string,options?)`
find process name list that same `processName`

Input: [`processName`](#processname--string), [`options?`](#options-object)
> `options` is optional

Return: [`return`](#return-array-of-task)
```ts
const result = findExactlyByProcessName("notepad.exe")
```
## `findByPID(number)`
find PID that same `PID`

Input: [`PID`](#pid-number)

Return: [`return`](#return-array-of-task)
```ts
const result = findByPID(28332)
```
## `getTaskList()`
Get all running process

Return: [`return`](#return-array-of-task)
```ts
const result = await getTaskList();
```
