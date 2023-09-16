import { IPaginationOptions } from '../interfaces/ipagination.option';
import { FilterQuery, Model, PopulateOptions, ProjectionType } from 'mongoose';
import { Pagination } from '../interfaces/pagination';

export const paginateModel = async <T>(
  model: Model<T>,
  options: IPaginationOptions,
  populateOptions?: PopulateOptions,
  filterQuery?: FilterQuery<T>,
  projection?: ProjectionType<T>,
): Promise<Pagination<T>> => {
  const totalItems = await model.countDocuments();
  const totalPages = Math.floor(totalItems / options.limit);
  const skip = (options.page - 1) * options.limit;
  const currentPage = options.page;
  const itemsPerPage = options.limit;

  const data = await model
    .find(filterQuery, projection)
    .populate(populateOptions)
    .skip(skip)
    .limit(itemsPerPage);

  return {
    data,
    itemsPerPage,
    currentPage,
    totalItems,
    totalPages,
  };
};
