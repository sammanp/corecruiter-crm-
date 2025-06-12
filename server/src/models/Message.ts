import mongoose, { Document, Schema } from 'mongoose';

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

const messageSchema = new Schema<IMessage>({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: {
      type: String,
      enum: ['user', 'ai', 'hr'],
      required: true
    },
    id: {
      type: Schema.Types.ObjectId,
      refPath: 'sender.type === "user" ? "User" : "Employee"'
    },
    name: String
  },
  content: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    intent: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    entities: [Schema.Types.Mixed],
    aiModel: String
  },
  attachments: [String],
  isRead: {
    type: Boolean,
    default: false
  },
  reactions: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['like', 'dislike', 'helpful', 'resolved']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ 'sender.id': 1 });
messageSchema.index({ timestamp: -1 });

export default mongoose.model<IMessage>('Message', messageSchema);
