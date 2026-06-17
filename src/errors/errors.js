export class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = 400
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = 404
    }
}

export class RequestError extends Error {
    constructor(message, code) {
        super(message)
        this.statusCode = code
    }
}

export class ForbiddenError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = 403
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = 401
    }
}