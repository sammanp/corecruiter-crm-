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
const candidateSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    avatar: String,
    resume: String,
    coverLetter: String,
    skills: [{
            type: String,
            trim: true
        }],
    experience: {
        years: {
            type: Number,
            default: 0
        },
        level: {
            type: String,
            enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
            default: 'entry'
        }
    },
    education: [{
            degree: String,
            institution: String,
            graduationYear: Number
        }],
    workHistory: [{
            company: {
                type: String,
                required: true
            },
            position: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: Date,
            description: String,
            isCurrent: {
                type: Boolean,
                default: false
            }
        }],
    expectedSalary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        },
        period: {
            type: String,
            enum: ['hourly', 'monthly', 'yearly'],
            default: 'yearly'
        }
    },
    availability: {
        startDate: Date,
        noticePeriod: Number
    },
    status: {
        type: String,
        enum: ['new', 'screening', 'interviewing', 'offer', 'hired', 'rejected', 'withdrawn'],
        default: 'new'
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'linkedin', 'job_board', 'social_media', 'other'],
        default: 'website'
    },
    tags: [{
            type: String,
            trim: true
        }],
    notes: [{
            content: {
                type: String,
                required: true
            },
            createdBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
    applications: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Application'
        }],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedRecruiter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
// Indexes for better search performance
candidateSchema.index({ firstName: 'text', lastName: 'text', email: 'text', skills: 'text' });
candidateSchema.index({ email: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ assignedRecruiter: 1 });
candidateSchema.index({ createdBy: 1 });
exports.default = mongoose_1.default.model('Candidate', candidateSchema);
//# sourceMappingURL=Candidate.js.map