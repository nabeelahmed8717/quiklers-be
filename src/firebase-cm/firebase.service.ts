import { Injectable } from '@nestjs/common'; 
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor() {
    const serviceAccount = require('../../keys/fbKey.json');

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  // async sendNotification(token: string, title: string, message: string) {
  //   const payload: admin.messaging.MessagingPayload = {
  //     notification: {
  //       title: title,
  //       body: message,
  //     },
  //   };

  //   try {
  //     const response = await admin.messaging().sendToDevice(token, payload);
  //     console.log('Successfully sent message:', response);
  //     return response;
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     throw error;
  //   }
  // }

  async sendNotification(token: string, title: string, message: string) {
    const payload: any = {
        notification: {
            title: title,
            body: message,
        },
        token: token,  // The token should be part of the payload
    };

    try {
        const response = await admin.messaging().send(payload); // Use the send method instead of sendToDevice
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}


}
