const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const config = require('config');
const cors = require('cors');

const token = config.get('token');
const webAppUrl = config.get('webAppUrl');

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json())
app.use(cors())
app.use('/api/web-data', require('./routes/web-data.routes'))

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Ниже кнопка по форме', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'} }]
                ]
            }
        })

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl} }]
                ]
            }
        })

    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country)
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street)
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию Вы получите в этом чате')
            }, 3000);
        } catch (e) {
            console.log(e)
        }
    }
});

const PORT = config.get('port')
app.listen(PORT, () => console.log(`Server started on Port ` + PORT))