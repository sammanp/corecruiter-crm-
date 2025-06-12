import { Request, Response, NextFunction } from 'express';
export interface ErrorResponse extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=errorHandler.d.ts.map