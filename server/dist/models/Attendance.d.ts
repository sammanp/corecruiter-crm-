import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance, {}> & IAttendance & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Attendance.d.ts.map