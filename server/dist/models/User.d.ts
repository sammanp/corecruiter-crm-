import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'admin' | 'hr' | 'employee';
    avatar?: string;
    phone?: string;
    department?: string;
    isActive: boolean;
    lastLogin?: Date;
    preferences: {
        theme: 'light' | 'dark';
        notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
        };
        language: string;
    };
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map