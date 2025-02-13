import logdna, { LogLevel } from "@logdna/logger";
import fs from "fs/promises";
import { v4 } from "uuid";
import { getConfig } from "./config";

class Mezmorize {
  private config = getConfig();
  private logger = logdna.createLogger(this.config.mezmoKey, {
    hostname: "ovms",
  });
  private lineRegex =
    /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}) (.+?) (.) \(\d*\) (.+?): (.*)/;

  private getLevel = (ovmsLevel: string): LogLevel => {
    switch (ovmsLevel) {
      case "E":
        return LogLevel.error;
      case "W":
        return LogLevel.warn;
      case "I":
        return LogLevel.info;
      case "D":
        return LogLevel.debug;
      case "V":
        return LogLevel.trace;
      default:
        return LogLevel.info;
    }
  };

  private getAvailableLogFilenames = async (
    rootDir: string
  ): Promise<string[]> => {
    const files = await fs.readdir(rootDir);
    return files;
  };

  private digestLog = async (
    rootDir: string,
    fileName: string,
    analysisId: string
  ) => {
    console.log(`Working on file ${fileName}`);
    const data = await fs.readFile(`${rootDir}/${fileName}`, "utf8");
    const lines = data.split(/\r?\n/);
    for (const line of lines) {
      const matches = line.match(this.lineRegex);
      if (!matches) continue;
      const date = new Date(matches[1]);
      const today = new Date();
      date.setDate(today.getDate());
      date.setMonth(today.getMonth());
      date.setFullYear(today.getFullYear());
      if (Date.now() - date.getTime() > 1000 * 60 * 60 * 24) {
        // Mezmo only accepts logs from the last 24 hrs
        throw new Error(`Date ${date} is out of bounds`);
      }
      this.logger.addMetaProperty("analysisId", analysisId);
      this.logger.log(matches[5], {
        level: this.getLevel(matches[3]),
        timestamp: date.getTime(),
        app: matches[4],
        indexMeta: true,
      });
    }
  };

  public boot = async () => {
    console.log(`Working…`);
    const rootDir = this.config.workingDir;
    const analysisId = v4();
    const files = await this.getAvailableLogFilenames(rootDir);
    console.log(`Found ${files.length} files.`);
    for (const file of files) {
      await this.digestLog(rootDir, file, analysisId);
    }
    console.log(`Done, analysis ID is ${analysisId}`);
    console.log(
      `https://app.mezmo.com/d0b50733d1/logs/view?q=meta.analysisId%3A${analysisId}`
    );
  };
}

const mezmorize = new Mezmorize();
mezmorize.boot();
