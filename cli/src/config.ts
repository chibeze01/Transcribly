import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface Config {
  apiKey?: string;
}

export function getConfigFilePath(): string {
  return path.join(os.homedir(), ".transcribly", "config.json");
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  try {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as Config;
  } catch {
    return {};
  }
}

export function writeConfig(config: Config): void {
  const filePath = getConfigFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}
