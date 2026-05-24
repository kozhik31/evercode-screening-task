import express from 'express';
const router = express.Router();

router.get('/status', function(req, res) {
  res.send('ok');
});

export default router