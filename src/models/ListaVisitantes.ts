import { Schema, model, Document, Types } from 'mongoose';
import { IVisitante } from './Visitante';

export interface IListaVisitantes extends Document {
  moradorId: Types.ObjectId;
  registros: Types.ObjectId[] | IVisitante[];
  createdAt?: Date;
  updatedAt?: Date;
}

const listaVisitantesSchema = new Schema<IListaVisitantes>({
  moradorId: {
    type: Schema.Types.ObjectId,
    ref: 'Morador',
    required: true,
    unique: true
  },
  registros: [{
    type: Schema.Types.ObjectId,
    ref: 'Visitante'
  }]
}, {
  timestamps: true,
  collection: 'lista_visitantes'
});

export const ListaVisitantes = model<IListaVisitantes>('ListaVisitantes', listaVisitantesSchema);