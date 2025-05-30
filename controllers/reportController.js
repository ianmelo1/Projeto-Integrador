exports.generateGraphReport = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Dados mockados - substitua por sua lógica real
    const chartData = {
      type: 'bar',
      data: {
        labels: ['Matemática', 'Português', 'História'],
        datasets: [{
          label: 'Notas',
          data: [7.5, 8.2, 6.9],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
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
      message: 'Erro ao gerar gráfico'
    });
  }
};