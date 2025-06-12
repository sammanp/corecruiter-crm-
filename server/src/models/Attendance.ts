import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
  location?: {
    type: 'office' | 'remote' | 'client-site';
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  notes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  overtime?: {
    hours: number;
    approved: boolean;
    reason: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: Date,
  checkOut: Date,
  totalHours: {
    type: Number,
    min: 0,
    max: 24
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day', 'on-leave'],
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['office', 'remote', 'client-site']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  notes: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  overtime: {
    hours: {
      type: Number,
      min: 0
    },
    approved: {
      type: Boolean,
      default: false
    },
    reason: String
  }
}, {
  timestamps: true
});

// Indexes
attendanceSchema.index({ employee: 1, date: -1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

// Compound index for unique employee-date combination
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
