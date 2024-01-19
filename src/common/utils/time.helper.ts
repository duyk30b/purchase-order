export class DTimer {
  static startOfDate = (time: string | number | Date, utcOffset?: number) => {
    if (typeof time !== 'object') time = new Date(time) // time: '2023-09-20T22:39:46.711Z'
    if (utcOffset == null) utcOffset = time.getTimezoneOffset() / -60 // getTimezoneOffset: -420
    const timeMove = new Date(time.getTime() + utcOffset * 60 * 60 * 1000) // timeMove: '2023-09-21T05:39:46.711Z'
    timeMove.setUTCHours(0, 0, 0, 0) // timeMove: '2023-09-21T00:00:00.000Z'
    const result = new Date(timeMove.getTime() - utcOffset * 60 * 60 * 1000) // result: '2023-09-20T17:00:00.000Z'
    return result
  }

  static endOfDate = (time: string | number | Date, utcOffset?: number) => {
    if (typeof time !== 'object') time = new Date(time) // time: '2023-09-20T22:39:46.711Z'
    if (utcOffset == null) utcOffset = time.getTimezoneOffset() / -60 // getTimezoneOffset: -420
    const timeMove = new Date(time.getTime() + utcOffset * 60 * 60 * 1000) // timeMove: '2023-09-21T05:39:46.711Z'
    timeMove.setUTCHours(23, 59, 59, 999)
    const result = new Date(timeMove.getTime() - utcOffset * 60 * 60 * 1000) // result: '2023-09-20T17:00:00.000Z'
    return result
  }

  static startOfMonth = (time: string | number | Date, utcOffset?: number) => {
    if (typeof time !== 'object') time = new Date(time) // time: '2023-09-20T22:39:46.711Z'
    if (utcOffset == null) utcOffset = time.getTimezoneOffset() / -60 // getTimezoneOffset: -420
    const timeMove = new Date(time.getTime() + utcOffset * 60 * 60 * 1000) // timeMove: '2023-09-21T05:39:46.711Z'
    timeMove.setUTCDate(1)
    timeMove.setUTCHours(0, 0, 0, 0)
    const result = new Date(timeMove.getTime() - utcOffset * 60 * 60 * 1000) // result:
    return result
  }

  static endOfMonth = (time: string | number | Date, utcOffset?: number) => {
    if (typeof time !== 'object') time = new Date(time) // time: '2023-09-20T22:39:46.711Z'
    if (utcOffset == null) utcOffset = time.getTimezoneOffset() / -60 // getTimezoneOffset: -420
    const timeMove = new Date(time.getTime() + utcOffset * 60 * 60 * 1000) // timeMove: '2023-09-21T05:39:46.711Z'
    timeMove.setUTCMonth(timeMove.getUTCMonth() + 1, 0)
    timeMove.setUTCHours(23, 59, 59, 999)
    const result = new Date(timeMove.getTime() - utcOffset * 60 * 60 * 1000) // result:
    return result
  }

  static info = (time: string | number | Date, utcOffset?: number) => {
    if (typeof time !== 'object') time = new Date(time) // time: '2023-09-20T22:39:46.711Z'
    if (utcOffset == null) utcOffset = time.getTimezoneOffset() / -60 // getTimezoneOffset: -420
    const timeMove = new Date(time.getTime() + utcOffset * 60 * 60 * 1000) // timeMove: '2023-09-21T05:39:46.711Z'
    return {
      year: timeMove.getUTCFullYear(),
      month: timeMove.getUTCMonth(),
      date: timeMove.getUTCDate(),
      hour: timeMove.getUTCHours(),
      minute: timeMove.getUTCMinutes(),
      second: timeMove.getUTCSeconds(),
    }
  }

  static textToTime = (text: string, pattern: string, utcOffset?: number): Date => {
    const iFullYear = pattern.indexOf('YYYY')
    const iMonth = pattern.indexOf('MM')
    const iDay = pattern.indexOf('DD')
    const iHour = pattern.indexOf('hh')
    const iMinute = pattern.indexOf('mm')
    const iSecond = pattern.indexOf('ss')
    const iMs = pattern.indexOf('xxx')

    const year = iFullYear !== -1 ? Number(text.slice(iFullYear, iFullYear + 4)) : 0
    const month = iMonth !== -1 ? Number(text.slice(iMonth, iMonth + 2)) : 0
    const date = iDay !== -1 ? Number(text.slice(iDay, iDay + 2)) : 0
    const hour = iHour !== -1 ? Number(text.slice(iHour, iHour + 2)) : 0
    const minute = iMinute !== -1 ? Number(text.slice(iMinute, iMinute + 2)) : 0
    const second = iSecond !== -1 ? Number(text.slice(iSecond, iSecond + 2)) : 0
    const millisecond = iMs !== -1 ? Number(text.slice(iMs, iMs + 3)) : 0

    const time = new Date()
    time.setUTCFullYear(year)
    time.setUTCMonth(month - 1)
    time.setUTCDate(date)
    time.setUTCHours(hour)
    time.setUTCMinutes(minute)
    time.setUTCSeconds(second)
    time.setMilliseconds(millisecond)

    if (utcOffset == null) utcOffset = time.getTimezoneOffset() / -60 // getTimezoneOffset: -420
    const timeMove = new Date(time.getTime() + utcOffset * 60 * 60 * 1000)
    return timeMove
  }

  static timeToText = (time?: Date | string | number | null, pattern = 'DD/MM/YYYY', utcOffset?: number): string => {
    if (time == null || time === '') return ''
    if (typeof time !== 'object') time = new Date(time)
    if (time.toString() === 'Invalid Date') return 'Invalid Date'

    if (utcOffset == null) utcOffset = time.getTimezoneOffset() / -60 // getTimezoneOffset: -420

    const date = new Date(time.getTime() + utcOffset * 60 * 60 * 1000)
    const rules = {
      YYYY: `${date.getUTCFullYear()}`,
      YY: `${date.getUTCFullYear()}`.slice(-2),
      MM: `0${date.getUTCMonth() + 1}`.slice(-2),
      DD: `0${date.getUTCDate()}`.slice(-2),
      hh: `0${date.getUTCHours()}`.slice(-2),
      mm: `0${date.getUTCMinutes()}`.slice(-2),
      ss: `0${date.getUTCSeconds()}`.slice(-2),
      xxx: `00${date.getUTCMilliseconds()}`.slice(-3),
    }

    let text = pattern
    Object.entries(rules).forEach(([key, value]) => {
      const re = new RegExp(key, 'g')
      text = text.replace(re, value)
    })

    return text
  }
}
