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

const mineflayer = require('mineflayer');
const config = require('../config/config');
const logger = require('./utils/logger');
const EventModule = require('./modules/events');
const CommandModule = require('./modules/commands');
const ChatModule = require('./modules/chat');

class BotClient {
  constructor() {
    this.bot = null;
    this.modules = {};
    this.connected = false;
  }

  start() {
    logger.info(`Connecting to ${config.server.host}...`);
    
    this.bot = mineflayer.createBot({
      host: config.server.host,
      port: config.server.port,
      username: config.credentials.email,
      password: config.credentials.password,
      version: config.server.version,
      auth: 'microsoft'
    });

    this._initModules();
    
    this._setupBaseEvents();
  }

  _initModules() {
    this.modules.events = new EventModule(this.bot);
    this.modules.commands = new CommandModule(this.bot);
    this.modules.chat = new ChatModule(this.bot, config.allowedPlayers);
    
    Object.values(this.modules).forEach(module => {
      if (typeof module.init === 'function') {
        module.init();
      }
    });
    
    logger.info('All modules initialized');
  }

  _setupBaseEvents() {
    this.bot.on('login', () => {
      this.connected = true;
      logger.success(`Bot connected to ${config.server.host}`);
    });

    this.bot.on('end', () => {
      this.connected = false;
      logger.warn('Bot disconnected from server');
      
      if (config.settings.autoReconnect) {
        logger.info(`Reconnecting in ${config.settings.reconnectDelay / 1000} seconds...`);
        setTimeout(() => this.start(), config.settings.reconnectDelay);
      }
    });

    this.bot.on('error', (err) => {
      logger.error(`Bot error: ${err.message}`);
    });
  }

  async disconnect() {
    if (this.connected && this.bot) {
      Object.values(this.modules).forEach(module => {
        if (typeof module.cleanup === 'function') {
          module.cleanup();
        }
      });
      
      this.bot.quit();
      this.connected = false;
      logger.info('Bot disconnected');
    }
  }
}

module.exports = BotClient;
