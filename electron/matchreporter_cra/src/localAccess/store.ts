import { ipcMain } from 'electron';
import { ASYNC_WITH_PATH_LOADED, FILE_WITH_PATH_LOADED, LOAD_ASYNC_WITH_PATH, LOAD_FILE_WITH_PATH } from './ipcConstants';

// const electronFs = remote.require('fs');
/*
ipcMain.on(LOAD_FILE_WITH_PATH, async (event: any, request: any) => {
    try {
      const fileContent = await electronFs.readFileAsync(request.path);
      event.sender.send(
        `${LOAD_FILE_WITH_PATH}-success-${request.uuid}`, fileContent);
    } catch (error) {
      event.sender.send(
        `${LOAD_FILE_WITH_PATH}-error-${request.uuid}`, error.message);
    }
});
*/
// console.log("fs : ", electronFs);

console.log("store LOAD_ASYNC_WITH_PATH : ", LOAD_ASYNC_WITH_PATH);
ipcMain.on(LOAD_ASYNC_WITH_PATH, (event: any, arg: any) => {
     console.log("LOAD_ASYNC_WITH_PATH:", arg);
     event.sender.send(ASYNC_WITH_PATH_LOADED, 'pong');
});
ipcMain.on(LOAD_FILE_WITH_PATH, (event: any, arg: any) => {
    console.log("LOAD_FILE_WITH_PATH:", arg);
    event.returnValue = FILE_WITH_PATH_LOADED;
});
