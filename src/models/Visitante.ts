import { Schema, model, Document } from 'mongoose';

export interface IVisitante extends Document {
  nome: string;
  cpf: string;
  tipo?: string;
  descricao?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const visitanteSchema = new Schema<IVisitante>({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'visitantes'
});

export const Visitante = model<IVisitante>('Visitante', visitanteSchema);