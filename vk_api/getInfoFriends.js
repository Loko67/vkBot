const URL = "https://api.vk.com/method/"
const access_token = process.env.access_token
const versionAPI = "5.199"
const fields = "bdate"

async function getBirthdayFriends(userId) {

  const birthdayFriends = []
  let noBirthday = 0
  let noYearBirthday = 0
  let totalFriends = 0

  const response = await fetch((`${URL}friends.get?access_token=${access_token}&user_id=${userId}&v=${versionAPI}&fields=${fields}`),
    {
      method: "POST",
      body: JSON.stringify()
    }
  )

  const friends = await response.json()

  totalFriends = friends.response.items.length

  for (const friend of friends.response.items) {
    if (!friend.bdate) {
      noBirthday++
    } else if (String(friend.bdate).length < 8) {
      noYearBirthday++
    } else if (friend.bdate && String(friend.bdate).length >= 8) {
      birthdayFriends.push(friend.bdate)
    }
  }

  return [birthdayFriends, noBirthday, noYearBirthday, totalFriends]

}

async function getAverageAge(userId) {

  const birthdays = await getBirthdayFriends(userId)
  const fullBirthdays = birthdays[0]

  const now = new Date()

  const ages = fullBirthdays.map(birthday => {
    const birthDate = parseDate(birthday)
    return now - birthDate
  })

  const totalAge = ages.reduce((sum, age) => sum + age, 0)

  return ((totalAge / ages.length) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2)

}

function parseDate(date) {

  const parts = date.split(".")
  return new Date(parts[2], parts[1] - 1, parts[0])

}

async function getName(userId) {

  const response = await fetch((`${URL}users.get?access_token=${access_token}&user_ids=${userId}&v=${versionAPI}`),
    {
      method: "POST",
      body: JSON.stringify()
    }
  )

  const date = await response.json()
  const name = `${date.response[0].first_name} ${date.response[0].last_name}`
  return name

}

module.exports = {
  getBirthdayFriends,
  getAverageAge,
  parseDate,
  getName
}