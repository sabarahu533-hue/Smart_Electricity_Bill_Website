
let predictions = [];

try {
    predictions = JSON.parse(localStorage.getItem("billHistory")) || [];
} catch (error) {
    predictions = [];
}

function predictBill() {
    const units = Number(document.getElementById("units").value);
    const result = document.getElementById("result");

    if (!Number.isFinite(units) || units <= 0) {
        result.innerHTML = "Please enter valid electricity units.";
        return;
    }

    const bill = units * 15;

    predictions.unshift({
        date: new Date().toLocaleDateString(),
        units: units,
        bill: bill
    });

    localStorage.setItem("billHistory", JSON.stringify(predictions));

    result.innerHTML =
        "Estimated Electricity Bill: Rs. " + bill.toLocaleString("en-PK");

    updateDashboard();
    updateHistory();
}

function updateDashboard() {
    const unitsElement = document.getElementById("totalUnits");
    const billElement = document.getElementById("totalBill");
    const countElement = document.getElementById("totalPredictions");

    const totalUnits = predictions.reduce((sum, item) => sum + item.units, 0);
    const totalBill = predictions.reduce((sum, item) => sum + item.bill, 0);

    if (unitsElement) {
        unitsElement.innerText = totalUnits.toLocaleString("en-PK");
    }

    if (billElement) {
        billElement.innerText = "Rs. " + totalBill.toLocaleString("en-PK");
    }

    if (countElement) {
        countElement.innerText = predictions.length;
    }
}

function updateHistory() {
    const table = document.getElementById("historyTable");

    if (!table) return;

    if (predictions.length === 0) {
        table.innerHTML =
            '<tr><td colspan="3">No predictions yet.</td></tr>';
        return;
    }

    table.innerHTML = predictions.map(item => `
        <tr>
            <td>${item.date}</td>
            <td>${item.units}</td>
            <td>Rs. ${Number(item.bill).toLocaleString("en-PK")}</td>
        </tr>
    `).join("");
}

updateDashboard();
updateHistory();

// Show chart only on pages that contain its canvas
const chartCanvas = document.getElementById("usageChart");

if (chartCanvas && typeof Chart !== "undefined") {
    new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
                label: "Electricity Units",
                data: [120, 180, 150, 220, 190, 250],
                backgroundColor: "#2685e5",
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
