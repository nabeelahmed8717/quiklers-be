import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '../interceptors/BlackBlaze';

export function FileInterceptorFactory(bucketName: string) {
  console.log("UseInterceptors",UseInterceptors(new FileInterceptor(bucketName)))
  return UseInterceptors(new FileInterceptor(bucketName));
}
