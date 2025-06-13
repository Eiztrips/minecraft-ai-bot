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

class ChatModule {
  constructor(bot, allowedPlayers) {
    this.bot = bot;
    this.allowedPlayers = allowedPlayers || [];
    this.messageHandlers = [];
  }
  
  init() {
    logger.info('Initializing chat module');
    
    this.bot.on('chat', (username, message) => {
      if (username === this.bot.username) return;
      
      logger.info(`<${username}> ${message}`);
      
      if (this._isPlayerAllowed(username)) {
        this._processMessage(username, message);
      } else {
        logger.debug(`Ignored message from non-allowed player: ${username}`);
      }
    });
    
    this.bot.on('playerJoined', (player) => {
      if (this._isPlayerAllowed(player.username)) {
        logger.info(`Allowed player joined: ${player.username}`);
      }
    });
    
    logger.info('Chat module initialized');
  }
  
  _isPlayerAllowed(username) {
    if (this.allowedPlayers.length === 0) return false;
    
    if (this.allowedPlayers.includes('*')) return true;
    
    return this.allowedPlayers.includes(username);
  }
  
  _processMessage(username, message) {
    for (const handler of this.messageHandlers) {
      try {
        handler(username, message);
      } catch (err) {
        logger.error(`Error in chat message handler: ${err.message}`);
      }
    }
  }
  
  registerMessageHandler(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler);
      return true;
    }
    return false;
  }
  
  cleanup() {
    this.messageHandlers = [];
    logger.info('Chat module cleaned up');
  }
}

module.exports = ChatModule;
