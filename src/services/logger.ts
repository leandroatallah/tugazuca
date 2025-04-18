enum LogStatus {
  INFO = "INFO",
  ERROR = "ERROR",
}

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
};

export default class logger {
  static formatTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  static getMessage(status: LogStatus, ...data: any[]): string {
    const time = this.formatTime();
    let statusText = ` ${status}`;
    let color = colors.reset;

    switch (status) {
      case LogStatus.INFO:
        color = colors.green;
        statusText = `${colors.green}${statusText}${colors.reset}`;
        break;
      case LogStatus.ERROR:
        color = colors.red;
        statusText = `${colors.red}${statusText}${colors.reset}`;
        break;
      default:
        break;
    }

    return `[${time}]${statusText}: ${data.join(" ")}`;
  }

  static info(...data: any[]): void {
    console.info(this.getMessage(LogStatus.INFO, data));
  }

  static error(...data: any[]): void {
    console.error(this.getMessage(LogStatus.ERROR, data));
  }

  static trace(...data: any[]): void {
    console.trace(this.getMessage(LogStatus.ERROR, data));
  }
}
