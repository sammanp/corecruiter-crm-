import mongoose, { Document } from 'mongoose';
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
        attritionRisk: number;
        performancePrediction: number;
        sentimentScore: number;
        lastAnalyzed: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}> & IEmployee & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Employee.d.ts.map