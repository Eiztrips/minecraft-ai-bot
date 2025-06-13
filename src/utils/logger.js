/*
MIT License

Copyright (c) 2025 [ваше имя или название организации]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

const chalk = require('chalk');

class Logger {
  constructor() {
    this.logLevels = {
      debug: 0,
      info: 1,
      success: 2,
      warn: 3,
      error: 4
    };
    
    this.currentLevel = 'info'; 
  }
  
  setLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLevel = level;
    }
  }
  
  _shouldLog(level) {
    return this.logLevels[level] >= this.logLevels[this.currentLevel];
  }
  
  _getTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
  
  debug(message) {
    if (this._shouldLog('debug')) {
      console.log(`${chalk.gray(this._getTimestamp())} ${chalk.blue('DEBUG')} ${message}`);
    }
  }
  
  info(message) {
    if (this._shouldLog('info')) {
      console.log(`${chalk.gray(this._getTimestamp())} ${chalk.cyan('INFO')} ${message}`);
    }
  }
  
  success(message) {
    if (this._shouldLog('success')) {
      console.log(`${chalk.gray(this._getTimestamp())} ${chalk.green('SUCCESS')} ${message}`);
    }
  }
  
  warn(message) {
    if (this._shouldLog('warn')) {
      console.log(`${chalk.gray(this._getTimestamp())} ${chalk.yellow('WARNING')} ${message}`);
    }
  }
  
  error(message) {
    if (this._shouldLog('error')) {
      console.log(`${chalk.gray(this._getTimestamp())} ${chalk.red('ERROR')} ${message}`);
    }
  }
}

module.exports = new Logger();
