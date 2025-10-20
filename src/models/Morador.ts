import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IMorador extends Document {
  name?: string;
  cpf?: string;
  phone?: string;
  email: string;
  password: string;
  block?: string;
  apartment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const moradorSchema = new Schema<IMorador>({
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
  }
}, {
  timestamps: true,
  collection: 'residents'
});

// Hash password before saving
moradorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
moradorSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
moradorSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Create compound index for block and apartment (only when both exist)
moradorSchema.index({ block: 1, apartment: 1 }, {
  unique: true,
  sparse: true,
  partialFilterExpression: {
    block: { $exists: true, $ne: null },
    apartment: { $exists: true, $ne: null }
  }
});

export const Morador = model<IMorador>('Morador', moradorSchema);