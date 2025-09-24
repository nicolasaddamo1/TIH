import { FileFilterCallback, memoryStorage } from "multer";

export const fileUploadOptions = () => ({
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    cb(null, true);
  },
});
