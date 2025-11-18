import { Schema, model, Document, Types } from 'mongoose';
import { IVisit } from './Visit';

export interface IListaVisits extends Document {
    residentId: Types.ObjectId;
    visits: Types.ObjectId[] | IVisit[];
    createdAt?: Date;
    updatedAt?: Date;
}

const listaVisitsSchema = new Schema<IListaVisits>({
    residentId: {
        type: Schema.Types.ObjectId,
        ref: 'Resident',
        required: true,
        unique: true
    },
    visits: [{
        type: Schema.Types.ObjectId,
        ref: 'Visit'
    }]
}, {
    timestamps: true,
    collection: 'lista_visits'
});

export const ListaVisits = model<IListaVisits>('ListaVisits', listaVisitsSchema);