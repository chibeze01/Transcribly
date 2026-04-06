import * as os from "os";
import * as path from "path";

jest.mock("fs");
const fs = require("fs");

import { readConfig, writeConfig, getConfigFilePath } from "./config";

describe("getConfigFilePath", () => {
  it("returns path inside ~/.transcribly/", () => {
    const filePath = getConfigFilePath();
    expect(filePath).toBe(
      path.join(os.homedir(), ".transcribly", "config.json")
    );
  });
});

describe("readConfig", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns empty object when config file does not exist", () => {
    fs.existsSync.mockReturnValue(false);
    expect(readConfig()).toEqual({});
  });

  it("returns parsed config when file exists", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify({ apiKey: "sk-test123" }));
    expect(readConfig()).toEqual({ apiKey: "sk-test123" });
  });

  it("returns empty object when config file contains invalid JSON", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("not-json");
    expect(readConfig()).toEqual({});
  });
});

describe("writeConfig", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates config directory with mode 0o700 if it does not exist", () => {
    fs.existsSync.mockReturnValue(false);
    writeConfig({ apiKey: "sk-abc" });
    expect(fs.mkdirSync).toHaveBeenCalledWith(
      path.join(os.homedir(), ".transcribly"),
      { recursive: true, mode: 0o700 }
    );
  });

  it("chmods existing config directory to 0o700", () => {
    fs.existsSync.mockReturnValue(true);
    writeConfig({ apiKey: "sk-abc" });
    expect(fs.chmodSync).toHaveBeenCalledWith(
      path.join(os.homedir(), ".transcribly"),
      0o700
    );
  });

  it("writes JSON to config file with mode 0o600", () => {
    fs.existsSync.mockReturnValue(true);
    writeConfig({ apiKey: "sk-xyz" });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(os.homedir(), ".transcribly", "config.json"),
      JSON.stringify({ apiKey: "sk-xyz" }, null, 2),
      { mode: 0o600 }
    );
  });
});
