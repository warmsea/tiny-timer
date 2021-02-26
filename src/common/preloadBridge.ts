import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

export function preloadBridge(): void {
  contextBridge.exposeInMainWorld("bridge", {
    on: (
      channel: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listener: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on(channel, listener);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: (channel: string, ...args: any[]) => {
      ipcRenderer.send(channel, ...args);
    },
  });
}
