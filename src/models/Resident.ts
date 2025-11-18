import { Schema, model, Document } from 'mongoose';

export interface IResident extends Document {
  name?: string;
  cpf?: string;
  phone?: string;
  block?: string;
  apartment?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const residentSchema = new Schema<IResident>({
  name: {
    type: String,
    required: false,
    trim: true
  },
  cpf: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  block: {
    type: String,
    required: false,
    trim: true
  },
  apartment: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true,
  collection: 'residents'
});


// Create compound index for block and apartment (only when both exist)
residentSchema.index({ block: 1, apartment: 1 }, {
  unique: true,
  sparse: true,
  partialFilterExpression: {
    block: { $exists: true, $ne: null },
    apartment: { $exists: true, $ne: null }
  }
});

export const Resident = model<IResident>('Resident', residentSchema);