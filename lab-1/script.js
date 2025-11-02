const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Робота", "Навчання", "Ігри", "Інше"],
        datasets: [
        {
            label: "Статистика часу за комп’ютером — Салтиков Павло",
            data: [10, 50, 20, 20],
            backgroundColor: [
            "hsla(6, 78%, 57%, 0.70)",
            "rgba(231, 146, 36, 0.81)",
            "rgba(241, 196, 15, 0.7)",
            "hsla(73, 78%, 57%, 0.70)",
            ],
            borderColor: "#fff",
            borderWidth: 3,
        },
        ],
    },
    options: {
        responsive: true,
        plugins: {
        title: {
            display: true,
            text: "Статистика часу за комп’ютером Салтиков Павло",
            color: "#000",
            font: {
            size: 20,
            weight: "bold",
            },
        },
        legend: {
            position: "bottom",
            labels: {
            font: {
                size: 20,
            },
            },
        },
        },
    },
});