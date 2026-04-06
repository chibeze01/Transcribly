import { exec } from "child_process";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

const mockedExec = exec as unknown as jest.Mock;

import {
  checkFfmpeg,
  checkPython,
  parsePythonVersion,
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

describe("parsePythonVersion", () => {
  it("parses standard version output", () => {
    expect(parsePythonVersion("Python 3.11.4")).toEqual({ major: 3, minor: 11 });
  });

  it("parses version with extra text", () => {
    expect(parsePythonVersion("Python 3.8.0\n")).toEqual({ major: 3, minor: 8 });
  });

  it("parses Python 2.x", () => {
    expect(parsePythonVersion("Python 2.7.18")).toEqual({ major: 2, minor: 7 });
  });

  it("returns null for unparseable output", () => {
    expect(parsePythonVersion("not python")).toBeNull();
  });
});

describe("checkPython", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns ok when python3 version >= 3.8", async () => {
    mockedExec.mockImplementation((cmd: string, cb: Function) => {
      if (cmd === "python3 --version") return cb(null, "Python 3.11.4\n", "");
      cb(new Error("not found"), "", "");
    });
    const result = await checkPython();
    expect(result.ok).toBe(true);
    expect(result.version).toBe("3.11.4");
  });

  it("returns ok when only python (not python3) has version >= 3.8", async () => {
    mockedExec.mockImplementation((cmd: string, cb: Function) => {
      if (cmd === "python --version") return cb(null, "Python 3.9.1\n", "");
      cb(new Error("not found"), "", "");
    });
    const result = await checkPython();
    expect(result.ok).toBe(true);
    expect(result.version).toBe("3.9.1");
  });

  it("returns not ok when python version < 3.8", async () => {
    mockedExec.mockImplementation((cmd: string, cb: Function) => {
      if (cmd === "python3 --version") return cb(null, "Python 3.6.9\n", "");
      cb(new Error("not found"), "", "");
    });
    const result = await checkPython();
    expect(result.ok).toBe(false);
    expect(result.version).toBe("3.6.9");
  });

  it("returns not ok when python is 2.x", async () => {
    mockedExec.mockImplementation((cmd: string, cb: Function) => {
      if (cmd === "python --version") return cb(null, "", "Python 2.7.18\n");
      cb(new Error("not found"), "", "");
    });
    const result = await checkPython();
    expect(result.ok).toBe(false);
    expect(result.version).toBe("2.7.18");
  });

  it("returns not ok when neither python3 nor python is available", async () => {
    mockedExec.mockImplementation((_cmd: string, cb: Function) =>
      cb(new Error("not found"), "", "")
    );
    const result = await checkPython();
    expect(result.ok).toBe(false);
    expect(result.version).toBeUndefined();
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
