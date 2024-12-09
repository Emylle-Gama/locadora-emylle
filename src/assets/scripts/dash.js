const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['alugados', 'aluguel atrasado', 'devolvido no prazo', 'devolvido depois do prazo'],
        datasets: [{
            label: '# de Livros',
            data: [10, 10, 70, 10],
            backgroundColor: [
                '#00926F',
                '#009037',
                '#2C5CD0',
                '#18F514'
            ]
        }]
    }
})
