export class CustomError extends Error {
    private statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;

        // 👇️ because we are extending a built-in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}