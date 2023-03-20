import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  app: admin.app.App;
  db: admin.firestore.Firestore;

  constructor(configService: ConfigService) {
    const firebaseConfigFilePath = configService.get<string>(
      'FIREBASE_CREDENTIALS',
    );

    const firebaseDbUrl = configService.get<string>('FIREBASE_DB_URL');

    import(firebaseConfigFilePath).then((firebaseConfig) => {
      this.app = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: firebaseDbUrl,
      });
      this.db = this.app.firestore();
    });
  }

  async verifyIdToken(idToken: string) {
    return this.app.auth().verifyIdToken(idToken);
  }

  async getUserInfo(uid: string) {
    return this.db.collection('users').doc(uid).get();
  }

  private upsertElementByArticleId = (
    articleId: string,
    list: any[],
    element: any,
  ) => {
    const newArray = [...list];
    const index = list.findIndex((s) => s.articleId === articleId);
    index !== -1 ? (newArray[index] = element) : newArray.push(element);
    return newArray;
  };

  async updateArticleRecord(uid: string, articleId: string) {
    const userRef = this.db.collection('articles').doc(uid);
    const doc = await userRef.get();

    const editedList = doc.get('edited') ?? [];
    const subscribedList = doc.get('subscribed') ?? [];
    const element = {
      articleId,
      timeStamp: admin.firestore.Timestamp.now(),
    };

    const newEditedList = this.upsertElementByArticleId(
      articleId,
      editedList,
      element,
    );
    const newSubscribedList = this.upsertElementByArticleId(
      articleId,
      subscribedList,
      element,
    );

    userRef.set(
      { edited: newEditedList, subscribed: newSubscribedList },
      { merge: true },
    );

    return Promise.resolve({
      edited: newEditedList,
      subscribed: newSubscribedList,
    });
  }

  async updateArticleSubscription(
    uid: string,
    articleId: string,
    isSubscribe: boolean,
  ) {
    const userRef = this.db.collection('articles').doc(uid);
    const doc = await userRef.get();

    const subscribedList = doc.get('subscribed') ?? [];

    let newSubscribedList = [];

    if (isSubscribe) {
      const element = {
        articleId,
        timeStamp: admin.firestore.Timestamp.now(),
      };
      newSubscribedList = this.upsertElementByArticleId(
        articleId,
        subscribedList,
        element,
      );
    } else {
      newSubscribedList = subscribedList.filter(
        (s: any) => s.articleId !== articleId,
      );
    }

    userRef.set({ subscribed: newSubscribedList }, { merge: true });

    return Promise.resolve(newSubscribedList);
  }

  async accumulateUserPoints(uid: string, point: number) {
    const userRef = this.db.collection('users').doc(uid);
    const doc = await userRef.get();

    const origPoint: number = doc.get('points') ?? 0;
    const newPoint = origPoint + point;
    userRef.set({ point: newPoint }, { merge: true });

    return Promise.resolve(newPoint);
  }

  async getUserPoints(uid: string) {
    const userRef = this.db.collection('users').doc(uid);
    const doc = await userRef.get();

    const point: number = doc.get('points') ?? 0;

    return Promise.resolve(point);
  }

  async updateNotification(uid: string, notifications: any[], maxRemain = 20) {
    const notiRef = this.db.collection('notifications').doc(uid);
    const doc = await notiRef.get();
    const notiList = doc.get('notifications') ?? [];

    const newNotiList = [...notiList, ...notifications].slice(-maxRemain);

    notiRef.set({ notifications: newNotiList }, { merge: true });

    return Promise.resolve(newNotiList);
  }

  async getNotifications(uid: string) {
    const notiRef = this.db.collection('notifications').doc(uid);
    const doc = await notiRef.get();
    const notiList = doc.get('notifications') ?? [];

    return Promise.resolve(notiList);
  }
}
