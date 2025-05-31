const Boletim = require('../models/Boletim');
const User = require('../models/User');

exports.generateTextReport = async (req, res) => {
  try {
    const { email } = req.params;
    
    // 1. Buscar o usuário pelo email
    const usuario = await User.findOne({ email: email });
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado com este email'
      });
    }

    // 2. Buscar o boletim do usuário
    const boletim = await Boletim.findOne({
      aluno: usuario._id,
      curso: usuario.curso,
      semestre: usuario.semestre
    });

    if (!boletim) {
      return res.status(404).json({ 
        success: false,
        message: `Nenhum boletim encontrado para o ${usuario.semestre}º semestre do curso de ${usuario.curso}`
      });
    }

    // 3. Gerar o relatório textual baseado nos dados reais
    let report = `Relatório de Desempenho para ${usuario.nome} (${email}):\n\n`;
    report += `Curso: ${boletim.curso}\n`;
    report += `Semestre: ${boletim.semestre}º\n`;
    report += `Matrícula: ${usuario.matricula}\n\n`;
    
    let totalNotas = 0;
    let countNotas = 0;
    let materiasComProblema = [];
    let materiasExcelentes = [];

    // Analisar cada matéria
    boletim.materias.forEach(materia => {
      if (materia.nota !== null && materia.nota !== undefined) {
        const nota = parseFloat(materia.nota);
        totalNotas += nota;
        countNotas++;
        
        let status = '';
        if (nota >= 9) {
          status = 'Excelente';
          materiasExcelentes.push(materia.nomeMateria);
        } else if (nota >= 7) {
          status = 'Bom desempenho';
        } else if (nota >= 6) {
          status = 'Satisfatório';
        } else {
          status = 'Precisa melhorar';
          materiasComProblema.push(materia.nomeMateria);
        }
        
        report += `- ${materia.nomeMateria}: ${nota}/10 - ${status}\n`;
      } else {
        report += `- ${materia.nomeMateria}: Nota não lançada\n`;
        materiasComProblema.push(materia.nomeMateria);
      }
    });

    // Calcular média geral
    const mediaGeral = countNotas > 0 ? (totalNotas / countNotas).toFixed(1) : 0;
    report += `\nMédia Geral: ${mediaGeral}/10\n\n`;

    // Gerar recomendações personalizadas
    report += `Recomendações:\n`;
    if (materiasExcelentes.length > 0) {
      report += `✅ Parabéns pelo excelente desempenho em: ${materiasExcelentes.join(', ')}\n`;
    }
    
    if (materiasComProblema.length > 0) {
      report += `⚠️ Foque em melhorar nas seguintes matérias: ${materiasComProblema.join(', ')}\n`;
    }
    
    if (parseFloat(mediaGeral) >= 8) {
      report += `🎉 Excelente média geral! Continue assim!\n`;
    } else if (parseFloat(mediaGeral) >= 7) {
      report += `👍 Boa média geral, mas há espaço para melhorias.\n`;
    } else if (parseFloat(mediaGeral) >= 6) {
      report += `📚 Média satisfatória, mas recomenda-se mais dedicação aos estudos.\n`;
    } else {
      report += `🚨 Atenção: média abaixo do esperado. Procure ajuda acadêmica.\n`;
    }

    res.json({ 
      success: true, 
      report: report 
    });
    
  } catch (error) {
    console.error('Erro no relatório textual:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao gerar relatório textual: ' + error.message
    });
  }
};

exports.generateGraphReport = async (req, res) => {
  try {
    const { email } = req.params;
    
    // 1. Buscar o usuário pelo email
    const usuario = await User.findOne({ email: email });
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado com este email'
      });
    }

    // 2. Buscar o boletim do usuário
    const boletim = await Boletim.findOne({
      aluno: usuario._id,
      curso: usuario.curso,
      semestre: usuario.semestre
    });

    if (!boletim) {
      return res.status(404).json({ 
        success: false,
        message: `Nenhum boletim encontrado para o ${usuario.semestre}º semestre do curso de ${usuario.curso}`
      });
    }

    // 3. Preparar dados para o gráfico
    const labels = [];
    const notas = [];
    const backgroundColors = [];
    const borderColors = [];

    boletim.materias.forEach(materia => {
      labels.push(materia.nomeMateria);
      
      if (materia.nota !== null && materia.nota !== undefined) {
        const nota = parseFloat(materia.nota);
        notas.push(nota);
        
        // Cores baseadas na nota
        if (nota >= 9) {
          backgroundColors.push('rgba(34, 197, 94, 0.8)'); // Verde para excelente
          borderColors.push('rgba(34, 197, 94, 1)');
        } else if (nota >= 7) {
          backgroundColors.push('rgba(30, 64, 175, 0.8)'); // Azul escuro para bom
          borderColors.push('rgba(30, 64, 175, 1)');
        } else if (nota >= 6) {
          backgroundColors.push('rgba(245, 158, 11, 0.8)'); // Amarelo para satisfatório
          borderColors.push('rgba(245, 158, 11, 1)');
        } else {
          backgroundColors.push('rgba(239, 68, 68, 0.8)'); // Vermelho para precisa melhorar
          borderColors.push('rgba(239, 68, 68, 1)');
        }
      } else {
        notas.push(0); // Nota não lançada = 0 no gráfico
        backgroundColors.push('rgba(156, 163, 175, 0.8)'); // Cinza para não lançada
        borderColors.push('rgba(156, 163, 175, 1)');
      }
    });

    const chartData = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `Notas - ${boletim.curso} (${boletim.semestre}º sem.)`,
          data: notas,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      }
    };

    // Garante que o cabeçalho é application/json
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, chartData });
    
  } catch (error) {
    console.error('Erro no gráfico:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao gerar gráfico: ' + error.message
    });
  }
};

// Função adicional para buscar todos os boletins de um aluno (opcional)
exports.getAllReportsForStudent = async (req, res) => {
  try {
    const { email } = req.params;
    
    const usuario = await User.findOne({ email: email });
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado com este email'
      });
    }

    const todosBoletins = await Boletim.find({
      aluno: usuario._id
    }).sort({ semestre: 1 }); // Ordenar por semestre

    res.json({ 
      success: true, 
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
        matricula: usuario.matricula,
        curso: usuario.curso
      },
      boletins: todosBoletins
    });
    
  } catch (error) {
    console.error('Erro ao buscar todos os relatórios:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar relatórios: ' + error.message
    });
  }
};

