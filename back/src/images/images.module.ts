import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, FirebaseService],
})
export class ImagesModule {}
