import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import {
  ColorStyle,
  getColorStyle,
  getDisplayNumber,
  TimerDisplay,
} from "./TimerDisplay";

function doNothing() {
  // Do nothing
}

describe("getDisplayNumber", () => {
  it("should return seconds when within a hour", () => {
    expect(getDisplayNumber(3599)).toBe(3599);
    expect(getDisplayNumber(1)).toBe(1);
    expect(getDisplayNumber(0)).toBe(0);
    expect(getDisplayNumber(-1)).toBe(-1);
    expect(getDisplayNumber(-3599)).toBe(-3599);
  });

  it("should return minutes when reaching a hour", () => {
    expect(getDisplayNumber(3601)).toBe(61);
    expect(getDisplayNumber(3600)).toBe(60);
    expect(getDisplayNumber(-3600)).toBe(-60);
  });
});

describe("getColorStyle", () => {
  it("should return Normal with more than 30 seconds remaining", () => {
    expect(getColorStyle(31)).toBe(ColorStyle.Normal);
  });

  it("should return Normal with 1 - 30 seconds remaining", () => {
    expect(getColorStyle(30)).toBe(ColorStyle.Warn);
    expect(getColorStyle(1)).toBe(ColorStyle.Warn);
  });

  it("should return Normal with no more second remaining", () => {
    expect(getColorStyle(0)).toBe(ColorStyle.TimeOut);
    expect(getColorStyle(-1)).toBe(ColorStyle.TimeOut);
  });
});

describe("TimerDisplay", () => {
  let container: HTMLDivElement = null;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  function createMockBridge(mockSeconds: number) {
    return {
      send: doNothing,
      on: (_: string, listener: (event: undefined, seconds: number) => void) =>
        listener(undefined, mockSeconds),
    };
  }

  it("should show 00:00 on initial state", () => {
    act(() => {
      render(
        <TimerDisplay bridge={{ send: doNothing, on: doNothing }} />,
        container
      );
    });
    expect(container.textContent).toBe("00:00");
  });

  it("should pad numbers to 2 digits", () => {
    act(() => {
      render(<TimerDisplay bridge={createMockBridge(61)} />, container);
    });
    expect(container.textContent).toBe("01:01");
  });

  it("should show a minus sign for negtive seconds", () => {
    act(() => {
      render(<TimerDisplay bridge={createMockBridge(-1)} />, container);
    });
    expect(container.textContent).toBe("-00:01");
  });
});
