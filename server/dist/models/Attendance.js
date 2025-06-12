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
const attendanceSchema = new mongoose_1.Schema({
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: Date,
    checkOut: Date,
    totalHours: {
        type: Number,
        min: 0,
        max: 24
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half-day', 'on-leave'],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['office', 'remote', 'client-site']
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        address: String
    },
    notes: {
        type: String,
        trim: true
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    overtime: {
        hours: {
            type: Number,
            min: 0
        },
        approved: {
            type: Boolean,
            default: false
        },
        reason: String
    }
}, {
    timestamps: true
});
// Indexes
attendanceSchema.index({ employee: 1, date: -1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });
// Compound index for unique employee-date combination
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Attendance', attendanceSchema);
//# sourceMappingURL=Attendance.js.map