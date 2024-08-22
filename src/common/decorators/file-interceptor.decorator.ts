// import { FileInterceptor } from '@nestjs/platform-express';
// import { UseInterceptors } from '@nestjs/common';
// import * as multerS3 from 'multer-s3';
// import { S3Client } from '@aws-sdk/client-s3';

// export function FileInterceptorFactory(s3Config: {
//   region: string;
//   credentials: {
//     accessKeyId: string;
//     secretAccessKey: string;
//   };
//   bucketName: string;
// }) {
//   const s3 = new S3Client({
//     region: s3Config.region,
//     credentials: s3Config.credentials,
//   });

//   return UseInterceptors(
//     FileInterceptor('file', {
//       storage: multerS3({
//         s3: s3,
//         bucket: s3Config.bucketName,
//         acl: 'public-read',
//         key: (req, file, cb) => {
//           const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//           cb(null, `${randomName}-${file.originalname}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
//           cb(new Error('Unsupported file type'), false);
//         }
//         cb(null, true);
//       },
//     })
//   );
// }

// import { FileInterceptor } from '@nestjs/platform-express';
// import { UseInterceptors } from '@nestjs/common';
// import * as multerS3 from 'multer-s3';
// import { S3Client } from '@aws-sdk/client-s3';

// export function FileInterceptorFactory(s3Config: {
//   region: string;
//   credentials: {
//     accessKeyId: string;
//     secretAccessKey: string;
//   };
//   bucketName: string;
// }) {
//   const s3 = new S3Client({
//     region: s3Config.region,
//     credentials: s3Config.credentials,
//     forcePathStyle: true, // This is important
//     endpoint: `https://s3.${s3Config.region}.amazonaws.com`, // Specify the endpoint
//   });

//   return UseInterceptors(
//     FileInterceptor('file', {
//       storage: multerS3({
//         s3: s3,
//         bucket: s3Config.bucketName,
//         acl: 'public-read',
//         key: (req, file, cb) => {
//           const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//           cb(null, `${randomName}-${file.originalname}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
//           cb(new Error('Unsupported file type'), false);
//         }
//         cb(null, true);
//       },
//     })
//   );
// }

// import { FileInterceptor } from '@nestjs/platform-express';
// import { UseInterceptors } from '@nestjs/common';
// import * as multerS3 from 'multer-s3';
// import { s3Client } from '../providers/s3-client.provider';

// export function FileInterceptorFactory(bucketName: string) {
//   return UseInterceptors(
//     FileInterceptor('file', {
//       storage: multerS3({
//         s3: s3Client,
//         bucket: bucketName,
//         acl: 'public-read',
//         key: (req, file, cb) => {
//           const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//           cb(null, `${randomName}-${file.originalname}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
//           cb(new Error('Unsupported file type'), false);
//         }
//         cb(null, true);
//       },
//     })
//   );
// }



import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import * as multerS3 from 'multer-s3';
import { s3Client } from '../providers/s3-client.provider';

export function FileInterceptorFactory(bucketName: string) {
  return UseInterceptors(
    FileInterceptor('file', {
      storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        key: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
      },
    })
  );
}
