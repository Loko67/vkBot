const { Telegraf } = require('telegraf')

require('dotenv').config()

const VK_API = require("./vk_api/getInfoFriends.js")

const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => {
  ctx.reply('Введите ID пользователя VK')
})

bot.on('text', async (ctx) => {
  const userId = ctx.message.text.trim()

  if (!/^\d+$/.test(userId)) {
    ctx.reply('Вы ввели неправильный ID пользователя VK')
  } else {
    const name = await VK_API.getName(userId)
    const averageAge = await VK_API.getAverageAge(userId)
    const infoBirthdayFriends = await VK_API.getBirthdayFriends(userId)
    const noBirthday = infoBirthdayFriends[1]
    const noYearBirthday = infoBirthdayFriends[2]
    const totalFriends = infoBirthdayFriends[3]
    ctx.reply(`Информация о возрасте друзей пользователя ${name}:
      Всего друзей ${totalFriends}
      Средний возраст друзей ${averageAge}
      День рождения не указан у ${noBirthday}
      Год рождения не указан у ${noYearBirthday}`)
  }
})

bot.launch()