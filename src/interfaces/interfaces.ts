import { type Timestamp } from '@firebase/firestore-types';

export interface Gasto {
  id?: string;
  name?: string;
  description?: string;
  price?: number | string;
  buyDate?: Timestamp;
}
