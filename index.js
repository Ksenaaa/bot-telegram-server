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

app.post(
    '/web-data', async(req, res) => {
        try {
            const { queryId, products, totalPrices } = req.body
            console.log(queryId, 'queryId')
            bot.on('message', async (msg) => {
                const chatId = msg.chat.id;
                console.log(msg.chat)
                if (totalPrices > 0) {
                    await bot.sendMessage(chatId, 'Поздравляю, Вы купили товара на сумму ' + totalPrices )
                }
            })
            return res.status(200).json({message: 'Successfully'})
        } catch (error) {
            return res.status(500).json({message: 'Error!'})
        }
    }
)

const PORT = config.get('port')

app.listen(PORT, () => console.log(`Server started on Port ` + PORT))
