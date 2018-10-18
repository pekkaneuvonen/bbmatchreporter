import { RootState } from "@red/index";
import { ipcRenderer } from "electron";

export type counterActions = increment | decrement;

interface increment {
  type: string;
}

interface decrement {
  type: string;
}

const increment = () => ({
  type: "INCREMENT_COUNTER"
});

const decrement = () => ({
  type: "DECREMENT_COUNTER"
});

const incrementIfOdd = () => {
  return (
    dispatch: (action: counterActions) => void,
    getState: () => RootState
  ) => {
    const { counter } = getState().counter;

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
};

const incrementAsync = (delay: number = 1000) => {
  return (dispatch: (action: counterActions) => void) => {
    console.log(ipcRenderer.sendSync("custom-sync-message", " Rock!"));
    ipcRenderer.on("custom-reply", (event: any, arg: any) => {
      console.log(arg);
      if (event) {
        console.log("event: " + event);
      }
    })
    ipcRenderer.send("custom-message", " Until you drop!");

    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
};

export const actionCreators = {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync
};
