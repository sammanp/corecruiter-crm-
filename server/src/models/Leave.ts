import mongoose, { Document, Schema } from 'mongoose';

export interface ILeave extends Document {
  employee: mongoose.Types.ObjectId;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency' | 'unpaid';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  rejectionReason?: string;
  documents?: string[];
  aiApproval: {
    riskScore: number; // 0-1, higher means riskier to approve
    autoApproved: boolean;
    confidence: number; // 0-1, AI confidence in decision
    factors: string[]; // reasons for the AI decision
  };
  createdAt: Date;
  updatedAt: Date;
}

const leaveSchema = new Schema<ILeave>({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['annual', 'sick', 'maternity', 'paternity', 'emergency', 'unpaid'],
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: Date,
  rejectionReason: {
    type: String,
    trim: true
  },
  documents: [String],
  aiApproval: {
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    autoApproved: {
      type: Boolean,
      default: false
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    factors: [String]
  }
}, {
  timestamps: true
});

// Indexes
leaveSchema.index({ employee: 1, startDate: -1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ approvedBy: 1 });
leaveSchema.index({ leaveType: 1 });

export default mongoose.model<ILeave>('Leave', leaveSchema);
