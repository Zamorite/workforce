export interface Roles {
  employee?: boolean;
  employer?: boolean;
  admin?: boolean;
}

export interface User {
  uid?: string;
  createdAt?: Date;
  roles?: Roles;

  fname: string;
  lname: string;
  email: string;
  password: string;

  phone: string;
  address: string;

  photoURL?: string;

  // Strictly for admin
  newRequests?: number;

  // Strictly for employers
  jobTitle?: string;
  company?: string;
  requests?: number;
  delivered?: number;

  // Strictly for employees
  invitations?: number;
  applications?: number;
  // last appointment
  appointDate?: Date;
  durNum?: number;
  durType?: string;

  profession?: string;
  sector?: string;
  proofURL?: string;

  referee1Name?: string;
  referee1Phone?: string;
  referee1Email?: string;
  referee1Job?: string;
  referee1Rel?: string;
  referee1Address?: string;

  referee2Name?: string;
  referee2Phone?: string;
  referee2Email?: string;
  referee2Job?: string;
  referee2Rel?: string;
  referee2Address?: string;
}
