// ================= GET ELEMENTS =================

const totalBooksElement =
    document.getElementById("totalBooks");

const totalMembersElement =
    document.getElementById("totalMembers");

const availableBooksElement =
    document.getElementById("availableBooks");

const issuedBooksElement =
    document.getElementById("issuedBooks");

const summaryTotalBooks =
    document.getElementById("summaryTotalBooks");

const summaryTotalMembers =
    document.getElementById("summaryTotalMembers");

const summaryAvailableBooks =
    document.getElementById("summaryAvailableBooks");

const summaryIssuedBooks =
    document.getElementById("summaryIssuedBooks");

const refreshButton =
    document.getElementById("refreshButton");

const reportMessage =
    document.getElementById("reportMessage");


// ================= GET STORED DATA =================

function getBooks() {

    return JSON.parse(
        sessionStorage.getItem("books")
    ) || [];

}


function getMembers() {

    return JSON.parse(
        localStorage.getItem("members")
    ) || [];

}


function getIssueRecords() {

    return JSON.parse(
        sessionStorage.getItem("issueRecords")
    ) || [];

}


// ================= GENERATE REPORTS =================

function generateReports() {

    // Get latest data from storage.

    const books = getBooks();

    const members = getMembers();

    const issueRecords = getIssueRecords();


    // ================= COUNTERS =================

    let totalBooks = 0;

    let availableBooks = 0;

    let issuedBooks = 0;

    let totalMembers = 0;


    // ================= COUNT TOTAL BOOKS =================

    for (let i = 0; i < books.length; i++) {

        totalBooks += Number(books[i].quantity) || 0;

        availableBooks += Number(books[i].quantity) || 0;

    }


    // ================= COUNT TOTAL MEMBERS =================

    for (let i = 0; i < members.length; i++) {

        totalMembers++;

    }


    // ================= COUNT ISSUED BOOKS =================

    for (let i = 0; i < issueRecords.length; i++) {

        if (issueRecords[i].status !== "Returned") {

            issuedBooks++;

        }

    }


    // ================= DISPLAY REPORT CARDS =================

    totalBooksElement.textContent = totalBooks;

    totalMembersElement.textContent = totalMembers;

    availableBooksElement.textContent = availableBooks;

    issuedBooksElement.textContent = issuedBooks;


    // ================= DISPLAY REPORT SUMMARY =================

    summaryTotalBooks.textContent = totalBooks;

    summaryTotalMembers.textContent = totalMembers;

    summaryAvailableBooks.textContent = availableBooks;

    summaryIssuedBooks.textContent = issuedBooks;

}


// ================= REFRESH REPORTS =================

refreshButton.addEventListener("click", function() {

    generateReports();

    reportMessage.textContent =
        "✅ Reports updated successfully!";

});


// ================= INITIAL LOAD =================

generateReports();