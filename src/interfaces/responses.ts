

export interface ResidentResponse {
  _id: string;
  name?: string;
  cpf?: string;
  phone?: string;
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

export interface GuestResponse {
  _id: string;
  cpf: string;
  nome: string;
  descricao?: string;
  tipo: 1 | 2; // 1 = social, 2 = serviço
  residentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestListResponse {
  _id: string;
  residentId: string;
  guests: GuestResponse[];
  createdAt: string;
  updatedAt: string;
}