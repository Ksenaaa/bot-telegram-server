const { Router, text } = require('express')
const TelegramBot = require('node-telegram-bot-api');
const config = require('config');

const token = config.get('token');
const bot = new TelegramBot(token, {polling: true});

const router = Router()

router.post(
    '/web-data', async(req, res) => {
        const { queryId, products, totalPrices } = req.body
        console.log(req.body)
        try {
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Успешная покупка',
                input_message_content: {message_text: 'Поздравляю, Вы купили товара на сумму ' + totalPrices }
            })

            return res.status(200).json({})
        } catch (error) {
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Не удалось приобрести товар',
                input_message_content: {message_text: 'Не удалось приобрести товар'}
            })

            return res.status(500).json({})
        }
    }
)

module.exports = router;
