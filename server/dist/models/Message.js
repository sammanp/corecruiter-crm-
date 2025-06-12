"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const messageSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
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
        entities: [mongoose_1.Schema.Types.Mixed],
        aiModel: String
    },
    attachments: [String],
    isRead: {
        type: Boolean,
        default: false
    },
    reactions: [{
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('Message', messageSchema);
//# sourceMappingURL=Message.js.map