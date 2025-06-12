import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IVacancy, {}, {}, {}, mongoose.Document<unknown, {}, IVacancy, {}> & IVacancy & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Vacancy.d.ts.map