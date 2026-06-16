import jwt from 'jsonwebtoken';
import {ForbiddenError, UnauthorizedError} from "../errors/errors.js";

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new UnauthorizedError("Токен отсутствует")
    }

    try {
        req.user = jwt.verify(token, process.env.JWT);
        next();
    } catch (error) {
        throw new ForbiddenError("Доступ запрещен")
    }
}