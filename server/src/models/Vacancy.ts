import mongoose, { Document, Schema } from 'mongoose';

export interface IVacancy extends Document {
  title: string;
  description: string;
  company: mongoose.Types.ObjectId;
  department?: string;
  location: {
    type: 'remote' | 'onsite' | 'hybrid';
    city?: string;
    country?: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  skills: string[];
  requirements: string[];
  benefits?: string[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  applicationsCount: number;
  deadline?: Date;
  createdBy: mongoose.Types.ObjectId;
  assignedRecruiters: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const vacancySchema = new Schema<IVacancy>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  department: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: true
    },
    city: String,
    country: String
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed'],
    default: 'draft'
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  deadline: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedRecruiters: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better search performance
vacancySchema.index({ title: 'text', description: 'text', skills: 'text' });
vacancySchema.index({ company: 1, status: 1 });
vacancySchema.index({ createdBy: 1 });
vacancySchema.index({ assignedRecruiters: 1 });

export default mongoose.model<IVacancy>('Vacancy', vacancySchema);
