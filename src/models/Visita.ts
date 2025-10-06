import { Schema, model, Document, Types } from 'mongoose';
import { IVisitante } from './Visitante';

export interface IVisita extends Document {
  visitante: IVisitante;
  data: string;
  moradorId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const visitaSchema = new Schema<IVisita>({
  visitante: {
    type: Schema.Types.ObjectId,
    ref: 'Visitante',
    required: true
  },
  data: {
    type: String,
    required: true
  },
  moradorId: {
    type: Schema.Types.ObjectId,
    ref: 'Morador',
    required: true
  }
}, {
  timestamps: true,
  collection: 'visitas'
});

// Index for efficient queries by morador ID
visitaSchema.index({ moradorId: 1 });

export const Visita = model<IVisita>('Visita', visitaSchema);