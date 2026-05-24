import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Токен отсутствует.'});
    }

    try {
        req.user = jwt.verify(token, process.env.JWT);
        next();
    } catch (error) {
        return res.status(403).json({error: 'Доступ запрещен'});
    }
}