import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

  assert(value: any, message?: string, ...optionalParams: any[]): void {
    console.assert(value, message, optionalParams);
  }

  dir(obj: any, options?: { showHidden?: boolean, depth?: number, colors?: boolean }): void {
    console.dir(obj, options);
  }

  error(message?: any, ...optionalParams: any[]): void {
    console.error(message, optionalParams);
  }

  info(message?: any, ...optionalParams: any[]): void {
    console.info(message, optionalParams);
  }

  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, optionalParams);
  }

  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  trace(message?: any, ...optionalParams: any[]): void {
    console.trace(message, optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    console.warn(message, optionalParams);
  }

}