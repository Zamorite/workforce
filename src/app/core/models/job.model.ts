export interface Job {
  owner?: any;
  id?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerAddress?: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  expiryDate: Date;
  no: number;
  sector: string;
  delivered?: boolean;
  createdAt?: Date;
  invitees?: any[];
  confirmed?: any[];
}
