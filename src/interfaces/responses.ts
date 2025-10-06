

export interface MoradorResponse {
  _id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  bloco: string;
  apartamento: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitanteResponse {
  _id: string;
  nome: string;
  cpf: string;
  tipo?: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitaResponse {
  _id: string;
  visitante: VisitanteResponse;
  data: string;
  moradorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListaVisitantesResponse {
  _id: string;
  moradorId: string;
  registros: VisitanteResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ListaVisitasResponse {
  _id: string;
  moradorId: string;
  visitas: VisitaResponse[];
  createdAt: string;
  updatedAt: string;
}