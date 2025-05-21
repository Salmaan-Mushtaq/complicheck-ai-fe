import type { QueryClient } from "@tanstack/react-query";

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  succeeded: boolean;
}


export interface RootRouteContext {
  queryClient: QueryClient;
}

export interface Option {
  value: string | number;
  label: string;
}
export interface Collaborator {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: number;
  fullName: string;
}
export interface Project {
  id: number;
  name: string;
  description: string;
  casesCount: number;
  collaborators: Collaborator[];
  createdAt: string;
  updatedAt: string;
}
export interface ProjectData {
  results: Project[];
  totalCount: number;
}
export interface CasesData {
  results: Case[];
  totalCount: number;
}
export interface Case {
  id: number;
  name: string;
  caseType: number;
  complianceScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  versionCount: number;
  jobId: string;
  versionId: number;
  analysisStatus: 0 | 1 | 2 | 3;
  category: 0 | 1 | 2;
  isReanalyses?: boolean;
  createdAt: string;
  updatedAt: string | null;
}
export interface SummaryData {
  summary: Summary;
  issues: RiskLevelIssues;
  metadata: any;
}
export interface RiskLevelIssues {
  highRiskIssues: Issue[];
  mediumRiskIssues: Issue[];
  lowRiskIssues: Issue[];
}
export interface Issue {
  id: number;
  Description: string;
  IssueType: string;
  RelevantABPICodeSection: string;
  LocationInContent: string;
  SeverityLevel: string;
  SuggestedCorrection: string;
  SupportingInformation: string;
  ImpactedAudience: string;
  RiskToReputation: string;
  PriorityForReview: string;
  createdAt: string;
  updatedAt?: string | null;
}
export interface Summary {
  highRiskCount: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  numIssuesFlagged: number;
  content: string;
  fileBlobUrl: string;
  id: number;
  createdAt: string;
  updatedAt: any;
}
export interface Version {
  versionId: number;
  createdAt: string;
  fullName: string;
}

export interface UserData {
  results: User[];
  totalCount: number;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  roleName: string;
  createdAt: string;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface ComplianceDetails {
  id: number;
  post_Url: string;
  claimText: string;
  isCompliant: boolean;
  severity: string;
  explanation: string;
  imageUrl: any;
  clauses: Clause[];
  pageNumbers: number[];
}
export interface Clause {
  clause_number: number;
  title: string;
  clause_text: string;
}
export interface ClaimData {
  caseId: number;
  sourceLink: string | null;
  sourceText: string | null;
  screenShot: string | null;
  createdAt: string;
  category: 0 | 1 | 2;
  complianceDetails: ComplianceDetails[];
}
