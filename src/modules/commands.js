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

const readline = require('readline');
const logger = require('../utils/logger');

class CommandModule {
  constructor(bot) {
    this.bot = bot;
    this.commands = {};
    this.rl = null;
  }
  
  init() {
    logger.info('Initializing command module');
    
    this.registerCommand('help', 'Show available commands', () => {
      logger.info('Available commands:');
      Object.keys(this.commands).forEach(cmd => {
        logger.info(`- ${cmd}: ${this.commands[cmd].description}`);
      });
    });
    
    this.registerCommand('say', 'Send a chat message', (args) => {
      const message = args.join(' ');
      if (message) {
        this.bot.chat(message);
        logger.info(`Sent message: ${message}`);
      } else {
        logger.warn('No message provided. Usage: say <message>');
      }
    });
    
    this.registerCommand('quit', 'Disconnect the bot', () => {
      logger.info('Disconnecting bot by command...');
      process.emit('SIGINT');
    });

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });
    
    this.rl.on('line', (line) => {
      this._handleCommand(line.trim());
      this.rl.prompt();
    });
    
    this.rl.prompt();
    logger.info('Command module initialized. Type "help" for available commands');
  }
  
  registerCommand(name, description, handler) {
    this.commands[name] = {
      description,
      handler
    };
    logger.debug(`Registered command: ${name}`);
    return true;
  }
  
  unregisterCommand(name) {
    if (this.commands[name]) {
      delete this.commands[name];
      logger.debug(`Unregistered command: ${name}`);
      return true;
    }
    return false;
  }
  
  _handleCommand(input) {
    if (!input) return;
    
    const args = input.split(' ');
    const commandName = args.shift().toLowerCase();
    
    if (this.commands[commandName]) {
      try {
        this.commands[commandName].handler(args);
      } catch (err) {
        logger.error(`Error executing command ${commandName}: ${err.message}`);
      }
    } else {
      logger.warn(`Unknown command: ${commandName}. Type "help" for available commands`);
    }
  }
  
  cleanup() {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
    logger.info('Command module cleaned up');
  }
}

module.exports = CommandModule;
