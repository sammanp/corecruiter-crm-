import mongoose, { Document } from 'mongoose';
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
        noticePeriod?: number;
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
declare const _default: mongoose.Model<ICandidate, {}, {}, {}, mongoose.Document<unknown, {}, ICandidate, {}> & ICandidate & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Candidate.d.ts.map