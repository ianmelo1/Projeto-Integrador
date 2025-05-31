// controllers/FrequenciaController.js
const Boletim = require('../models/Boletim'); // Ajuste o caminho se necessário

const FrequenciaController = {
    getMinhaFrequencia: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                console.warn("FrequenciaController: Tentativa de acesso sem ID de usuário no token.");
                return res.status(401).json({ message: "Usuário não autenticado ou token inválido." });
            }
            const userId = req.user.id;

            const boletimDoUsuario = await Boletim.findOne({ aluno: userId })
                .populate('aluno', 'semestre')
                .lean();

            if (!boletimDoUsuario || !boletimDoUsuario.materias || boletimDoUsuario.materias.length === 0) {
                return res.json([]);
            }

            const dadosDeFrequencia = boletimDoUsuario.materias.map(materia => {
                let semestreInfo = boletimDoUsuario.semestre;
                if (semestreInfo === undefined && boletimDoUsuario.aluno && boletimDoUsuario.aluno.semestre !== undefined) {
                    semestreInfo = boletimDoUsuario.aluno.semestre;
                }

                const percentual = materia.frequenciaPercentual;
                let statusFrequencia = "N/D"; // Status padrão se a frequência não estiver definida

                if (percentual !== undefined) {
                    statusFrequencia = percentual >= 70 ? "Aprovado" : "Reprovado"; // <<< LÓGICA DE APROVAÇÃO/REPROVAÇÃO
                }
                
                return {
                    nomeMateria: materia.nomeMateria,
                    semestre: semestreInfo !== undefined ? `${semestreInfo}º Semestre` : "Semestre não informado",
                    frequencia: percentual !== undefined ? `${percentual}%` : "N/D",
                    statusPorFrequencia: statusFrequencia // <<< NOVO CAMPO COM O STATUS
                };
            });

            res.json(dadosDeFrequencia);

        } catch (err) {
            console.error("Erro no FrequenciaController (getMinhaFrequencia):", err);
            res.status(500).json({ message: 'Erro interno ao buscar os dados de frequência.', error: err.message });
        }
    }
};

module.exports = FrequenciaController;