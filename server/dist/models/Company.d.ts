import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ICompany, {}, {}, {}, mongoose.Document<unknown, {}, ICompany, {}> & ICompany & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Company.d.ts.map