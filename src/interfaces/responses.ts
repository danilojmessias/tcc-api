

export interface ResidentResponse {
  _id: string;
  name?: string;
  cpf?: string;
  phone?: string;
  email: string;
  block?: string;
  apartment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorResponse {
  _id: string;
  name: string;
  cpf: string;
  type?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitResponse {
  _id: string;
  visitor: VisitorResponse;
  date: string;
  residentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorListResponse {
  _id: string;
  residentId: string;
  records: VisitorResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface VisitListResponse {
  _id: string;
  residentId: string;
  visits: VisitResponse[];
  createdAt: string;
  updatedAt: string;
}