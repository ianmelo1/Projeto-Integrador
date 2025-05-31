const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Rotas simplificadas
router.get('/text/:email', reportController.generateTextReport);
router.get('/graph/:email', reportController.generateGraphReport);

module.exports = router;