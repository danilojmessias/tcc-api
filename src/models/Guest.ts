import { Schema, model, Document, Types } from 'mongoose';

export interface IGuest extends Document {
    _id: Types.ObjectId;
    cpf: string;
    nome: string;
    descricao?: string;
    tipo: 1 | 2; // 1 = social, 2 = serviço
    residentId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const guestSchema = new Schema<IGuest>({
    cpf: {
        type: String,
        required: true,
        trim: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        trim: true,
        required: false
    },
    tipo: {
        type: Number,
        required: true,
        enum: [1, 2], // 1 = social, 2 = serviço
        validate: {
            validator: function (v: number) {
                return v === 1 || v === 2;
            },
            message: 'Tipo deve ser 1 (social) ou 2 (serviço)'
        }
    },
    residentId: {
        type: Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    }
}, {
    timestamps: true,
    collection: 'guests'
});

// Index for efficient queries by resident ID
guestSchema.index({ residentId: 1 });

// Index for efficient queries by CPF
guestSchema.index({ cpf: 1 });

export const Guest = model<IGuest>('Guest', guestSchema);