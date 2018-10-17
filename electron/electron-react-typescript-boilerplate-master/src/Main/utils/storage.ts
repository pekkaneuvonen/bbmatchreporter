import { ipcMain, BrowserWindow } from "electron";

export default class Storage {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  public setupStorage(): void {
    ipcMain.on("custom-sync-message", (event: any, arg: any) => {
      console.log(arg);
      event.returnValue = 'Until you drop!'
    });
    
    ipcMain.on("custom-message", (event: any, arg: any) => {
      console.log("Storage here: " + arg);
      if (event) {
        console.log("event: " + event);
      }
      event.sender.send('custom-reply', 'Rock!')
    });

    console.log("storage set!");
  }
}
