import express from 'express';
import {verifyToken} from '../middleware/jwt.js'

const router = express.Router();

router.use(verifyToken)

router.get('/status', function (req, res) {
    res.send('ok');
});

export default router