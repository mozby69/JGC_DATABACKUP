import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { AppError } from "@/errors/app-error";
import { ErrorCodes } from "@/errors/error-codes";

// error-handler.middleware.ts

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    if (res.headersSent) return _next(error);
    if (error instanceof ZodError) return res.status(400).json({ success: false, message: "Validation failed", errors: error.issues });
    if (error instanceof MulterError) return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ success: false, message: error.message });
    if (error instanceof AppError) {
        req.log.warn(
            {
                code: error.code,
                statusCode: error.statusCode,
                requestId: req.id,
                path: req.originalUrl,
            },
            error.message
        );

        return res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
        });
    }

    req.log.error(
        {
            err: error,
            requestId: req.id,
            userId: req.user?.id,
            method: req.method,
            path: req.originalUrl,
        },
        "Unhandled application error"
    );

    return res.status(500).json({
        success: false,
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
    });
}