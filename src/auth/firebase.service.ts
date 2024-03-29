import * as fs from 'fs';
import { Logger, Injectable, Inject } from '@nestjs/common';
import { initializeApp, App, cert, AppOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore, Timestamp } from 'firebase-admin/firestore';

import { FirebaseOptions, Notification } from './interfaces';
import { MODULE_OPTIONS_TOKEN } from './firebase.module-definition';

const DEFAULT_MAX_REMAIN = 20;

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  app: App;
  db: Firestore;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    options?: FirebaseOptions,
  ) {
    let appOptions: AppOptions = {};

    if (options) {
      try {
        appOptions = {
          credential: cert(
            JSON.parse(fs.readFileSync(options.credentialFilePath, 'utf8')),
          ),
          databaseURL: options.databaseUri,
        };
      } catch (error) {
        this.logger.warn(
          `Call \`initializeApp\` without options. Meet error when initialize firebase: ${error}.`,
        );
      }
    }

    this.app = initializeApp(appOptions);
    this.db = getFirestore(this.app);
  }

  async verifyIdToken(idToken: string) {
    return getAuth(this.app).verifyIdToken(idToken);
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
      timeStamp: Timestamp.now(),
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

    const newLists = { edited: newEditedList, subscribed: newSubscribedList };

    await userRef.set(newLists, { merge: true });

    return newLists;
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
        timeStamp: Timestamp.now(),
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

    await userRef.set({ subscribed: newSubscribedList }, { merge: true });

    return newSubscribedList;
  }

  async accumulateUserPoints(uid: string, point: number) {
    const userRef = this.db.collection('users').doc(uid);
    const doc = await userRef.get();

    const origPoint: number = doc.get('points') ?? 0;
    const newPoint = origPoint + point;
    await userRef.set({ point: newPoint }, { merge: true });

    return newPoint;
  }

  async getUserPoints(uid: string) {
    const userRef = this.db.collection('users').doc(uid);
    const doc = await userRef.get();

    const point: number = doc.get('points') ?? 0;

    return point;
  }

  async updateNotification(
    uid: string,
    notifications: Notification[],
    maxRemain = DEFAULT_MAX_REMAIN,
  ) {
    const notiRef = this.db.collection('notifications').doc(uid);
    const doc = await notiRef.get();
    const notiList = doc.get('notifications') ?? [];

    const newNotiList = [...notiList, ...notifications].slice(-maxRemain);

    await notiRef.set({ notifications: newNotiList }, { merge: true });

    return newNotiList;
  }

  async getNotifications(uid: string) {
    const notiRef = this.db.collection('notifications').doc(uid);
    const doc = await notiRef.get();
    const notiList = doc.get('notifications') ?? [];

    return notiList;
  }
}
