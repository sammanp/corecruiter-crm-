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
const leaveSchema = new mongoose_1.Schema({
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['annual', 'sick', 'maternity', 'paternity', 'emergency', 'unpaid'],
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    totalDays: {
        type: Number,
        required: true,
        min: 1
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedDate: Date,
    rejectionReason: {
        type: String,
        trim: true
    },
    documents: [String],
    aiApproval: {
        riskScore: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.5
        },
        autoApproved: {
            type: Boolean,
            default: false
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        },
        factors: [String]
    }
}, {
    timestamps: true
});
// Indexes
leaveSchema.index({ employee: 1, startDate: -1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ approvedBy: 1 });
leaveSchema.index({ leaveType: 1 });
exports.default = mongoose_1.default.model('Leave', leaveSchema);
//# sourceMappingURL=Leave.js.map