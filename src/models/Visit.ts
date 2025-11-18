import { Schema, model, Document, Types } from 'mongoose';
import { IGuest } from './Guest';

export interface IVisit extends Document {
    guest: Types.ObjectId | IGuest;
    date: string;
    residentId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const visitSchema = new Schema<IVisit>({
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    residentId: {
        type: Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    }
}, {
    timestamps: true,
    collection: 'visits'
});

// Index for efficient queries by resident ID
visitSchema.index({ residentId: 1 });

export const Visit = model<IVisit>('Visit', visitSchema);