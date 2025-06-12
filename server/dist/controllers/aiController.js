"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardInsights = exports.evaluateLeave = exports.analyzeSentiment = exports.predictPerformance = exports.predictAttrition = exports.matchCandidate = exports.parseResume = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Employee_1 = __importDefault(require("../models/Employee"));
const Leave_1 = __importDefault(require("../models/Leave"));
// Mock AI service - In production, this would call actual ML models
class AIService {
    // Resume parsing and matching
    static async parseResume(resumeText) {
        // Mock implementation - would use BERT/NLP models
        const skills = this.extractSkills(resumeText);
        const experience = this.extractExperience(resumeText);
        const education = this.extractEducation(resumeText);
        return {
            skills,
            experience,
            education,
            summary: resumeText.substring(0, 200) + '...'
        };
    }
    static async matchCandidateToVacancy(candidateId, vacancyId) {
        // Mock scoring algorithm - would use cosine similarity with BERT embeddings
        const matchScore = Math.random() * 100; // 0-100%
        const reasons = [
            'Strong technical skills match',
            'Relevant experience in similar role',
            'Education background aligns'
        ];
        return {
            score: matchScore,
            confidence: Math.random() * 100,
            reasons,
            recommendation: matchScore > 70 ? 'highly_recommended' : matchScore > 40 ? 'recommended' : 'not_recommended'
        };
    }
    // Attrition prediction
    static async predictAttrition(employeeId) {
        // Mock prediction - would use XGBoost/Random Forest
        const employee = await Employee_1.default.findById(employeeId);
        if (!employee)
            throw new Error('Employee not found');
        // Mock factors
        const riskFactors = [];
        let riskScore = 0.3; // Base risk
        // Analyze performance
        if (employee.performance.currentRating && employee.performance.currentRating < 6) {
            riskScore += 0.2;
            riskFactors.push('Low performance rating');
        }
        // Analyze tenure
        const tenure = Date.now() - employee.jobInfo.joinDate.getTime();
        const tenureYears = tenure / (1000 * 60 * 60 * 24 * 365);
        if (tenureYears < 1) {
            riskScore += 0.15;
            riskFactors.push('Short tenure');
        }
        // Analyze attendance
        const attendanceRate = employee.attendance.presentDays / employee.attendance.totalWorkingDays;
        if (attendanceRate < 0.85) {
            riskScore += 0.1;
            riskFactors.push('Poor attendance');
        }
        return {
            riskScore: Math.min(riskScore, 1.0),
            riskLevel: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
            factors: riskFactors,
            recommendations: this.getRetentionRecommendations(riskScore)
        };
    }
    // Performance prediction
    static async predictPerformance(employeeId) {
        // Mock prediction
        const baseScore = 5 + Math.random() * 5; // 5-10 scale
        return {
            predictedRating: Math.round(baseScore * 10) / 10,
            confidence: Math.random() * 100,
            factors: [
                'Historical performance trend',
                'Skill development progress',
                'Goal achievement rate'
            ],
            recommendations: [
                'Focus on skill development',
                'Increase goal clarity',
                'Provide regular feedback'
            ]
        };
    }
    // Sentiment analysis
    static async analyzeSentiment(text) {
        // Mock sentiment analysis - would use BERT/VADER
        const sentimentScore = (Math.random() - 0.5) * 2; // -1 to 1
        return {
            score: sentimentScore,
            sentiment: sentimentScore > 0.1 ? 'positive' : sentimentScore < -0.1 ? 'negative' : 'neutral',
            confidence: Math.random() * 100,
            emotions: {
                joy: Math.random() * 100,
                sadness: Math.random() * 100,
                anger: Math.random() * 100,
                fear: Math.random() * 100
            }
        };
    }
    // Smart leave approval
    static async evaluateLeaveRequest(leaveId) {
        const leave = await Leave_1.default.findById(leaveId).populate('employee');
        if (!leave)
            throw new Error('Leave request not found');
        let riskScore = 0.1; // Base risk
        const factors = [];
        // Check leave history
        const previousLeaves = await Leave_1.default.find({
            employee: leave.employee,
            status: 'approved',
            startDate: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        });
        if (previousLeaves.length > 10) {
            riskScore += 0.3;
            factors.push('High leave frequency');
        }
        // Check team coverage
        const teamSize = 5; // Mock team size
        if (teamSize < 3) {
            riskScore += 0.4;
            factors.push('Limited team coverage');
        }
        // Check project deadlines
        const hasUrgentDeadlines = Math.random() > 0.7; // Mock
        if (hasUrgentDeadlines) {
            riskScore += 0.2;
            factors.push('Upcoming project deadlines');
        }
        const autoApprove = riskScore < 0.3 && leave.totalDays <= 3;
        return {
            riskScore,
            autoApproved: autoApprove,
            confidence: Math.random() * 100,
            factors,
            recommendation: autoApprove ? 'auto_approve' : 'manual_review'
        };
    }
    // Helper methods
    static extractSkills(text) {
        const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'SQL', 'AWS', 'Docker'];
        return commonSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
    }
    static extractExperience(text) {
        const experienceMatch = text.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
        return experienceMatch ? parseInt(experienceMatch[1]) : 0;
    }
    static extractEducation(text) {
        const degrees = ['bachelor', 'master', 'phd', 'mba', 'b.tech', 'm.tech'];
        return degrees.filter(degree => text.toLowerCase().includes(degree));
    }
    static getRetentionRecommendations(riskScore) {
        if (riskScore > 0.7) {
            return [
                'Schedule immediate one-on-one meeting',
                'Review compensation and benefits',
                'Discuss career development opportunities',
                'Consider role adjustment or promotion'
            ];
        }
        else if (riskScore > 0.4) {
            return [
                'Increase recognition and feedback',
                'Provide skill development opportunities',
                'Review workload and work-life balance'
            ];
        }
        return ['Continue regular check-ins', 'Maintain current engagement level'];
    }
}
// AI Controller endpoints
exports.parseResume = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { resumeText } = req.body;
    if (!resumeText) {
        return res.status(400).json({
            success: false,
            message: 'Resume text is required'
        });
    }
    const parsed = await AIService.parseResume(resumeText);
    res.status(200).json({
        success: true,
        data: parsed
    });
});
exports.matchCandidate = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { candidateId, vacancyId } = req.body;
    if (!candidateId || !vacancyId) {
        return res.status(400).json({
            success: false,
            message: 'Candidate ID and Vacancy ID are required'
        });
    }
    const match = await AIService.matchCandidateToVacancy(candidateId, vacancyId);
    res.status(200).json({
        success: true,
        data: match
    });
});
exports.predictAttrition = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { employeeId } = req.params;
    const prediction = await AIService.predictAttrition(employeeId);
    // Update employee record with AI analytics
    await Employee_1.default.findByIdAndUpdate(employeeId, {
        'aiAnalytics.attritionRisk': prediction.riskScore,
        'aiAnalytics.lastAnalyzed': new Date()
    });
    res.status(200).json({
        success: true,
        data: prediction
    });
});
exports.predictPerformance = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { employeeId } = req.params;
    const prediction = await AIService.predictPerformance(employeeId);
    // Update employee record
    await Employee_1.default.findByIdAndUpdate(employeeId, {
        'aiAnalytics.performancePrediction': prediction.predictedRating,
        'aiAnalytics.lastAnalyzed': new Date()
    });
    res.status(200).json({
        success: true,
        data: prediction
    });
});
exports.analyzeSentiment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { text, employeeId } = req.body;
    if (!text) {
        return res.status(400).json({
            success: false,
            message: 'Text is required for sentiment analysis'
        });
    }
    const sentiment = await AIService.analyzeSentiment(text);
    // Update employee sentiment if employeeId provided
    if (employeeId) {
        await Employee_1.default.findByIdAndUpdate(employeeId, {
            'aiAnalytics.sentimentScore': sentiment.score,
            'aiAnalytics.lastAnalyzed': new Date()
        });
    }
    res.status(200).json({
        success: true,
        data: sentiment
    });
});
exports.evaluateLeave = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { leaveId } = req.params;
    const evaluation = await AIService.evaluateLeaveRequest(leaveId);
    // Update leave record with AI evaluation
    await Leave_1.default.findByIdAndUpdate(leaveId, {
        aiApproval: evaluation
    });
    res.status(200).json({
        success: true,
        data: evaluation
    });
});
exports.getDashboardInsights = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // Get AI insights for dashboard
    const highRiskEmployees = await Employee_1.default.find({
        'aiAnalytics.attritionRisk': { $gt: 0.7 },
        status: 'active'
    }).select('personalInfo.firstName personalInfo.lastName aiAnalytics.attritionRisk jobInfo.department');
    const lowPerformers = await Employee_1.default.find({
        'aiAnalytics.performancePrediction': { $lt: 5 },
        status: 'active'
    }).select('personalInfo.firstName personalInfo.lastName aiAnalytics.performancePrediction jobInfo.department');
    const negativeSentiment = await Employee_1.default.find({
        'aiAnalytics.sentimentScore': { $lt: -0.3 },
        status: 'active'
    }).select('personalInfo.firstName personalInfo.lastName aiAnalytics.sentimentScore jobInfo.department');
    res.status(200).json({
        success: true,
        data: {
            attritionRisk: {
                count: highRiskEmployees.length,
                employees: highRiskEmployees
            },
            performanceRisk: {
                count: lowPerformers.length,
                employees: lowPerformers
            },
            sentimentRisk: {
                count: negativeSentiment.length,
                employees: negativeSentiment
            }
        }
    });
});
//# sourceMappingURL=aiController.js.map