// ================= GET ELEMENTS =================

let issueForm =
    document.getElementById("issueForm");

let memberSelect =
    document.getElementById("member");

let bookSelect =
    document.getElementById("book");

let issueDate =
    document.getElementById("issueDate");

let returnDate =
    document.getElementById("returnDate");

let message =
    document.getElementById("message");

let issueTableBody =
    document.getElementById("issueTableBody");

let clearButton =
    document.getElementById("clearButton");


// ================= GET MEMBERS =================

function getMembers() {

    let members =
        localStorage.getItem("members");

    if (members) {

        return JSON.parse(members);

    } else {

        return [];

    }

}


// ================= GET BOOKS =================

function getBooks() {

    let books =
        sessionStorage.getItem("books");

    if (books) {

        return JSON.parse(books);

    } else {

        return [];

    }

}


// ================= SAVE BOOKS =================

function saveBooks(books) {

    sessionStorage.setItem(
        "books",
        JSON.stringify(books)
    );

}


// ================= GET ISSUE RECORDS =================

function getIssueRecords() {

    let records =
        sessionStorage.getItem("issueRecords");

    if (records) {

        return JSON.parse(records);

    } else {

        return [];

    }

}


// ================= SAVE ISSUE RECORDS =================

function saveIssueRecords(records) {

    sessionStorage.setItem(
        "issueRecords",
        JSON.stringify(records)
    );

}


// ================= LOAD MEMBERS =================

function loadMembers() {

    let members = getMembers();

    memberSelect.innerHTML = `
        <option value="">
            Select Member
        </option>
    `;

    members.forEach(function(member) {

        let option =
            document.createElement("option");

        option.value =
            member.memberId;

        option.textContent =
            member.name;

        memberSelect.appendChild(option);

    });

}


// ================= LOAD BOOKS =================

function loadBooks() {

    let books = getBooks();

    bookSelect.innerHTML = `
        <option value="">
            Select Book
        </option>
    `;

    books.forEach(function(book) {

        let option =
            document.createElement("option");

        option.value =
            book.bookId;

        option.textContent =
            book.bookName +
            " (Available: " +
            book.quantity +
            ")";

        bookSelect.appendChild(option);

    });

}


// ================= CLEAR ERRORS =================

function clearErrors() {

    document.getElementById(
        "memberError"
    ).textContent = "";

    document.getElementById(
        "bookError"
    ).textContent = "";

    document.getElementById(
        "issueDateError"
    ).textContent = "";

    document.getElementById(
        "returnDateError"
    ).textContent = "";

}


// ================= SHOW MESSAGE =================

function showMessage(text, type) {

    message.textContent = text;

    if (type === "success") {

        message.style.color = "green";

    } else {

        message.style.color = "red";

    }

}


// ================= DATE HELPERS =================

// Get today's date in YYYY-MM-DD format
function getTodayDate() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// Add days to a date without timezone problems
function addDays(dateString, days) {

    const [year, month, day] =
        dateString.split("-").map(Number);

    const dateValue =
        new Date(year, month - 1, day);

    dateValue.setDate(
        dateValue.getDate() + days
    );

    const newYear =
        dateValue.getFullYear();

    const newMonth =
        String(dateValue.getMonth() + 1).padStart(2, "0");

    const newDay =
        String(dateValue.getDate()).padStart(2, "0");

    return `${newYear}-${newMonth}-${newDay}`;

}


// Display dates in DD-MM-YYYY format
function formatDate(dateString) {

    if (!dateString) {

        return "";

    }

    const [year, month, day] =
        dateString.split("-");

    return `${day}-${month}-${year}`;

}


// ================= CONFIGURE DATE FIELDS =================

function configureDateFields() {

    const today =
        getTodayDate();

    // Issue date cannot be earlier than today
    issueDate.min = today;

    if (
        !issueDate.value ||
        issueDate.value < today
    ) {

        issueDate.value = today;

    }

    updateReturnDateLimits();

}


// ================= UPDATE RETURN DATE LIMITS =================

function updateReturnDateLimits() {

    if (!issueDate.value) {

        return;

    }

    const minimumReturnDate =
        issueDate.value;

    const maximumReturnDate =
        addDays(issueDate.value, 15);

    // Return date must be between issue date and issue date + 15 days
    returnDate.min = minimumReturnDate;

    returnDate.max = maximumReturnDate;

    // Default return date is 15 days after issue date
    if (
        !returnDate.value ||
        returnDate.value < minimumReturnDate ||
        returnDate.value > maximumReturnDate
    ) {

        returnDate.value =
            maximumReturnDate;

    }

}


// ================= ISSUE DATE CHANGE =================

issueDate.addEventListener(
    "change",
    function() {

        const today =
            getTodayDate();

        if (issueDate.value < today) {

            issueDate.value = today;

            document.getElementById(
                "issueDateError"
            ).textContent =
                "❌ Issue date cannot be earlier than today.";

        } else {

            document.getElementById(
                "issueDateError"
            ).textContent = "";

        }

        // Update allowed return dates
        updateReturnDateLimits();

        document.getElementById(
            "returnDateError"
        ).textContent = "";

    }
);


// ================= RETURN DATE CHANGE =================

