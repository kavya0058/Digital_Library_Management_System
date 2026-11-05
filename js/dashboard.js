document.addEventListener("DOMContentLoaded", function () {

    // ================= CURRENT USER =================

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }


    // ================= WELCOME DETAILS =================

    document.getElementById("memberName").textContent =
        currentUser.username;

    document.getElementById("profileName").textContent =
        currentUser.username;

    document.getElementById("profileEmail").textContent =
        currentUser.email;


    // ================= GET BOOKS =================

    function getBooks() {

        return JSON.parse(
            sessionStorage.getItem("books")
        ) || [];

    }


    // ================= GET MEMBERS =================

    function getMembers() {

        return JSON.parse(
            localStorage.getItem("members")
        ) || [];

    }


    // ================= GET ISSUE RECORDS =================

    function getIssueRecords() {

        return JSON.parse(
            sessionStorage.getItem("issueRecords")
        ) || [];

    }


    // ================= UPDATE DASHBOARD COUNTS =================

    function updateDashboardCounts() {

        let books = getBooks();

        let members = getMembers();

        let issueRecords = getIssueRecords();

        let totalBooks = books.length;

        let totalMembers = members.length;

        let totalIssued = 0;

        let totalReturned = 0;


        for (let i = 0; i < issueRecords.length; i++) {

            if (issueRecords[i].status === "Returned") {

                totalReturned++;

            } else {

                totalIssued++;

            }

        }


        document.getElementById("totalBooks").textContent =
            totalBooks;

        document.getElementById("totalMembers").textContent =
            totalMembers;

        document.getElementById("totalIssued").textContent =
            totalIssued;

        document.getElementById("totalReturned").textContent =
            totalReturned;

    }


    // ================= CLICKABLE DASHBOARD CARDS =================

    let cards = document.querySelectorAll(".cards .card");


    if (cards[0]) {

        cards[0].style.cursor = "pointer";

        cards[0].addEventListener("click", function () {

            window.location.href = "books.html";

        });

    }


    if (cards[1]) {

        cards[1].style.cursor = "pointer";

        cards[1].addEventListener("click", function () {

            window.location.href = "members.html";

        });

    }


    if (cards[2]) {

        cards[2].style.cursor = "pointer";

        cards[2].addEventListener("click", function () {

            window.location.href = "issueBooks.html";

        });

    }


    if (cards[3]) {

        cards[3].style.cursor = "pointer";

        cards[3].addEventListener("click", function () {

            window.location.href = "returnBooks.html";

        });

    }


    // ================= LOGOUT =================

    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {

        logoutLink.addEventListener("click", function (event) {

            event.preventDefault();

            // Remove only current login details

            localStorage.removeItem("currentUser");

            sessionStorage.removeItem("currentUser");

            // Redirect to Login page

            window.location.replace("login.html");

        });

    }


    // ================= INITIAL UPDATE =================

    updateDashboardCounts();

});