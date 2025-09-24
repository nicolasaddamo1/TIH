import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { Bucket } from '@google-cloud/storage';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private bucket: Bucket;
  private static initialized = false;

  onModuleInit() {
    if (FirebaseService.initialized) {
      return;
    }

    // En desarrollo, buscar en src/config/firebase/
    // En producción (Docker), buscar en la raíz del directorio
    const devPath = path.join(
      process.cwd(),
      'src/config/firebase/firebase-service-account.json',
    );

    const prodPath = path.join(process.cwd(), 'firebase-service-account.json');

    const serviceAccountPath = fs.existsSync(devPath) ? devPath : prodPath;

    if (!fs.existsSync(serviceAccountPath)) {
      console.error('Firebase service account file not found');
      console.error('Tried paths:');
      console.error('- Development:', devPath);
      console.error('- Production:', prodPath);
      console.error('Current working directory:', process.cwd());
      throw new Error(
        `Firebase service account file not found. Tried: ${devPath} and ${prodPath}`,
      );
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf-8'),
    ) as ServiceAccount;

    // ⚡ Evita inicializar Firebase más de una vez
    const app = !admin.apps.length
      ? admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.STORAGE_URL,
        })
      : admin.app();

    this.bucket = app.storage().bucket();
    FirebaseService.initialized = true;
  }

  getBucket(): Bucket {
    return this.bucket;
  }

  async uploadFile(filePath: string, destination: string): Promise<string> {
    await this.bucket.upload(filePath, {
      destination,
      metadata: {
        cacheControl: 'public,max-age=31536000',
      },
    });

    const file = this.bucket.file(destination);
    await file.makePublic();

    return file.publicUrl();
  }

  async uploadFileBuffer(
    buffer: Buffer,
    destination: string,
    contentType: string,
  ): Promise<string> {
    console.log('🔥 Firebase: Starting upload');
    console.log('🔥 Firebase: Destination:', destination);
    console.log('🔥 Firebase: Buffer size:', buffer.length);
    console.log('🔥 Firebase: Content type:', contentType);

    const file = this.bucket.file(destination);
    console.log('🔥 Firebase: File reference created');

    await file.save(buffer, {
      metadata: {
        contentType,
        cacheControl: 'public,max-age=31536000',
      },
    });
    console.log('🔥 Firebase: File saved to bucket');

    await file.makePublic();
    console.log('🔥 Firebase: File made public');

    const publicUrl = file.publicUrl();
    console.log('🔥 Firebase: Public URL:', publicUrl);

    return publicUrl;
  }
}
