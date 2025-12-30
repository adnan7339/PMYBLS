let applicants = [];

// 🔹 Load default data.json
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    applicants = data;
    renderTable(applicants);
  });

// 🔹 Render table
function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = `
      <tr>
        <td>${item["Applicant CNIC"] || ""}</td>
        <td>${item["Applicant Name"] || ""}</td>
        <td>${item["Industory Category"] || ""}</td>
        <td>${item["Business Sector"] || ""}</td>
        <td>${item["Business Sub Sector"] || ""}</td>
        <td>${item["MFIBankName"] || ""}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  document.getElementById("count").innerText = data.length;
}

// 🔹 Search
document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const filtered = applicants.filter(item =>
    Object.values(item).join(" ").toLowerCase().includes(value)
  );
  renderTable(filtered);
});

// 🔹 Upload JSON file
document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    try {
      applicants = JSON.parse(reader.result);
      renderTable(applicants);
      alert("✅ Data loaded successfully (session only)");
    } catch {
      alert("❌ Invalid JSON file");
    }
  };
  reader.readAsText(file);
});
