"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', (0, auth_1.authorize)('hr', 'admin', 'employee'), (req, res) => {
    res.json({ success: true, message: 'Chat route', data: [] });
});
exports.default = router;
//# sourceMappingURL=chat.js.map