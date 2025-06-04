const Boletim = require('../models/Boletim');

async function getAnalisesTurmas(req, res) {
  try {
    // Buscar todos os boletins
    const boletins = await Boletim.find({});
    
    // Estrutura para armazenar análises por turma
    const analisePorTurma = {};
    
    // Processar cada boletim
    boletins.forEach(boletim => {
      boletim.materias.forEach(materia => {
        const chaveTurma = `${materia.turma} - ${materia.nomeMateria}`;
        
        if (!analisePorTurma[chaveTurma]) {
          analisePorTurma[chaveTurma] = {
            turma: materia.turma,
            materia: materia.nomeMateria,
            curso: boletim.curso,
            diaDaSemana: materia.diaDaSemana,
            totalAlunos: 0,
            notasValidas: [],
            frequencias: [],
            alunosComProblemas: []
          };
        }
        
        analisePorTurma[chaveTurma].totalAlunos++;
        
        if (materia.nota !== null) {
          analisePorTurma[chaveTurma].notasValidas.push(materia.nota);
        }
        
        if (materia.frequenciaPercentual !== null) {
          analisePorTurma[chaveTurma].frequencias.push(materia.frequenciaPercentual);
        }
        
        // Identificar alunos com problemas (nota baixa ou frequência baixa)
        if ((materia.nota !== null && materia.nota < 7) || 
            (materia.frequenciaPercentual !== null && materia.frequenciaPercentual < 75)) {
          analisePorTurma[chaveTurma].alunosComProblemas.push({
            nome: boletim.nomeAluno,
            nota: materia.nota,
            frequencia: materia.frequenciaPercentual
          });
        }
      });
    });
    
    // Calcular estatísticas para cada turma
    const analisesFinal = Object.values(analisePorTurma).map(turma => {
      const mediaNotas = turma.notasValidas.length > 0 
        ? (turma.notasValidas.reduce((sum, nota) => sum + nota, 0) / turma.notasValidas.length).toFixed(2)
        : 'N/A';
      
      const mediaFrequencia = turma.frequencias.length > 0
        ? (turma.frequencias.reduce((sum, freq) => sum + freq, 0) / turma.frequencias.length).toFixed(2)
        : 'N/A';
      
      const alunosReprovadosNota = turma.notasValidas.filter(nota => nota < 7).length;
      const alunosFrequenciaBaixa = turma.frequencias.filter(freq => freq < 75).length;
      
      // Calcular prioridade para monitoria
      let prioridadeMonitoria = 'Baixa';
      const percentualProblemas = (turma.alunosComProblemas.length / turma.totalAlunos) * 100;
      
      if (percentualProblemas > 50) {
        prioridadeMonitoria = 'Alta';
      } else if (percentualProblemas > 25) {
        prioridadeMonitoria = 'Média';
      }
      
      return {
        turma: turma.turma,
        materia: turma.materia,
        curso: turma.curso,
        diaDaSemana: turma.diaDaSemana,
        totalAlunos: turma.totalAlunos,
        mediaNotas: parseFloat(mediaNotas) || 0,
        mediaFrequencia: parseFloat(mediaFrequencia) || 0,
        alunosReprovadosNota,
        alunosFrequenciaBaixa,
        alunosComProblemas: turma.alunosComProblemas.length,
        percentualProblemas: percentualProblemas.toFixed(1),
        prioridadeMonitoria,
        detalhesAlunosProblemas: turma.alunosComProblemas
      };
    });
    
    // Ordenar por prioridade (Alta > Média > Baixa) e depois por percentual de problemas
    const prioridadeOrdem = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
    analisesFinal.sort((a, b) => {
      if (prioridadeOrdem[a.prioridadeMonitoria] !== prioridadeOrdem[b.prioridadeMonitoria]) {
        return prioridadeOrdem[b.prioridadeMonitoria] - prioridadeOrdem[a.prioridadeMonitoria];
      }
      return parseFloat(b.percentualProblemas) - parseFloat(a.percentualProblemas);
    });
    
    res.json(analisesFinal);
    
  } catch (error) {
    console.error('Erro ao obter análises das turmas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = {
  getAnalisesTurmas
};
