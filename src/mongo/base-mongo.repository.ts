import { Model, UpdateQuery } from 'mongoose'
import { BaseCondition } from '../common/dto/base-condition'
import { NoExtra } from '../common/helpers'
import { BaseMongoCondition } from './base-mongo.condition'

export abstract class BaseMongoRepository<
  _SCHEMA,
  _TYPE,
  _SORT = { [P in keyof _SCHEMA]?: 'ASC' | 'DESC' },
  _RELATION = { [P in keyof _SCHEMA]?: boolean },
  _INSERT = _TYPE,
  _UPDATE = _TYPE,
> extends BaseMongoCondition<_SCHEMA> {
  private model: Model<_SCHEMA>

  protected constructor(model: Model<_SCHEMA>) {
    super()
    this.model = model
  }

  async pagination<S extends _SORT, R extends _RELATION>(options: {
    page: number
    limit: number
    condition?: BaseCondition<_TYPE>
    sort?: NoExtra<_SORT, S>
    relation?: NoExtra<_RELATION, R>
    rawCondition?: boolean
  }) {
    const { limit, page, sort, condition, relation, rawCondition } = options
    const skip = (page - 1) * limit
    const filter = rawCondition
      ? condition || {}
      : this.getFilterOptions(condition)

    let query = this.model.find(filter).skip(skip).limit(limit)
    if (relation) {
      const keys = this.getRelationOptions(relation)
      query = query.populate(keys) as any
    }
    if (sort) {
      const order = this.getSortOptions(sort)
      query = query.sort(order) as any
    }

    const [docs, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ])
    const data: _TYPE[] = docs.map((i) => i.toObject())
    return { page, limit, total, data }
  }

  async findMany<S extends _SORT, R extends _RELATION>(options: {
    limit?: number
    condition?: BaseCondition<_TYPE>
    sort?: NoExtra<_SORT, S>
    relation?: NoExtra<_RELATION, R>
    rawCondition?: boolean
  }): Promise<_TYPE[]> {
    const { condition, sort, relation, limit, rawCondition } = options
    const filter = rawCondition
      ? condition || {}
      : this.getFilterOptions(condition)

    let query = this.model.find(filter)
    if (limit) query = query.limit(limit)
    if (relation) {
      const keys = this.getRelationOptions(relation)
      query = query.populate(keys) as any
    }
    if (sort) {
      const order = this.getSortOptions(sort)
      query = query.sort(order) as any
    }

    const docs = await query.exec()
    const result = docs.map((i) => i.toObject())
    return result as _TYPE[]
  }

  async findManyBy(condition: BaseCondition<_TYPE>): Promise<_TYPE[]> {
    const filter = this.getFilterOptions(condition)

    const docs = await this.model.find(filter).exec()
    const result = docs.map((i) => i.toObject())
    return result as _TYPE[]
  }

  async findManyByIds(ids: string[]): Promise<_TYPE[]> {
    const docs = await this.model.find({ _id: { $in: ids } } as any).exec()
    const result = docs.map((i) => i.toObject())
    return result as _TYPE[]
  }

  async findOne<S extends _SORT, R extends _RELATION>(options: {
    condition: BaseCondition<_TYPE>
    sort?: NoExtra<_SORT, S>
    relation?: NoExtra<_RELATION, R>
    rawCondition?: boolean
  }): Promise<_TYPE> {
    const { condition, sort, relation, rawCondition } = options

    const filter = rawCondition
      ? condition || {}
      : this.getFilterOptions(condition)

    let query = this.model.findOne(filter)
    if (relation) {
      const keys = this.getRelationOptions(relation)
      query = query.populate(keys) as any
    }
    if (sort) {
      const order = this.getSortOptions(sort)
      query = query.sort(order) as any
    }

    const doc = await query
    return doc ? doc.toObject() : null
  }

  async findOneBy(condition: BaseCondition<_TYPE>): Promise<_TYPE> {
    const filter = this.getFilterOptions(condition)

    const doc = await this.model.findOne(filter)
    const result = doc ? doc.toObject() : null
    return result as _TYPE
  }

  async findOneById(id: string): Promise<_TYPE> {
    const doc = await this.model.findOne({ _id: id } as any)
    const result = doc ? doc.toObject() : null
    return result as _TYPE
  }

  async insertOne<T extends Partial<_INSERT>>(
    data: NoExtra<Partial<_INSERT>, T>
  ): Promise<_TYPE> {
    const model = new this.model(data)
    const doc = await model.save()
    const result = doc.toObject()
    return result as _TYPE
  }

  async insertOneFullField<T extends _INSERT>(
    data: NoExtra<_INSERT, T>
  ): Promise<_TYPE> {
    const model = new this.model(data)
    const hydratedDocument = await model.save()
    const result = hydratedDocument.toObject()
    return result as _TYPE
  }

  async insertMany<T extends Partial<_INSERT>>(
    data: NoExtra<Partial<_INSERT>, T>[]
  ): Promise<_TYPE[]> {
    const hydratedDocument = await this.model.insertMany(data)
    const result = hydratedDocument.map((i: any) => i.toObject())
    return result
  }

  async insertManyFullField<T extends _INSERT>(
    data: NoExtra<_INSERT, T>[]
  ): Promise<_TYPE[]> {
    const hydratedDocument = await this.model.insertMany(data)
    const result = hydratedDocument.map((i: any) => i.toObject())
    return result
  }

  async updateMany<T extends Partial<_UPDATE>>(
    condition: BaseCondition<_TYPE>,
    data: NoExtra<Partial<_UPDATE>, T>
  ) {
    const filter = this.getFilterOptions(condition)
    const result = await this.model.updateMany(
      filter,
      data as unknown as UpdateQuery<_SCHEMA>,
      { upsert: false }
    )
    return result.modifiedCount
  }

  async updateOne<T extends Partial<_UPDATE>>(
    condition: BaseCondition<_TYPE>,
    data: NoExtra<Partial<_UPDATE>, T>
  ): Promise<_TYPE> {
    const filter = this.getFilterOptions(condition)
    const hydratedDocument = await this.model.findOneAndUpdate(
      filter,
      data as unknown as UpdateQuery<_SCHEMA>,
      { new: true }
    )
    const result = hydratedDocument ? hydratedDocument.toObject() : null
    return result as _TYPE
  }

  async updateOneById<T extends Partial<_UPDATE>>(
    id: string,
    data: NoExtra<Partial<_UPDATE>, T>
  ): Promise<_TYPE> {
    return await this.updateOne({ id } as any, data)
  }

  async softDeleteOneBy(condition: BaseCondition<_TYPE>) {
    const filter = this.getFilterOptions(condition)
    const result = await this.model.updateOne(filter, {
      $set: {
        deletedAt: new Date(),
      },
    } as UpdateQuery<_SCHEMA>)
    return result.upsertedCount
  }

  async deleteOneBy(condition: BaseCondition<_TYPE>) {
    const filter = this.getFilterOptions(condition)
    const result = await this.model.deleteOne(filter)
    return result.deletedCount
  }

  async deleteManyBy(condition: BaseCondition<_TYPE>) {
    const filter = this.getFilterOptions(condition)
    const result = await this.model.deleteMany(filter)
    return result.deletedCount
  }
}
