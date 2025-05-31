const express = require('express');
const router = express.Router();
const FrequenciaController = require('../controllers/frequenciaController');

router.get('/', FrequenciaController.getMinhaFrequencia);

module.exports = router;