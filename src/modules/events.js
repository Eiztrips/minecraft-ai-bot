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

const logger = require('../utils/logger');

class EventModule {
  constructor(bot) {
    this.bot = bot;
    this.registeredEvents = {};
  }
  
  init() {
    logger.info('Initializing event module');
    
    this._registerEvent('spawn', () => {
      logger.success('Bot spawned in the world');
    });
    
    this._registerEvent('kicked', (reason) => {
      logger.warn(`Bot was kicked: ${reason}`);
    });
    
    this._registerEvent('death', () => {
      logger.warn('Bot died and will respawn');
    });
    
    this._registerEvent('health', () => {
      logger.debug(`Health: ${this.bot.health}, Food: ${this.bot.food}`);
    });

    logger.info('Event module initialized');
  }
  
  _registerEvent(eventName, callback) {
    if (!this.registeredEvents[eventName]) {
      this.bot.on(eventName, callback);
      this.registeredEvents[eventName] = callback;
      logger.debug(`Registered event: ${eventName}`);
    }
  }
  
  unregisterEvent(eventName) {
    if (this.registeredEvents[eventName]) {
      this.bot.removeListener(eventName, this.registeredEvents[eventName]);
      delete this.registeredEvents[eventName];
      logger.debug(`Unregistered event: ${eventName}`);
      return true;
    }
    return false;
  }
  
  cleanup() {
    Object.keys(this.registeredEvents).forEach(eventName => {
      this.unregisterEvent(eventName);
    });
    logger.info('Event module cleaned up');
  }
}

module.exports = EventModule;
