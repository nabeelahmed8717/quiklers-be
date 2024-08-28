export interface CustomFile extends Express.Multer.File {
    key?: string;
    originalName?: string;
    userAvatar?:any;
  }