import { Claim } from './claim.model';
export interface Assessment {
    idAssessment: string;
    assessmentDate: Date;
    findings: string;
    assessmentDocuments: string[];
    statusAssessment: StatusAssessment;
    finalDecision: FinalDecision;
    submissionDate: Date;
    claim: Claim;
  }
  
  export enum StatusAssessment {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED'
  }
  
  export enum FinalDecision {
    IN_REVIEW = 'IN_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
  }