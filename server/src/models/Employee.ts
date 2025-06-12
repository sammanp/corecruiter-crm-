import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    profilePicture?: string;
  };
  jobInfo: {
    position: string;
    department: string;
    manager: mongoose.Types.ObjectId;
    joinDate: Date;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    salary: {
      amount: number;
      currency: string;
      period: 'hourly' | 'monthly' | 'yearly';
    };
    workLocation: 'remote' | 'onsite' | 'hybrid';
  };
  performance: {
    currentRating?: number;
    goals: string[];
    achievements: string[];
    lastReviewDate?: Date;
    nextReviewDate?: Date;
  };
  attendance: {
    totalWorkingDays: number;
    presentDays: number;
    absentDays: number;
    lateArrivals: number;
    earlyDepartures: number;
  };
  skills: string[];
  documents: {
    resume?: string;
    contract?: string;
    idProof?: string;
    others: string[];
  };
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  aiAnalytics: {
    attritionRisk: number; // 0-1 probability
    performancePrediction: number; // 0-10 scale
    sentimentScore: number; // -1 to 1
    lastAnalyzed: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  personalInfo: {
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
      required: [true, 'Phone number is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    profilePicture: String
  },
  jobInfo: {
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    },
    joinDate: {
      type: Date,
      required: true
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern'],
      required: true
    },
    salary: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'USD'
      },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'monthly'
      }
    },
    workLocation: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'onsite'
    }
  },
  performance: {
    currentRating: {
      type: Number,
      min: 0,
      max: 10
    },
    goals: [String],
    achievements: [String],
    lastReviewDate: Date,
    nextReviewDate: Date
  },
  attendance: {
    totalWorkingDays: {
      type: Number,
      default: 0
    },
    presentDays: {
      type: Number,
      default: 0
    },
    absentDays: {
      type: Number,
      default: 0
    },
    lateArrivals: {
      type: Number,
      default: 0
    },
    earlyDepartures: {
      type: Number,
      default: 0
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  documents: {
    resume: String,
    contract: String,
    idProof: String,
    others: [String]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'on-leave'],
    default: 'active'
  },
  aiAnalytics: {
    attritionRisk: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    performancePrediction: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
      default: 0
    },
    lastAnalyzed: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ 'personalInfo.email': 1 });
employeeSchema.index({ 'jobInfo.department': 1 });
employeeSchema.index({ 'jobInfo.manager': 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text' });

export default mongoose.model<IEmployee>('Employee', employeeSchema);
