// ---------------------- Format Date Function ---------------------------//
    function formatDate(inputDate) {
      if (!inputDate) return "";
      const parts = inputDate.split("-");
      return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : inputDate;
    }

    // --------------------------- Student Data ----------------------------------//
    const studentData = [
      {roll: 1, name: "Krish Kumar", branch: "CSE"},
      {roll: 2, name: "Nitin Patel", branch: "CSE"},
      {roll: 3, name: "Sagar kumar", branch: "CSE"},
      {roll: 4, name: "Vivek kumar", branch: "CSE"},
      {roll: 5, name: "Raju Kumar", branch: "CSE"},
      {roll: 6, name: "Priyanshu Raj Chauhan", branch: "CSE"},
      {roll: 7, name: "Golu Kumar", branch: "CSE"},
      {roll: 8, name: "Shri Ram Kumar", branch: "CSE"},
      {roll: 9, name: "Shivsankar Kumar", branch: "CSE"},
      {roll: 10, name: "Abhiram kumar", branch: "CSE"},
      {roll: 11, name: "Nitesh kumar", branch: "CSE"},
      {roll: 12, name: "Ganesh Kumar", branch: "CSE"},
      {roll: 13, name: "Pratham Prasoon", branch: "CSE"},
      {roll: 14, name: "Md Azhar Alam", branch: "CSE"},
      {roll: 15, name: "Kundan Kumar", branch: "CSE"},
      {roll: 16, name: "Niraj Kumar", branch: "CSE"},
      {roll: 17, name: "Aditya Aryan", branch: "ME"},
      {roll: 18, name: "Yash Raj", branch: "CSE"},
      {roll: 19, name: "Deepak Kumar", branch: "CSE"},
      {roll: 20, name: "Shivam Kumar", branch: "CSE"},
      {roll: 21, name: "Shivam Kumar", branch: "CE"},
      {roll: 22, name: "Rustum Kumar", branch: "CSE"},
      {roll: 23, name: "Masum Ali", branch: "ME"},
      {roll: 24, name: "Aadarshini Shrivastava", branch: "CSE"},
      {roll: 27, name: "Tajir Mansuri", branch: "ME"},
      {roll: 29, name: "Shubham Kumar Rai", branch: "CSE"},
      {roll: 30, name: "Durgesh Kumar", branch: "CSE"},
      {roll: 31, name: "Shashi Ranjan Kumar", branch: "ME"},
      {roll: 32, name: "Deepak kumar", branch: "CSE"},
      {roll: 33, name: "Shubham kumar rajak", branch: "CSE"},
      {roll: 34, name: "Md Arbaz", branch: "CSE"},
      {roll: 54, name: "Aditya kumar", branch: "ME"},
    ];

    const totalStudents = 65;
    const attendance = [];
    const grid = document.getElementById("rollGrid");

    // ------------------ Create Roll Number Buttons ------------------------- //
    for (let i = 1; i <= totalStudents; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.className = "roll-btn";
      btn.onclick = () => {
        btn.classList.toggle("present");
        if (attendance.includes(i)) {
          attendance.splice(attendance.indexOf(i), 1);
        } else {
          attendance.push(i);
        }
        updateCount();
      };
      grid.appendChild(btn);
    }

    // ------------------ Export CSV ------------------------- //
    function exportCSV() {
      const rawDate = document.getElementById("attDate").value;
      const date = formatDate(rawDate);
      const subject = document.getElementById("attSubject").value;
      const time = document.getElementById("attTime").value;

      let csv = `Date: ${date}\nSubject: ${subject}\nTime: ${time}\n\n`;
      csv += "Roll Number,Name,Branch\n";

      attendance.sort((a, b) => a - b).forEach(num => {
        const student = studentData.find(s => s.roll === num);
        if (student) {
          csv += `${student.roll},${student.name},${student.branch}\n`;
        } else {
          csv += `${num},Student ${num},Unknown\n`;
        }
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `attendance_${rawDate}.csv`;
      link.click();
      showToast("✅ CSV exported successfully");
    }

    // ------------------------- Export PDF ----------------------------- //
    async function exportPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const rawDate = document.getElementById("attDate").value;
      const date = formatDate(rawDate);
      const subject = document.getElementById("attSubject").value || "N/A";
      const time = document.getElementById("attTime").value || "N/A";;
      showToast("✅ PDF exported successfully");


      // ----------------------- Title ------------------------------ //
      doc.setFontSize(14);
      doc.text("ATTENDANCE REPORT", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

      // --------------------- Info Block ---------------------- //
      doc.setFontSize(10);
      doc.text(`Date     : ${date}`, 20, 30);
      doc.text(`Subject  : ${subject}`, 20, 36);
      doc.text(`Time     : ${time}`, 20, 42);
      doc.text(`Present  : ${attendance.length} out of ${totalStudents}`, 20, 48);
 
      // ------------------------ Table Rows --------------------------- //
      const rows = attendance.sort((a, b) => a - b).map(num => {
        const student = studentData.find(s => s.roll === num);
        return [
          num,
          student?.name || `Student ${num}`,
          student?.branch || "Unknown"
        ];
      });

      // -------------------------- Table -------------------------- //
      doc.autoTable({
        head: [["Roll No.", "Name", "Branch"]],
        body: rows,
        startY: 55,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 1 },
        headStyles: { fillColor: [220, 220, 220], textColor: 0 }
      });

      // -------------------------- Signature Line ---------------------- //
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.text("Signature: ____________________", 20, finalY);

      // Save PDF
      doc.save(`attendance_${rawDate}.pdf`);
    }
// ------------------------------- update total no. of present student --------------------------//
    function updateCount() {
  document.getElementById("countDisplay").innerText = `Present: ${attendance.length}`;
  window.addEventListener("load", updateCount);
}
// ------------------ script for conformantion pop up ---------------------- //
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.visibility = "visible";
  setTimeout(() => {
    toast.style.visibility = "hidden";
  }, 3000);
}