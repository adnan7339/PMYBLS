let applicants = [];

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    applicants = data;
    renderTable(applicants);
  });

function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = `
      <tr>
        <td>${item["Applicant CNIC"]}</td>
        <td>${item["Applicant Name"]}</td>
        <td>${item["Industory Category"]}</td>
        <td>${item["Business Sector"]}</td>
        <td>${item["Business Sub Sector"]}</td>
        <td>${item["MFIBankName"]}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  document.getElementById("count").innerText = data.length;
}

document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = applicants.filter(item =>
    Object.values(item).join(" ").toLowerCase().includes(value)
  );

  renderTable(filtered);
});
