import { BaseModel } from '@core/model/base.model';
import { isEmpty } from 'class-validator';
import { first } from 'lodash';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { generateCodeByPreviousCode } from 'src/helper/code.helper';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T extends BaseModel>
  implements BaseInterfaceRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(data: T | any): Promise<T> {
    return await this.model.create(data);
  }

  public async findOneById(id: string): Promise<T> {
    return await this.model
      .findOne({
        _id: id,
        deletedAt: null,
      } as FilterQuery<T>)
      .lean();
  }

  public async findOneByCode(code: string): Promise<T> {
    return await this.model
      .findOne({
        code: code,
        deletedAt: null,
      } as FilterQuery<T>)
      .lean();
  }

  public async findOneByCondition(filterCondition: any): Promise<T> {
    const condition = filterCondition?.id
      ? {
          ...filterCondition,
          _id: filterCondition?.id,
        }
      : { ...filterCondition };
    return await this.model.findOne({ ...condition, deletedAt: null }).lean();
  }

  public async findAllByCondition(
    condition: any,
    skip?: number,
    limit?: number,
  ): Promise<T[]> {
    const query = this.model.find({ ...condition, deletedAt: null });
    if (skip) {
      query.skip(skip);
    }
    if (limit) {
      query.limit(limit);
    }
    return await query.lean();
  }

  public async deleteById(id: T | any): Promise<any> {
    return await this.model.deleteOne({ _id: id, deletedAt: null });
  }

  public async findAll(): Promise<T[]> {
    return await this.model.find({
      deletedAt: null,
    });
  }

  public async findByIdAndUpdate(id: string, data: T | any): Promise<any> {
    return await this.model.findByIdAndUpdate(
      { _id: id, deletedAt: null },
      { ...data },
      {
        new: true,
      },
    );
  }

  public async updateById(id: T | any, data: T | any) {
    await this.model.updateOne({ _id: id, deletedAt: null }, data, {
      new: true,
    });
  }

  public async createMany(data: T | any): Promise<any> {
    return await this.model.insertMany(data);
  }

  public async softDelete(id: string): Promise<any> {
    return await this.model.updateOne(
      {
        _id: id,
        deletedAt: null,
      } as FilterQuery<T>,
      {
        $set: {
          deletedAt: new Date(),
        },
      } as UpdateQuery<T>,
    );
  }

  public async findAllWithPopulate(
    condition: any,
    populate: any,
    skip?: number,
    limit?: number,
    sort?: any,
  ): Promise<T[]> {
    const query = this.model
      .find({ ...condition, deletedAt: null })
      .populate(populate);
    if (skip) {
      query.skip(skip);
    }
    if (limit) {
      query.limit(limit);
    }
    if (!isEmpty(sort)) {
      query.sort(sort);
    }
    return await query.lean();
  }

  public async findOneWithPopulate(
    condition: FilterQuery<T>,
    populate: any,
  ): Promise<T> {
    return await this.model
      .findOne({ ...condition, deletedAt: null })
      .populate(populate)
      .lean();
  }

  public async count(condition?: any): Promise<number> {
    return await this.model.count({ ...condition, deletedAt: null }).exec();
  }

  public async findAllAndUpdate(
    condition: any,
    dataUpdate: any,
    upsert = false,
  ): Promise<any> {
    return await this.model
      .updateMany({ ...condition, deletedAt: null }, dataUpdate, { upsert })
      .exec();
  }

  public async bulkWrite(bulkOps: any): Promise<any> {
    return await this.model.bulkWrite(bulkOps);
  }

  public async deleteManyByCondition(condition: any): Promise<any> {
    return await this.model.deleteMany(condition);
  }

  public async lastRecord(sort = { code: -1 }, condition = {}): Promise<any> {
    const result = await this.model.find(condition).sort(sort).limit(1);
    return first(result) ?? {};
  }

  public async generateNextCode(
    prefixCode = '',
    condition = {},
  ): Promise<string> {
    const lastRecord = await this.lastRecord({ code: -1 }, condition);
    const codeCurrent = +lastRecord.code?.replace(prefixCode, '') || 0;
    return generateCodeByPreviousCode(prefixCode, codeCurrent);
  }

  public async generateNextCodeWithYear(prefixCode = '', condition = {}) {
    const towDigitOfYear = new Date().getFullYear().toString().substr(2, 2);
    const code = `${prefixCode}${towDigitOfYear}`;
    return this.generateNextCode(code, {
      code: { $regex: new RegExp(`^${prefixCode}`, 'i') },
      ...condition,
    });
  }
}
