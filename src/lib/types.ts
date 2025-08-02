export interface Delivery {
  id: string;
  schoolName: string;
  responsibleParty: string;
  role: string;
  phoneNumber: string;
  observations?: string;
  createdAt: string; // ISO string
  synced: boolean;
}

export interface Collection {
  id: string;
  schoolName: string;
  responsibleParty: string;
  role: string;
  phoneNumber: string;
  observations?: string;
  createdAt: string; // ISO string
  synced: boolean;
}
