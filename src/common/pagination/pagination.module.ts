import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';


@Module({
  providers: [PaginationService],
  exports: [PaginationService], // Export the service to be used in other modules
})
export class PaginationModule {}