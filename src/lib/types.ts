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

export interface Visit {
  id: string;
  type: 'visit';
  inep?: string;
  schoolName: string;
  schoolAddress: string;
  createdAt: string; // ISO string
  synced: boolean;
}

export interface Shipment {
  id: string;
  type: 'shipment';
  schoolName: string;
  department?: string;
  item: string;
  sender: string;
  shippingMethod: string;
  shippingStatus: 'Pendente' | 'Em trânsito' | 'Entregue';
  trackingCode?: string;
  createdAt: string; // ISO string
  synced: boolean;
}


export type HistoryItem = Delivery | Collection | Visit | Shipment;