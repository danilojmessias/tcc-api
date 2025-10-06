import { Schema, model, Document, Types } from 'mongoose';
import { IVisita } from './Visita';

export interface IListaVisitas extends Document {
  moradorId: Types.ObjectId;
  visitas: Types.ObjectId[] | IVisita[];
  createdAt?: Date;
  updatedAt?: Date;
}

const listaVisitasSchema = new Schema<IListaVisitas>({
  moradorId: {
    type: Schema.Types.ObjectId,
    ref: 'Morador',
    required: true,
    unique: true
  },
  visitas: [{
    type: Schema.Types.ObjectId,
    ref: 'Visita'
  }]
}, {
  timestamps: true,
  collection: 'lista_visitas'
});

export const ListaVisitas = model<IListaVisitas>('ListaVisitas', listaVisitasSchema);