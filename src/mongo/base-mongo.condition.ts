import { FilterQuery } from 'mongoose'
import { BaseCondition } from '../common/dto/base-condition'

export class BaseMongoCondition<T> {
  getConditions(conditions: BaseCondition<T> = {}): FilterQuery<T> {
    const filter = {}
    Object.entries(conditions).forEach(([column, target]: [string, any]) => {
      if (column === 'id') column = '_id' // mongo search bằng _id
      if (target === undefined) return
      if (target == null) {
        filter[column] = {
          $or: [{ [column]: null }, { [column]: { $exists: false } }],
        }
        return
      }
      if (['number', 'string', 'boolean'].includes(typeof target)) {
        filter[column] = target
        return
      }
      if (typeof target === 'object') {
        if (Object.keys(target).length === 0) return
        const ruleColumn: any = {}
        Object.entries(target).forEach(([rule, value]: [string, any]) => {
          if (rule === '>' || rule === 'GT') {
            ruleColumn.$gt = value
            return
          }
          if (rule === '>=' || rule === 'GTE') {
            ruleColumn.$gte = value
            return
          }
          if (rule === '<' || rule === 'LT') {
            ruleColumn.$lt = value
            return
          }
          if (rule === '<=' || rule === 'LTE') {
            ruleColumn.$lte = value
            return
          }
          if (rule === '==' || rule === 'EQUAL') {
            ruleColumn.$eq = value
            return
          }
          if (rule === '!=' || rule === 'NOT') {
            ruleColumn.$ne = value
            return
          }
          if (rule === 'IS_NULL') {
            if (value === true) {
              ruleColumn.$or = [{ $exists: false }, { $eq: null }]
              return
            }
            if (value === false) {
              ruleColumn.$exists = true
              ruleColumn.$ne = null
              return
            }
          }
          if (rule === 'NOT_NULL') {
            if (value === false) {
              ruleColumn.$or = [{ $exists: false }, { $eq: null }]
              return
            }
            if (value === true) {
              ruleColumn.$exists = true
              ruleColumn.$ne = null
              return
            }
          }
          if (rule === 'BETWEEN') {
            ruleColumn.$gte = value[0]
            ruleColumn.$lte = value[1]
            return
          }
          if (rule === 'IN') {
            if (value.length === 0) {
              ruleColumn.$or = [{ $exists: false }, { $eq: null }]
              return
            } else {
              ruleColumn.$in = value
              return
            }
          }
          if (rule === 'LIKE') {
            ruleColumn.$regex = `.*${value}.*`
            ruleColumn.$options = 'i'
            return
          }
        })

        if (Object.keys(ruleColumn).length === 0) {
          filter[column] = target
        } else {
          filter[column] = ruleColumn
        }
      }
    })
    return filter
  }

  getFilterOptions(condition: BaseCondition<T> = {}) {
    if (Object.keys(condition).length === 0) return {}
    const { $OR, ...otherCondition } = condition // xử lý riêng trường hợp $OR
    const result = this.getConditions(otherCondition as any)
    if ($OR && $OR.length) {
      result.$or = $OR.map((i) => {
        return this.getFilterOptions(i)
      })
    }
    return result
  }

  getRelationOptions(relation: any) {
    return Object.entries(relation)
      .filter(([key, value]) => !!value)
      .map(([key, value]) => key)
  }

  getSortOptions(sort: any) {
    const result: any = {}
    Object.entries(sort).forEach(([key, value]) => {
      if (key === 'id') key = '_id' // mongo search bằng _id
      if (value === 'ASC') result[key] = 'asc'
      if (value === 'DESC') result[key] = 'desc'
    })
    return result
  }
}
