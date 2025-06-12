import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  avatar?: string;
  resume?: string;
  coverLetter?: string;
  skills: string[];
  experience: {
    years: number;
    level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  };
  education: {
    degree?: string;
    institution?: string;
    graduationYear?: number;
  }[];
  workHistory: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
    isCurrent: boolean;
  }[];
  expectedSalary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  availability: {
    startDate?: Date;
    noticePeriod?: number; // in days
  };
  status: 'new' | 'screening' | 'interviewing' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  source: 'website' | 'referral' | 'linkedin' | 'job_board' | 'social_media' | 'other';
  tags: string[];
  notes: {
    content: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  applications: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  assignedRecruiter?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
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
  avatar: String,
  resume: String,
  coverLetter: String,
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    years: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      default: 'entry'
    }
  },
  education: [{
    degree: String,
    institution: String,
    graduationYear: Number
  }],
  workHistory: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    description: String,
    isCurrent: {
      type: Boolean,
      default: false
    }
  }],
  expectedSalary: {
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
  availability: {
    startDate: Date,
    noticePeriod: Number
  },
  status: {
    type: String,
    enum: ['new', 'screening', 'interviewing', 'offer', 'hired', 'rejected', 'withdrawn'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'linkedin', 'job_board', 'social_media', 'other'],
    default: 'website'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'Application'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedRecruiter: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better search performance
candidateSchema.index({ firstName: 'text', lastName: 'text', email: 'text', skills: 'text' });
candidateSchema.index({ email: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ assignedRecruiter: 1 });
candidateSchema.index({ createdBy: 1 });

export default mongoose.model<ICandidate>('Candidate', candidateSchema);
