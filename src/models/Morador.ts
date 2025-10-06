import { Schema, model, Document } from 'mongoose';

export interface IMorador extends Document {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  bloco: string;
  apartamento: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const moradorSchema = new Schema<IMorador>({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  bloco: {
    type: String,
    required: true,
    trim: true
  },
  apartamento: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'moradores'
});

// Create compound index for bloco and apartamento
moradorSchema.index({ bloco: 1, apartamento: 1 }, { unique: true });

export const Morador = model<IMorador>('Morador', moradorSchema);