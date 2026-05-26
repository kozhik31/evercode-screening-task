import express from 'express';
import {verifyToken} from '../middleware/jwt.js'

const router = express.Router();

router.get('/status', verifyToken, function (req, res) {
    res.send('ok');
});

export default router