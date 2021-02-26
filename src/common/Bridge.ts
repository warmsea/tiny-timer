import { IpcRendererEvent } from "electron";

export interface IBridge {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (channel: string, ...args: any[]) => void;
}

interface IBridgedWindow {
  bridge: IBridge;
}

export const Bridge: IBridge = ((window as unknown) as IBridgedWindow).bridge;
