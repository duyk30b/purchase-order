export const formatMoney = (options: {
  number: number
  fixed?: number
  part?: number
  sec?: string
  dec?: string
}) => {
  const number = options.number || 0
  const part = options.part || 3
  const fixed = options.fixed || 0
  const sec = options.sec || ','
  const dec = options.dec || '.'

  let numberStr = '0'
  if (fixed >= 0) {
    numberStr = number.toFixed(fixed)
  } else {
    const power = Math.pow(10, -fixed)
    numberStr = (Math.round(number / power) * power).toString()
  }

  const regex = '\\d(?=(\\d{' + part + '})+' + (numberStr.includes('.') ? '\\D' : '$') + ')'
  return numberStr.replace('.', dec).replace(new RegExp(regex, 'g'), '$&' + sec)
}
