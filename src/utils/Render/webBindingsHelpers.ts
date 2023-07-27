import type { Event } from "electron";
import { ipcRenderer } from "electron";

export const postCallbackMessageToMainProcess = (channel: string, ...args: any[]) => {
  ipcRenderer.send(`web-callback:${channel}`, ...args);
};

export const sendMsgToMain = (msg: string, ...data: any[]) => {
  console.log(`sendMsgToMain, msg: "${msg}", args: `, data);
  ipcRenderer.send(msg, ...data);
};

export const registerCallbackWithMainProcess = (() => {
  let nextCallbackID = 0;
  const registeredCallbacks = new Map();

  ipcRenderer.on("handleCallback", (event: Event, callbackID: number, result: any) => {
    const registeredCallback = registeredCallbacks.get(callbackID);
    if (registeredCallback) {
      registeredCallback(result);
    } else {
      console.error("[desktop] unexpected callback", callbackID);
    }
  });

  return function (channel: string, args: any, callback: (result: any) => void) {
    const callbackID = nextCallbackID++;
    registeredCallbacks.set(callbackID, callback);

    ipcRenderer.send(`web-callback:${channel}`, args, callbackID);

    return () => {
      // TODO: this message is not handled anywhere
      ipcRenderer.send("web-cancel-callback", callbackID);
      registeredCallbacks.delete(callbackID);
    };
  };
})();
