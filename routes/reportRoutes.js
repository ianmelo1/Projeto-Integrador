const express = require('express');
const router = express.Router();

// Importação CORRETA do controller
const {
  generateTextReport,
  generateGraphReport
} = require('../controllers/reportController');

// Rotas atualizadas
router.get('/text/:email', (req, res) => {
  console.log('Rota text chamada'); // Debug
  generateTextReport(req, res).catch(err => {
    console.error('Erro na rota:', err);
    res.status(500).json({ success: false, message: 'Erro interno' });
  });
});

router.get('/graph/:email', (req, res) => {
  console.log('Rota graph chamada'); // Debug
  generateGraphReport(req, res).catch(err => {
    console.error('Erro na rota:', err);
    res.status(500).json({ success: false, message: 'Erro interno' });
  });
});

module.exports = router;