import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  paginate(data: any[], page: number = 1, limit: number = 10): any {
    const skip = (page - 1) * limit;
    const slicedData = data.slice(skip, skip + limit);
    const total = data.length;
    const lastPage = Math.ceil(total / limit);

    return {
      data: slicedData,
      page,
      limit,
      total,
      lastPage,
    };
  }
}
