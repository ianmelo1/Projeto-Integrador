const express = require('express');
const router = express.Router();
const { getAnalisesTurmas } = require('../controllers/professorController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware para verificar se é professor
const verificarProfessor = (req, res, next) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ error: 'Acesso negado. Apenas professores podem acessar esta funcionalidade.' });
  }
  next();
};

// Rota para obter análises das turmas
router.get('/analises-turmas', authMiddleware, verificarProfessor, getAnalisesTurmas);

module.exports = router;
