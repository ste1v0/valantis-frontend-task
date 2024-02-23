import md5 from 'md5'

export default function generateDate(): string {
    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)
    
    const currentYear = today.getUTCFullYear()
    const currentMonth = (today.getUTCMonth() + 1).toString().padStart(2, '0')
    const currentDay = today.getUTCDate()

    const password = process.env.API_PASSWORD

    return md5(`${password}_${currentYear}${currentMonth}${currentDay}`)
}