export interface Delivery {
  id: string;
  schoolName: string;
  responsibleParty: string;
  phoneNumber: string;
  deliveredItems: string;
  observations?: string;
  createdAt: string; // ISO string
  synced: boolean;
}
