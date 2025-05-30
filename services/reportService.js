exports.generateTextReport = async (email) => {
  try {
    console.log('Gerando relatório para:', email);
    
    // 1. Simulação de dados - substitua por sua lógica real
    const mockData = {
      nome: "Carol Lopes",
      email: email,
      materias: [
        { nome: "IA", nota: 9.2 },
        { nome: "Web", nota: 8.5 }
      ]
    };

    // 2. Gere o relatório textual
    let report = `RELATÓRIO PARA ${mockData.nome}\n\n`;
    mockData.materias.forEach(materia => {
      report += `${materia.nome}: ${materia.nota}\n`;
    });
    
    console.log('Relatório gerado:', report);
    return report;
    
  } catch (error) {
    console.error('Erro no service:', error);
    throw error; // Propaga para o controller
  }
};