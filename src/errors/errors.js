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

export class ForbiddenError extends Error {
    constructor(message) {
        super(message)
        this.statusCcode = 403
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message)
        this.statusCcode = 401
    }
}