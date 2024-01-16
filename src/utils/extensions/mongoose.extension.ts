import { Aggregate, Model, Types } from 'mongoose';
import { isEmpty } from 'lodash';
import { DOCUMENT_CONST, SortOrder } from '@constant/database.constant';

declare module 'mongoose' {
  interface Aggregate<R> {
    buildPaginationQuery(
      skip: number,
      take: number,
      sortObj?: any,
      prependPipeline?: any,
    );
  }
}

/**
 * Populate 'histories' field and sort by descending order
 * @param model mongodb model
 * @param id id of the object to be found
 */
export const findByIdAndPopulateHistory = function (
  model: Model<any>,
  id: string,
) {
  return model.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
        deletedAt: null,
      },
    },
    {
      $unwind: '$histories',
    },
    {
      $sort: {
        'histories.createdAt': SortOrder.Descending,
      },
    },
    {
      $group: {
        _id: DOCUMENT_CONST.ID_PATH,
        data: {
          $first: DOCUMENT_CONST.ROOT_DOC,
        },
        histories: {
          $push: '$histories',
        },
      },
    },
    {
      $addFields: {
        'data.histories': '$histories',
      },
    },
    {
      $replaceRoot: {
        newRoot: '$data',
      },
    },
  ]);
};

/**
 * Build paginating query using aggregate
 * @param skip Number of records to skip
 * @param take Number of records to take
 * @param sortObj Sort conditions
 * @param prependPipeline Pipeline to prepend to the query
 */
Aggregate.prototype.buildPaginationQuery = function (
  skip: number,
  take: number,
  sortObj?: any,
  prependPipeline?: any,
) {
  let facetData: any[] = [];

  if (skip && take) {
    facetData = [
      {
        $skip: skip,
      },
      {
        $limit: take,
      },
    ];
  }

  if (!isEmpty(sortObj)) facetData.unshift({ $sort: sortObj });

  if (!isEmpty(prependPipeline)) facetData = [...prependPipeline, ...facetData];

  return this.append(
    {
      $facet: {
        data: facetData,
        metadata: [
          {
            $count: 'count',
          },
        ],
      },
    },
    {
      $project: {
        data: 1,
        total: {
          $arrayElemAt: ['$metadata.count', 0],
        },
      },
    },
  );
};
