const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');




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

// Rotas simplificadas
router.get('/text/:email', reportController.generateTextReport);
router.get('/graph/:email', reportController.generateGraphReport);


