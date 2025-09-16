import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import serviceAccount from '../config/firebase-service-account.json';

@Injectable()
export class FirebaseService {
  public firestore: admin.firestore.Firestore;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: 'tlih-7d46c',
    });
    this.firestore = admin.firestore();
  }
}
