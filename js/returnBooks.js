// ================= GET ELEMENTS =================

const issueSelect = document.getElementById("issueSelect");
const returnButton = document.getElementById("returnButton");

const issueError = document.getElementById("issueError");
const successMessage = document.getElementById("successMessage");
const bookDetails = document.getElementById("bookDetails");

const memberName = document.getElementById("memberName");
const bookName = document.getElementById("bookName");
const issueDate = document.getElementById("issueDate");
const expectedReturnDate = document.getElementById("expectedReturnDate");

const actualReturnDateInput =
    document.getElementById("actualReturnDateInput");

const actualReturnError =
    document.getElementById("actualReturnError");

const fineDetails = document.getElementById("fineDetails");
const lateDaysElement = document.getElementById("lateDays");
const fineAmountElement = document.getElementById("fineAmount");


// ================= CONSTANTS =================

const FINE_PER_DAY = 5;


// ================= LOAD ISSUE RECORDS =================

function getIssueRecords() {

    return JSON.parse(
        sessionStorage.getItem("issueRecords")
    ) || [];

}


// ================= LOAD BOOKS =================

function getBooks() {

    return JSON.parse(
        sessionStorage.getItem("books")
    ) || [];

}


// ================= SAVE BOOKS =================

function saveBooks(books) {

    sessionStorage.setItem(
        "books",
        JSON.stringify(books)
    );

}


// ================= SAVE ISSUE RECORDS =================

function saveIssueRecords(records) {

    sessionStorage.setItem(
        "issueRecords",
        JSON.stringify(records)
    );

}


// ================= GET TODAY'S DATE =================

function getTodayString() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// ================= PARSE DATE =================

