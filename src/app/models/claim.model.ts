import { Assessment } from './assessment.model';
export interface Claim {
    idClaim: string;
    fullName: string;
    claimName: string;
    submissionDate: Date;
    statusClaim: StatusClaim;
    claimReason: string;
    description: string;
    userId: number;
    supportingDocuments: { name: string, url: string }[];
    assessment?: Assessment | null; 
    isUpdating?: boolean; 
    user?: User;
 }
  
  export enum StatusClaim {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IN_REVIEW = 'IN_REVIEW'
  }
  export interface User {
    id: number;
    username: string;
    email: string;
    accountBalance?: number;  // The ? makes this property optional
    phoneNumber?: string;
    address?: string;
    role : 'ADMIN' | 'CUSTOMER' | 'AGENT';
    image?: string;
    // Add any other properties your user object might have
  }