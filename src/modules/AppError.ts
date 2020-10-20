import { ErrorCode, ErrorMessage } from "./Constants";

export class AppError extends Error {
    readonly code?: string;

    constructor(message: ErrorMessage, code?: ErrorCode) {
        super(message);
        this.code = code;
    }
}