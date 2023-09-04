import { IPaginationOptions } from '../interfaces/ipagination.option';
import { Model } from 'mongoose';
import { Pagination } from '../interfaces/pagination';

export const paginateModel = async (
  model: Model<any>,
  options: IPaginationOptions,
): Promise<Pagination<any>> => {
  const totalItems = await model.countDocuments();
  const totalPages = Math.floor(totalItems / options.limit);
  const skip = (options.page - 1) * options.limit;
  const currentPage = options.page;
  const itemsPerPage = options.limit;

  const data = await model.find().skip(skip).limit(itemsPerPage);

  return {
    data,
    itemsPerPage,
    currentPage,
    totalItems,
    totalPages,
  };
};
