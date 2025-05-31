// controllers/MateriaController.js

const Boletim = require('../models/Boletim'); // Ajuste o caminho se necessário

const MateriaController = {
    getGradeDoUsuario: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                // Seu check de autenticação continua igual
                console.warn("MateriaController: Tentativa de acesso à grade sem ID de usuário no token (req.user.id ausente).");
                return res.status(401).json({ message: "Usuário não autenticado ou token inválido." });
            }
            const userId = req.user.id;

            const boletimDoUsuario = await Boletim.findOne({ aluno: userId }).lean();

            if (!boletimDoUsuario) {
                console.log(`MateriaController: Nenhum boletim encontrado para o usuário ID: ${userId}`);
                return res.json([]);
            }

            if (!boletimDoUsuario.materias || boletimDoUsuario.materias.length === 0) {
                console.log(`MateriaController: Boletim encontrado para usuário ID: ${userId}, mas não contém matérias.`);
                return res.json([]);
            }

            const gradeFormatada = [];
            // Define os dois horários que cada matéria ocupará
            const horariosParaCadaMateria = ["08:15 - 09:30", "09:45 - 11:00"];

            // Itera sobre cada matéria original do boletim do usuário
            boletimDoUsuario.materias.forEach(materia => {
                // Para CADA matéria, cria duas entradas na grade, uma para cada horário definido acima
                horariosParaCadaMateria.forEach(horario => {
                    gradeFormatada.push({
                        "DIA DA SEMANA": materia.diaDaSemana,
                        "CURSO": boletimDoUsuario.curso, 
                        "MATÉRIA": materia.nomeMateria,
                        "TURMA": materia.turma,
                        "HORÁRIO": horario 
                    });
                });
            });

            res.json(gradeFormatada);

        } catch (err) {
            console.error("Erro no MateriaController (getGradeDoUsuario):", err);
            res.status(500).json({ message: 'Erro interno ao buscar a grade horária.', error: err.message });
        }
    }
   
};

module.exports = MateriaController;