returnDate.addEventListener(
    "change",
    function() {

        if (!issueDate.value) {

            return;

        }

        const minimumReturnDate =
            issueDate.value;

        const maximumReturnDate =
            addDays(issueDate.value, 15);

        if (
            returnDate.value < minimumReturnDate ||
            returnDate.value > maximumReturnDate
        ) {

            document.getElementById(
                "returnDateError"
            ).textContent =
                "❌ Return date must be within 15 days of the issue date.";

        } else {

            document.getElementById(
                "returnDateError"
            ).textContent = "";

        }

    }
);


// ================= ISSUE BOOK =================

issueForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        clearErrors();

        message.textContent = "";


        // ================= GET VALUES =================

        let selectedMemberId =
            memberSelect.value;

        let selectedBookId =
            bookSelect.value;

        let selectedIssueDate =
            issueDate.value;

        let selectedReturnDate =
            returnDate.value;

        let valid = true;


        // ================= MEMBER VALIDATION =================

        if (selectedMemberId === "") {

            document.getElementById(
                "memberError"
            ).textContent =
                "❌ Please select a member.";

            valid = false;

        }


        // ================= BOOK VALIDATION =================

        if (selectedBookId === "") {

            document.getElementById(
                "bookError"
            ).textContent =
                "❌ Please select a book.";

            valid = false;

        }


        // ================= ISSUE DATE VALIDATION =================

        if (selectedIssueDate === "") {

            document.getElementById(
                "issueDateError"
            ).textContent =
                "❌ Issue date is required.";

            valid = false;

        }


        // ================= RETURN DATE VALIDATION =================

        if (selectedReturnDate === "") {

            document.getElementById(
                "returnDateError"
            ).textContent =
                "❌ Return date is required.";

            valid = false;

        }


        // ================= DATE RANGE VALIDATION =================

        const today =
            getTodayDate();

        // Issue date must not be earlier than today
        if (
            selectedIssueDate !== "" &&
            selectedIssueDate < today
        ) {

            document.getElementById(
                "issueDateError"
            ).textContent =
                "❌ Issue date cannot be earlier than today.";

            valid = false;

        }


        // Return date must be within 15 days of issue date
        if (
            selectedIssueDate !== "" &&
            selectedReturnDate !== ""
        ) {

            const maximumReturnDate =
                addDays(selectedIssueDate, 15);

            if (
                selectedReturnDate < selectedIssueDate ||
                selectedReturnDate > maximumReturnDate
            ) {

                document.getElementById(
                    "returnDateError"
                ).textContent =
                    "❌ Return date must be between the issue date and 15 days after it.";

                valid = false;

            }

        }


        // ================= STOP IF INVALID =================

        if (!valid) {

            return;

        }


        // ================= GET DATA =================

        let members =
            getMembers();

        let books =
            getBooks();


        // ================= FIND MEMBER =================

        let member =
            members.find(function(member) {

                return String(member.memberId) ===
                    String(selectedMemberId);

            });


        if (!member) {

            showMessage(
                "❌ Selected member does not exist.",
                "error"
            );

            return;

        }


        // ================= FIND BOOK =================

        let book =
            books.find(function(book) {

                return String(book.bookId) ===
                    String(selectedBookId);

            });


        if (!book) {

            showMessage(
                "❌ Selected book does not exist.",
                "error"
            );

            return;

        }


        // ================= CHECK AVAILABILITY =================

        let availableQuantity =
            Number(book.quantity);

        if (availableQuantity <= 0) {

            showMessage(
                "❌ This book is currently unavailable.",
                "error"
            );

            return;

        }


        // ================= DECREASE QUANTITY =================

        book.quantity =
            availableQuantity - 1;


        // ================= SAVE UPDATED BOOK =================

        saveBooks(books);


        // ================= CREATE ISSUE RECORD =================

        let newIssue = {

            memberId:
                member.memberId,

            memberName:
                member.name,

            bookId:
                book.bookId,

            bookName:
                book.bookName,

            issueDate:
                selectedIssueDate,

            returnDate:
                selectedReturnDate

        };


        // ================= GET OLD RECORDS =================

        let issueRecords =
            getIssueRecords();


        // ================= ADD NEW RECORD =================

        issueRecords.push(newIssue);


        // ================= SAVE RECORD =================

        saveIssueRecords(issueRecords);


        // ================= SUCCESS =================

        showMessage(
            "✅ Book issued successfully!",
            "success"
        );


        // ================= DISPLAY RECORDS =================

        displayIssueRecords();


        // ================= REFRESH BOOK LIST =================

        loadBooks();


        // ================= RESET FORM =================

        issueForm.reset();

        clearErrors();

        configureDateFields();

    }
);


// ================= DISPLAY ISSUE RECORDS =================

function displayIssueRecords() {

    let records =
        getIssueRecords();

    issueTableBody.innerHTML = "";


    if (records.length === 0) {

        issueTableBody.innerHTML = `

            <tr>

                <td colspan="4">
                    No issue records available.
                </td>

            </tr>

        `;

        return;

    }


    records.forEach(function(record) {

        let row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${record.memberName}
            </td>

            <td>
                ${record.bookName}
            </td>

            <td>
                ${formatDate(record.issueDate)}
            </td>

            <td>
                ${formatDate(record.returnDate)}
            </td>

        `;


        issueTableBody.appendChild(row);

    });

}


// ================= CLEAR BUTTON =================

clearButton.addEventListener(
    "click",
    function() {

        issueForm.reset();

        clearErrors();

        message.textContent = "";

        configureDateFields();

    }
);


// ================= INITIAL LOAD =================

configureDateFields();

loadMembers();

loadBooks();

displayIssueRecords();