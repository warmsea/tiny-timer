import { IpcRendererEvent } from "electron";

export interface IBridge {
  on: (
    channel: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (channel: string, ...args: any[]) => void;
}

interface IBridgedWindow {
  bridge: IBridge;
}

export const Bridge: IBridge = ((window as unknown) as IBridgedWindow).bridge;
