// ================= LOGIN FORM =================

let loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // ================= GET VALUES =================

    let email =
        document.getElementById("loginEmail")
        .value.trim();

    let password =
        document.getElementById("loginPassword")
        .value;


    // ================= GET ERROR ELEMENTS =================

    let emailError =
        document.getElementById("emailError");

    let loginError =
        document.getElementById("loginError");

    let successMessage =
        document.getElementById("successMessage");


    // ================= CLEAR OLD ERRORS =================

    emailError.textContent = "";
    loginError.textContent = "";
    successMessage.style.display = "none";


    // ================= EMAIL VALIDATION =================

    if (email === "") {

        emailError.textContent =
            "❌ Email is required.";

        return;
    }


    if (!email.includes("@")) {

        emailError.textContent =
            "❌ Email must contain @.";

        return;
    }


    let emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        emailError.textContent =
            "❌ Please enter a valid email address.";

        return;
    }


    // ================= PASSWORD CHECK =================

    if (password === "") {

        loginError.textContent =
            "❌ Password is required.";

        return;
    }


    // =====================================================
    // GET ALL REGISTERED USERS
    // =====================================================

    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    // =====================================================
    // FIND USER
    // =====================================================

    let loggedInUser = null;
    for (let i = 0; i < users.length; i++) {
        if (
            users[i].email.trim() === email.trim() &&
            users[i].password === password
    ) {

            loggedInUser = users[i];

            break;
    }
}

    // =====================================================
    // LOGIN SUCCESS
    // =====================================================

    if (loggedInUser) {

        // Store CURRENT USER only in sessionStorage

        sessionStorage.setItem(
            "currentUser",
            JSON.stringify(loggedInUser)
        );


        // Create empty book list for this login session

        sessionStorage.setItem(
            "books",
            JSON.stringify([])
        );


        successMessage.textContent =
            "✓ Login Successful!";

        successMessage.style.display =
            "block";


        // Go to Dashboard

        setTimeout(function() {

            window.location.href =
                "dashboard.html";

        }, 1000);

    }


    // =====================================================
    // LOGIN FAILED
    // =====================================================

    else {

        loginError.textContent =
            "❌ Invalid email or password.";

    }

});


// =====================================================
// LIVE EMAIL VALIDATION
// =====================================================

document.getElementById("loginEmail")
.addEventListener("input", function() {

    let emailError =
        document.getElementById("emailError");

    let email =
        this.value.trim();


    if (email !== "" &&
        !email.includes("@")) {

        emailError.textContent =
            "❌ Email must contain @.";

        return;
    }


    emailError.textContent = "";

});


// =====================================================
// LIVE PASSWORD VALIDATION
// =====================================================

document.getElementById("loginPassword")
.addEventListener("input", function() {

    let loginError =
        document.getElementById("loginError");

    let password =
        this.value;


    if (password !== "") {

        loginError.textContent = "";

    }

});