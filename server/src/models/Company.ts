import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  description?: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  email?: string;
  phone?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  logo?: string;
  isActive: boolean;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  size: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  logo: String,
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better search performance
companySchema.index({ name: 'text', industry: 'text' });
companySchema.index({ createdBy: 1 });

export default mongoose.model<ICompany>('Company', companySchema);
