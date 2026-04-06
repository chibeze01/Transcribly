import { exec } from "child_process";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

const mockedExec = exec as unknown as jest.Mock;

import {
  checkFfmpeg,
  checkPython,
  getFfmpegInstallMessage,
  getPythonInstallMessage,
} from "./dependencies";

describe("checkFfmpeg", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns true when ffmpeg is available", async () => {
    mockedExec.mockImplementation((_cmd: string, cb: Function) => cb(null));
    expect(await checkFfmpeg()).toBe(true);
  });

  it("returns false when ffmpeg is not available", async () => {
    mockedExec.mockImplementation((_cmd: string, cb: Function) =>
      cb(new Error("not found"))
    );
    expect(await checkFfmpeg()).toBe(false);
  });
});

describe("checkPython", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns true when python3 is available", async () => {
    mockedExec.mockImplementation((cmd: string, cb: Function) => {
      if (cmd === "python3 --version") return cb(null);
      cb(new Error("not found"));
    });
    expect(await checkPython()).toBe(true);
  });

  it("returns true when only python (not python3) is available", async () => {
    mockedExec.mockImplementation((cmd: string, cb: Function) => {
      if (cmd === "python --version") return cb(null);
      cb(new Error("not found"));
    });
    expect(await checkPython()).toBe(true);
  });

  it("returns false when neither python3 nor python is available", async () => {
    mockedExec.mockImplementation((_cmd: string, cb: Function) =>
      cb(new Error("not found"))
    );
    expect(await checkPython()).toBe(false);
  });
});

describe("getFfmpegInstallMessage", () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    Object.defineProperty(process, "platform", { value: originalPlatform });
  });

  it("returns brew command for macOS", () => {
    Object.defineProperty(process, "platform", { value: "darwin" });
    expect(getFfmpegInstallMessage()).toContain("brew install ffmpeg");
  });

  it("returns apt/dnf command for Linux", () => {
    Object.defineProperty(process, "platform", { value: "linux" });
    const msg = getFfmpegInstallMessage();
    expect(msg).toContain("apt install ffmpeg");
    expect(msg).toContain("dnf install ffmpeg");
  });

  it("returns choco/winget command for Windows", () => {
    Object.defineProperty(process, "platform", { value: "win32" });
    const msg = getFfmpegInstallMessage();
    expect(msg).toContain("choco install ffmpeg");
    expect(msg).toContain("winget install ffmpeg");
  });
});

describe("getPythonInstallMessage", () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    Object.defineProperty(process, "platform", { value: originalPlatform });
  });

  it("returns brew command for macOS", () => {
    Object.defineProperty(process, "platform", { value: "darwin" });
    expect(getPythonInstallMessage()).toContain("brew install python3");
  });

  it("returns apt/dnf command for Linux", () => {
    Object.defineProperty(process, "platform", { value: "linux" });
    const msg = getPythonInstallMessage();
    expect(msg).toContain("apt install python3");
    expect(msg).toContain("dnf install python3");
  });

  it("returns download link for Windows", () => {
    Object.defineProperty(process, "platform", { value: "win32" });
    const msg = getPythonInstallMessage();
    expect(msg).toContain("python.org/downloads");
  });
});
