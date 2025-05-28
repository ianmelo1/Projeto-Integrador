
const express = require('express');
const router = express.Router();
const Nota = require('../models/notaModel'); // Ajuste o caminho conforme sua estrutura
const geminiService = require('../services/geminiService'); // Ajuste o caminho

// Rota para buscar os relatórios de um aluno
// IMPORTANTE: Em um ambiente de produção, você PRECISA implementar autenticação e autorização aqui.
// Garanta que o usuário logado tem permissão para ver as notas deste alunoId.
router.get('/aluno/:alunoId', async (req, res) => { // Mudança para '/aluno/:alunoId' para clareza
    const alunoId = req.params.alunoId;

    try {
        // 1. Buscar as notas do aluno no banco de dados
        const notas = await Nota.getNotasByAlunoId(alunoId);

        // TODO: Buscar o nome real do aluno do banco de dados
        // Exemplo: const alunoInfo = await AlunoModel.getAlunoById(alunoId);
        const alunoNome = `Aluno ${alunoId}`; // Substitua pela busca real do nome do aluno

        // 2. Gerar o relatório de texto com Gemini
        const relatorioTexto = await geminiService.gerarRelatorioTextoGemini(alunoNome, notas);

        // 3. Preparar dados para o gráfico (enviar para o frontend)
        const dadosGrafico = {
            labels: notas.map(n => n.disciplina),
            data: notas.map(n => parseFloat(n.nota)) // Garanta que a nota seja um número
        };

        res.json({
            success: true,
            relatorioTexto: relatorioTexto,
            dadosGrafico: dadosGrafico
        });

    } catch (error) {
        console.error('Erro na rota de relatórios:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao gerar relatórios.',
            error: error.message
        });
    }
});

module.exports = router;