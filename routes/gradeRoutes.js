const express = require('express');
const router = express.Router();
const MateriaController = require('../controllers/materiaController'); // Importa o controller que acabamos de criar

router.get('/', MateriaController.getGradeDoUsuario);

module.exports = router;