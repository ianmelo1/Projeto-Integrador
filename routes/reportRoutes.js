const express = require('express');
const router = express.Router();



router.get('/grade/:alunoId', async (req, res) => {
  try {
    const boletim = await Boletim.findOne({ aluno: req.params.alunoId });

    if (!boletim) return res.status(404).json({ message: 'Boletim não encontrado.' });

    res.json(boletim.materias); // Só retorna as matérias
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar boletim.', error: err });
  }
});
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