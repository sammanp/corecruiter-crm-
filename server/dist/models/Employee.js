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
const employeeSchema = new mongoose_1.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    personalInfo: {
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
            required: [true, 'Phone number is required'],
            trim: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String
        },
        profilePicture: String
    },
    jobInfo: {
        position: {
            type: String,
            required: [true, 'Position is required'],
            trim: true
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true
        },
        manager: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        joinDate: {
            type: Date,
            required: true
        },
        employmentType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'intern'],
            required: true
        },
        salary: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                default: 'USD'
            },
            period: {
                type: String,
                enum: ['hourly', 'monthly', 'yearly'],
                default: 'monthly'
            }
        },
        workLocation: {
            type: String,
            enum: ['remote', 'onsite', 'hybrid'],
            default: 'onsite'
        }
    },
    performance: {
        currentRating: {
            type: Number,
            min: 0,
            max: 10
        },
        goals: [String],
        achievements: [String],
        lastReviewDate: Date,
        nextReviewDate: Date
    },
    attendance: {
        totalWorkingDays: {
            type: Number,
            default: 0
        },
        presentDays: {
            type: Number,
            default: 0
        },
        absentDays: {
            type: Number,
            default: 0
        },
        lateArrivals: {
            type: Number,
            default: 0
        },
        earlyDepartures: {
            type: Number,
            default: 0
        }
    },
    skills: [{
            type: String,
            trim: true
        }],
    documents: {
        resume: String,
        contract: String,
        idProof: String,
        others: [String]
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'terminated', 'on-leave'],
        default: 'active'
    },
    aiAnalytics: {
        attritionRisk: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        },
        performancePrediction: {
            type: Number,
            min: 0,
            max: 10,
            default: 5
        },
        sentimentScore: {
            type: Number,
            min: -1,
            max: 1,
            default: 0
        },
        lastAnalyzed: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});
// Indexes for better performance
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ 'personalInfo.email': 1 });
employeeSchema.index({ 'jobInfo.department': 1 });
employeeSchema.index({ 'jobInfo.manager': 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text' });
exports.default = mongoose_1.default.model('Employee', employeeSchema);
//# sourceMappingURL=Employee.js.map