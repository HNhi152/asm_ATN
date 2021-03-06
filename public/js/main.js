$("#datePicker").datepicker('update', new Date());

let statsChart = document.getElementById("statsChart").getContext('2d');

Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

let lineChart = new Chart(statsChart, {
    type: "line",
    data: {
        labels: ["Jan", "Feb", "Mar","Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "Total sales($)",
            data: []
        }]
    },
    options: {
        title: {
            display: true,
            text: "Total sales for each category by month",
            fontSize: 25
        },
        legend: {
            position: "right"
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
        }
    }
});

let category = document.getElementById("category");
let year = document.getElementById("year");

category.addEventListener('change', changeCategory);
year.addEventListener('change', changeCategory);

function changeCategory(e) {
    if (category.value !== "None") {
        let payload = {
            category: category.value,
            year: year.value
        }
        
        fetch('/stats/api', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                updateChartData(data.data);
            })
            .catch(err => console.log(err));
    }
}

function updateChartData(data) {
    lineChart.data.datasets[0].data = data;
    lineChart.options.scales.yAxes[0].ticks.suggestedMax = Math.max(...data);
    lineChart.update();
}