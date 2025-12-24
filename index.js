require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
const ADMIN_ID = process.env.ADMIN_ID
console.log('ADMIN_ID:', ADMIN_ID)

const userState = {}

const mainMenu = {
    reply_markup: {
        keyboard: [
            ['📸 معرفی خدمات'],
            ['📅 رزرو وقت'],
            ['❓ سوالات متداول'],
            ['📞 تماس با من']
        ],
        resize_keyboard: true
    }
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'سلام عزیزم 👋\nخوشحالم که برای ثبت لحظات قشنگت منو انتخاب کردی📸\nاز منو یکی رو انتخاب کن',
        mainMenu
    )
})

bot.on('message', (msg) => {
    const chatId = msg.chat.id
    const text = msg.text?.toLowerCase()

    if (text === '📸 معرفی خدمات') {
        bot.sendMessage(
            chatId,
            '📸 خدمات عکاسی:\n\n' +
            '• پرتره (شخصی، مدلینگ)\n' +
            '• عکاسی مراسم\n' +
            '• عکاسی تبلیغاتی و محصول\n\n' +
            'برای رزرو وقت از منو استفاده کن 👇'
        )
        return
    }

    if (text === '📞 تماس با من') {
        bot.sendMessage(
            chatId,
            '📞 راه‌های ارتباط:\n\n' +
            '📱 09924688875\n' +
            '📸 Instagram: lm_ayrad'
        )
        return
    }

    if (text === '❓ سوالات متداول') {
        bot.sendMessage(
            chatId,
            '❓ سوالات متداول:\n\n' +
            '💰 قیمت عکاسی چقدره؟\n' +
            '⏱ تحویل عکس‌ها چند روزه؟\n' +
            '📍 کدوم شهر فعالیت دارید؟\n' +
            '📷 با چه دوربینی کار می‌کنید؟\n\n' +
            'سوالت رو تایپ کن ✍️'
        )
        return
    }

    if (text?.includes('قیمت') || text?.includes('هزینه') || text?.includes('تعرفه')) {
        bot.sendMessage(chatId, '💰 قیمت بسته به نوع پروژه متفاوته. برای جزئیات رزرو وقت بزن 📅')
        return
    }

    if (text?.includes('تحویل')) {
        bot.sendMessage(chatId, '⏱ زمان تحویل عکس‌ها بین 3 تا 7 روز کاریه')
        return
    }

    if (text?.includes('شهر')) {
        bot.sendMessage(chatId, '📍 فعالیت من در قزوین هست')
        return
    }

    if (text?.includes('دوربین') || text?.includes('تجهیزات')) {
        bot.sendMessage(chatId, '📷 تجهیزات حرفه‌ای فول‌فریم استفاده می‌کنم')
        return
    }

    if (text === '📅 رزرو وقت') {
        userState[chatId] = { step: 'type' }
        bot.sendMessage(chatId, '📸 نوع عکاسی رو بنویس:')
        return
    }

    if (userState[chatId]?.step === 'type') {
        userState[chatId].type = msg.text
        userState[chatId].step = 'date'
        bot.sendMessage(chatId, '📅 تاریخ مدنظر رو بنویس (مثال: 1403/10/10)')
        return
    }

    if (userState[chatId]?.step === 'date') {
        userState[chatId].date = msg.text
        userState[chatId].step = 'phone'
        bot.sendMessage(chatId, '📞 شماره تماس؟')
        return
    }

    if (userState[chatId]?.step === 'phone') {
        userState[chatId].phone = msg.text

        bot.sendMessage(chatId, '✅  درخواست رزروت ثبت شد به زودی میبینمت عزیزم', mainMenu)

        bot.sendMessage(
            ADMIN_ID,
            `📅 رزرو جدید\n\n` +
            `👤 ${msg.from.first_name}\n` +
            `📸 نوع: ${userState[chatId].type}\n` +
            `📅 تاریخ: ${userState[chatId].date}\n` +
            `📞 تماس: ${userState[chatId].phone}`
        )

        delete userState[chatId]
        return
    }

    if (msg.text && !msg.text.startsWith('/')) {
        bot.sendMessage(chatId, '📨 پیام شما به پشتیبانی ارسال شد')
        bot.sendMessage(ADMIN_ID, `❓ سوال مشتری:\n\n${msg.text}`)
    }
})
console.log('Bot is running...')
