export interface Delivery {
  id: string;
  type: 'delivery';
  schoolName: string;
  department?: string;
  item: string;
  responsibleParty: string;
  role: string;
  phoneNumber: string;
  observations?: string;
  createdAt: string; // ISO string
  synced: boolean;
  photoDataUri?: string;
}

export interface Collection {
  id: string;
  type: 'collection';
  schoolName: string;
  department?: string;
  item: string;
  responsibleParty: string;
  role: string;
  phoneNumber: string;
  observations?: string;
  createdAt: string; // ISO string
  synced: boolean;
  photoDataUri?: string;
}

export type HistoryItem = Delivery | Collection;
