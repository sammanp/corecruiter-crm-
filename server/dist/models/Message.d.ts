import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    conversationId: string;
    sender: {
        type: 'user' | 'ai' | 'hr';
        id?: mongoose.Types.ObjectId;
        name?: string;
    };
    content: string;
    messageType: 'text' | 'file' | 'image' | 'system';
    timestamp: Date;
    metadata?: {
        intent?: string;
        confidence?: number;
        entities?: any[];
        aiModel?: string;
    };
    attachments?: string[];
    isRead: boolean;
    reactions?: {
        userId: mongoose.Types.ObjectId;
        type: 'like' | 'dislike' | 'helpful' | 'resolved';
        timestamp: Date;
    }[];
}
declare const _default: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Message.d.ts.map