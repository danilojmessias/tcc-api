import { Schema, model, Document, Types } from 'mongoose';
import { IGuest } from './Guest';

export interface IListaGuests extends Document {
    residentId: Types.ObjectId;
    guests: Types.ObjectId[] | IGuest[];
    createdAt?: Date;
    updatedAt?: Date;
}

const listaGuestsSchema = new Schema<IListaGuests>({
    residentId: {
        type: Schema.Types.ObjectId,
        ref: 'Resident',
        required: true,
        unique: true
    },
    guests: [{
        type: Schema.Types.ObjectId,
        ref: 'Guest'
    }]
}, {
    timestamps: true,
    collection: 'lista_guests'
});

export const ListaGuests = model<IListaGuests>('ListaGuests', listaGuestsSchema);