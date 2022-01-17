const TelegramApi = require('node-telegram-bot-api')
const{gameOptions, againOptions} = require('./options')
const token = '5005966639:AAEhHP9P_-YG-Jdu5TJ6GmtTLjI7RArsbrg'

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 1 до 10, тебе нужно будет отгадать её`)
    const randNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randNumber
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}


const start = () => {            
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра с угадыванием чисел'}
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if(text === '/start'){
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/eca/a36/ecaa3610-ade7-3e45-93fb-40fd36687602/1.webp`)
            return bot.sendMessage(chatId, 'Добро пожаловать в свой первый телеграм-бот')
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Неизвестная команда')
    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data == chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `К сожалению ты не угадал, правильный ответ - ${chats[chatId]}`, againOptions)
        }
    })
}

start()