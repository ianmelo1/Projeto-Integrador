module.exports = {
    generate: (grades) => {
        // Agrupar por disciplina
        const disciplines = {};
        grades.forEach(grade => {
            if (!disciplines[grade.discipline]) {
                disciplines[grade.discipline] = [];
            }
            disciplines[grade.discipline].push(grade);
        });
        
        // Preparar dados para o gráfico
        const labels = [];
        const datasets = [];
        
        for (const [discipline, grades] of Object.entries(disciplines)) {
            labels.push(discipline);
            
            const avg = grades.reduce((sum, g) => sum + parseFloat(g.grade), 0) / grades.length;
            datasets.push(avg);
        }
        
        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Média de Notas por Disciplina',
                    data: datasets,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        };
    }
};