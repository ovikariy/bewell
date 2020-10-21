import { ErrorCode, ErrorMessage } from "./constants";

export class AppError extends Error {
    readonly code?: string;

    constructor(message: ErrorMessage, code?: ErrorCode) {
        super(message);
        this.code = code;
    }
}