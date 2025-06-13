# Minecraft AI Бот

Масштабируемый клиент-бот для Minecraft, созданный с помощью mineflayer.

## Функции

- Подключение к серверу Minecraft (версия 1.23.1)
- Модульная архитектура для легкого расширения
- Система обработки событий
- Интерфейс командной строки
- Взаимодействие через чат

## Установка

1. Клонировать репозиторий
2. Установить зависимости:
```
npm install
```
3. Настроить бота в `config/config.js`

## Модификации пакетов

В файле `/node_modules/prismarine-chunk/src/pc/1.18/ChunkColumn.js` необходимо заменить строки 17-22 на следующий код:
```javascript
super(mcData)
this.minY = Number(options?.minY ?? CAVES_UPDATE_MIN_Y)
this.worldHeight = Number(options?.worldHeight ?? CAVES_UPDATE_WORLD_HEIGHT)
this.numSections = this.worldHeight >> 4
this.maxBitsPerBlock = neededBits(Object.values(mcData.blocks).reduce((high, block) => Math.max(high, block.maxStateId), 0))
this.maxBitsPerBiome = neededBits(Object.values(mcData.biomes).length)
```

## Использование

Запустить бота:
```
npm start
```

## Доступные команды

- `help` - Показать доступные команды
- `say <сообщение>` - Отправить сообщение в чат
- `quit` - Отключить бота

## Добавление новых модулей

Создавайте новые модули в директории `src/modules` и инициализируйте их в файле `bot.js`.

## Конфигурация

Редактируйте `config/config.js` для изменения:
- Учетных данных бота
- Информации о сервере
- Разрешенных игроков
- Настроек бота

## Лицензия

Этот проект является приватным и не предназначен для распространения.
