import { Assessment } from './assessment.model';
export interface Claim {
    idClaim: string;
    fullName: string;
    claimName: string;
    submissionDate: Date;
    statusClaim: StatusClaim;
    claimReason: string;
    description: string;
    supportingDocuments: { name: string, url: string }[];
    assessment?: Assessment | null; 
 }
  
  export enum StatusClaim {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IN_REVIEW = 'IN_REVIEW'
  }