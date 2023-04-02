import { Timestamp } from 'firebase-admin/firestore';

export interface Notification {
  articleId: string;
  lastUpdatedAt: Timestamp;
  title: string;
  type: string;
}
