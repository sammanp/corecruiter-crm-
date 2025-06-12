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
const vacancySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    department: {
        type: String,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['remote', 'onsite', 'hybrid'],
            required: true
        },
        city: String,
        country: String
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
        required: true
    },
    salary: {
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
    skills: [{
            type: String,
            trim: true
        }],
    requirements: [{
            type: String,
            trim: true
        }],
    benefits: [{
            type: String,
            trim: true
        }],
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'closed'],
        default: 'draft'
    },
    applicationsCount: {
        type: Number,
        default: 0
    },
    deadline: Date,
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedRecruiters: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }]
}, {
    timestamps: true
});
// Indexes for better search performance
vacancySchema.index({ title: 'text', description: 'text', skills: 'text' });
vacancySchema.index({ company: 1, status: 1 });
vacancySchema.index({ createdBy: 1 });
vacancySchema.index({ assignedRecruiters: 1 });
exports.default = mongoose_1.default.model('Vacancy', vacancySchema);
//# sourceMappingURL=Vacancy.js.map