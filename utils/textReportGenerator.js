const User = require("../models/User");

module.exports = {
    generate: (materias, student) => {
        let report = "RELATÓRIO DE DESEMPENHO ACADÊMICO\n\n";
        
        // Cabeçalho com informações do aluno
        report += `ALUNO: ${student.nomeAluno}\n`;
        report += `MATRÍCULA: ${student.matricula || 'Não informada'}\n`;
        report += `CURSO: ${student.curso}\n`;
        report += `SEMESTRE: ${student.semestre}\n`;
        report += `EMAIL: ${student.email}\n\n`;
        
        report += "DESEMPENHO POR DISCIPLINA:\n";
        report += "----------------------------------------\n\n";
        
        // Calcula a média geral
        const mediaGeral = materias.reduce((sum, materia) => sum + materia.nota, 0) / materias.length;
        
        // Análise por disciplina
        materias.forEach(materia => {
            report += `DISCIPLINA: ${materia.nomeMateria}\n`;
            report += `- NOTA: ${materia.nota.toFixed(1)}\n`;
            
            // Situação da disciplina
            if (materia.nota >= 7) {
                report += "- SITUAÇÃO: Aprovado\n";
            } else if (materia.nota >= 5) {
                report += "- SITUAÇÃO: Recuperação\n";
            } else {
                report += "- SITUAÇÃO: Reprovado\n";
            }
            
            // Recomendações específicas
            if (materia.nota < 5) {
                report += "- RECOMENDAÇÃO: Necessário reforço na disciplina\n";
            } else if (materia.nota < 7) {
                report += "- RECOMENDAÇÃO: Atenção aos pontos fracos identificados\n";
            }
            
            report += "\n";
        });
        
        // Resumo geral
        report += "----------------------------------------\n";
        report += "RESUMO GERAL:\n";
        report += `- MÉDIA GERAL: ${mediaGeral.toFixed(2)}\n`;
        report += `- TOTAL DE DISCIPLINAS: ${materias.length}\n`;
        
        // Análise geral
        if (mediaGeral >= 7) {
            report += "- DESEMPENHO GERAL: Excelente\n";
        } else if (mediaGeral >= 5) {
            report += "- DESEMPENHO GERAL: Regular\n";
        } else {
            report += "- DESEMPENHO GERAL: Insatisfatório\n";
        }
        
        // Mensagem final personalizada
        report += "\nOBSERVAÇÕES FINAIS:\n";
        if (mediaGeral >= 7) {
            report += "Parabéns pelo excelente desempenho! Continue mantendo esse ritmo.\n";
        } else if (mediaGeral >= 5) {
            report += "Seu desempenho está dentro da média, mas há espaço para melhorias.\n";
        } else {
            report += "Recomendamos atenção especial aos estudos e busca por reforço acadêmico.\n";
        }
        
        return report;
    }
};