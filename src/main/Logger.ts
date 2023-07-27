import { ipcMain } from "electron";

import { LOGLEVEL } from "Const";
import { LogLevel } from "Types/enums";
import { storage } from "./Storage";

export class Logger {
  private levels = ["DEBUG", "INFO", "ERROR"];
  private logLevel = 1;
  constructor() {
    if (LOGLEVEL) {
      this.logLevel = this.levels.indexOf(LOGLEVEL);
    } else {
      this.logLevel = storage.settings.app.logLevel;
    }

    this.initLoggerEvent();
  }

  private initLoggerEvent = (): void => {
    ipcMain.on("log-debug", (sender, ...msg) => this.debug(`[From web content: ${sender.sender.id}]`, ...msg));
    ipcMain.on("log-info", (sender, ...msg) => this.info(`[From web content: ${sender.sender.id}]`, ...msg));
    ipcMain.on("log-error", (sender, ...msg) => this.error(`[From web content: ${sender.sender.id}]`, ...msg));
  };

  private getDateTime = (): string => {
    const currentDate = new Date();

    return currentDate.toLocaleString();
  };

  private print = (level: number, ...argv: unknown[]) => {
    if (level < this.logLevel) {
      return;
    }

    const dateTime = this.getDateTime();

    console.log(`[${dateTime}]:[${this.levels[level]}] -`, ...argv);
  };

  public debug = (...argv: unknown[]): void => {
    this.print(LogLevel.DEBUG, ...argv);
  };
  public info = (...argv: unknown[]): void => {
    this.print(LogLevel.INFO, ...argv);
  };
  public error = (...argv: unknown[]): void => {
    this.print(LogLevel.ERROR, ...argv);
  };
}

export const logger = new Logger();
