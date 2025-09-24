import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ImagesService {
  constructor(private firebaseService: FirebaseService) {}

  async uploadFileBuffer(
    buffer: Buffer,
    destination: string,
    contentType: string,
  ): Promise<string> {
    return this.firebaseService.uploadFileBuffer(
      buffer,
      destination,
      contentType,
    );
  }

  async processMainImage(file: Express.Multer.File): Promise<string> {
    const destination = `main-images/${Date.now()}-${file.originalname}`;
    return this.uploadFileBuffer(file.buffer, destination, file.mimetype);
  }

  async processLocationImage(
    file: Express.Multer.File,
    type: 'ceremonia' | 'recepcion',
  ): Promise<string> {
    const destination = `locations/${type}/${Date.now()}-${file.originalname}`;
    return this.uploadFileBuffer(file.buffer, destination, file.mimetype);
  }

  async processLogoFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(
      files.map((file) => {
        const destination = `logos/${Date.now()}-${file.originalname}`;
        return this.uploadFileBuffer(file.buffer, destination, file.mimetype);
      }),
    );
  }
}