function parseDate(dateString) {

    if (!dateString) {
        return null;
    }

    const parts = dateString.split("-");

    if (parts.length !== 3) {
        return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const date = new Date(
        Date.UTC(year, month - 1, day)
    );

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;

}


// ================= FORMAT DATE =================

function formatDate(dateString) {

    const date = parseDate(dateString);

    if (!date) {
        return dateString || "Not available";
    }

    const day = String(
        date.getUTCDate()
    ).padStart(2, "0");

    const month = String(
        date.getUTCMonth() + 1
    ).padStart(2, "0");

    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;

}


// ================= CALCULATE LATE DAYS =================

function calculateLateDays(dueDateString, actualDateString) {

    const dueDate = parseDate(dueDateString);

    const actualDate = parseDate(actualDateString);

    if (!dueDate || !actualDate) {
        return 0;
    }

    const difference =
        actualDate.getTime() - dueDate.getTime();

    const millisecondsPerDay =
        24 * 60 * 60 * 1000;

    const days = Math.floor(
        difference / millisecondsPerDay
    );

    return Math.max(0, days);

}


// ================= DISPLAY FINE DETAILS =================

function updateFineDetails() {

    const selectedIndex = issueSelect.value;

    if (selectedIndex === "") {

        fineDetails.style.display = "none";

        return;

    }

    const activeRecords = getIssueRecords().filter(
        function(record) {
            return record.status !== "Returned";
        }
    );

    const record = activeRecords[Number(selectedIndex)];

    if (!record) {

        fineDetails.style.display = "none";

        return;

    }

    const actualDate = actualReturnDateInput.value;

    if (!actualDate) {

        fineDetails.style.display = "none";

        actualReturnError.textContent = "";

        return;

    }

    const selectedDate = parseDate(actualDate);

    const issueDateValue = parseDate(record.issueDate);

    const dueDateValue = parseDate(record.returnDate);

    // Validate the selected date.

    if (
        !selectedDate ||
        !issueDateValue ||
        !dueDateValue
    ) {

        fineDetails.style.display = "none";

        actualReturnError.textContent =
            "Please select a valid date.";

        return;

    }

    // Actual return date cannot be before issue date.

    if (selectedDate < issueDateValue) {

        fineDetails.style.display = "none";

        actualReturnError.textContent =
            "Actual return date cannot be before the issue date.";

        return;

    }

    // No error for a date after the expected return date.

    actualReturnError.textContent = "";

    // Calculate late days and fine.

    const lateDays = calculateLateDays(
        record.returnDate,
        actualDate
    );

    const fineAmount = lateDays * FINE_PER_DAY;

    if (lateDays > 0) {

        fineDetails.style.display = "block";

        lateDaysElement.textContent =
            `${lateDays} ${lateDays === 1 ? "day" : "days"}`;

        fineAmountElement.textContent =
            `₹${fineAmount}`;

    } else {

        fineDetails.style.display = "none";

        lateDaysElement.textContent = "0";

        fineAmountElement.textContent = "₹0";

    }

}


// ================= DISPLAY ISSUED BOOKS =================

function displayIssuedBooks() {

    const records = getIssueRecords();

    issueSelect.innerHTML = `
        <option value="">
            -- Select Issued Book --
        </option>
    `;

    const activeRecords = records.filter(
        function(record) {
            return record.status !== "Returned";
        }
    );

    if (activeRecords.length === 0) {

        issueSelect.innerHTML += `
            <option value="">
                No issued books available
            </option>
        `;

        bookDetails.style.display = "none";

        return;

    }

    activeRecords.forEach(function(record, index) {

        const option = document.createElement("option");

        option.value = index;

        option.textContent =
            `${record.bookName} - ${record.memberName}`;

        issueSelect.appendChild(option);

    });

}


// ================= SELECT ISSUED BOOK =================

issueSelect.addEventListener("change", function() {

    issueError.textContent = "";

    successMessage.textContent = "";

    actualReturnError.textContent = "";

    fineDetails.style.display = "none";

    const activeRecords = getIssueRecords().filter(
        function(record) {
            return record.status !== "Returned";
        }
    );

    if (this.value === "") {

        bookDetails.style.display = "none";

        actualReturnDateInput.value = "";

        return;

    }

    const record = activeRecords[Number(this.value)];

    if (!record) {

        bookDetails.style.display = "none";

        return;

    }

    // Display book details.

    memberName.textContent =
        record.memberName || "Not available";

    bookName.textContent =
        record.bookName || "Not available";

    issueDate.textContent =
        formatDate(record.issueDate);

    expectedReturnDate.textContent =
        formatDate(record.returnDate);

    // Set minimum date to the issue date.
    // Do not restrict the maximum date to today,
    // so future dates can be used for project testing.

    actualReturnDateInput.min = record.issueDate;

    actualReturnDateInput.removeAttribute("max");

    // Default to today's date.

    actualReturnDateInput.value = getTodayString();

    bookDetails.style.display = "block";

    // Calculate fine immediately.

    updateFineDetails();

});


// ================= ACTUAL RETURN DATE CHANGE =================

actualReturnDateInput.addEventListener("change", function() {

    issueError.textContent = "";

    updateFineDetails();

});


// ================= CONFIRM RETURN =================

returnButton.addEventListener("click", function() {

    issueError.textContent = "";

    successMessage.textContent = "";

    actualReturnError.textContent = "";

    // Validate book selection.

    if (issueSelect.value === "") {

        issueError.textContent =
            "❌ Please select an issued book.";

        return;

    }

    const records = getIssueRecords();

    const activeRecords = records.filter(
        function(record) {
            return record.status !== "Returned";
        }
    );

    const selectedRecord =
        activeRecords[Number(issueSelect.value)];

    if (!selectedRecord) {

        issueError.textContent =
            "❌ Invalid issued book.";

        return;

    }

    const originalIndex =
        records.indexOf(selectedRecord);

    // Validate actual return date.

    const actualDate = actualReturnDateInput.value;

    const actualDateValue = parseDate(actualDate);

    const issueDateValue = parseDate(selectedRecord.issueDate);

    const dueDateValue = parseDate(selectedRecord.returnDate);

    if (
        !actualDate ||
        !actualDateValue ||
        !issueDateValue ||
        !dueDateValue
    ) {

        actualReturnError.textContent =
            "❌ Please select a valid return date.";

        return;

    }

    if (actualDateValue < issueDateValue) {

        actualReturnError.textContent =
            "Actual return date cannot be before the issue date.";

        return;

    }

    // Calculate fine from the selected actual return date.

    const lateDays = calculateLateDays(
        selectedRecord.returnDate,
        actualDate
    );

    const fineAmount = lateDays * FINE_PER_DAY;

    // Find the corresponding book.

    const books = getBooks();

    const bookIndex = books.findIndex(
        function(book) {
            return String(book.bookId) ===
                   String(selectedRecord.bookId);
        }
    );

    if (bookIndex === -1) {

        issueError.textContent =
            "❌ Book not found.";

        return;

    }

    // Increase available book quantity.

    books[bookIndex].quantity =
        Number(books[bookIndex].quantity) + 1;

    saveBooks(books);

    // Save return information.

    records[originalIndex].status = "Returned";

    records[originalIndex].returnedDate = actualDate;

    records[originalIndex].lateDays = lateDays;

    records[originalIndex].fineAmount = fineAmount;

    saveIssueRecords(records);

    // Display success message.

    if (fineAmount > 0) {

        successMessage.textContent =
            `✅ Book returned successfully! Late by ${lateDays} day(s). Fine: ₹${fineAmount}.`;

    } else {

        successMessage.textContent =
            "✅ Book returned successfully! No fine.";

    }

    // Reset the form.

    bookDetails.style.display = "none";

    actualReturnDateInput.value = "";

    fineDetails.style.display = "none";

    displayIssuedBooks();

    issueSelect.value = "";

});


// ================= INITIAL LOAD =================

displayIssuedBooks();