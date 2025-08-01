export interface Delivery {
  id: string;
  schoolName: string;
  responsibleParty: string;
  phoneNumber: string;
  observations?: string;
  createdAt: string; // ISO string
  synced: boolean;
}

export interface Collection {
  id: string;
  schoolName: string;
  responsibleParty: string;
  phoneNumber: string;
  collectedItems: string;
  observations?: string;
  createdAt: string; // ISO string
  synced: boolean;
}
