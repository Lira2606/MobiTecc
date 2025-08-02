export interface Delivery {
  id: string;
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
