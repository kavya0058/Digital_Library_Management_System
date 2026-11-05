// ================= REGISTER FORM =================

let registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // ================= GET VALUES =================

    let username =
        document.getElementById("username").value.trim();

    let email =
        document.getElementById("email").value.trim();

    let phone =
        document.getElementById("phone").value.trim();

    let address =
        document.getElementById("address").value.trim();

    let password =
        document.getElementById("password").value;


    // ================= GET ERROR ELEMENTS =================

    let nameError =
        document.getElementById("nameError");

    let emailError =
        document.getElementById("emailError");

    let phoneError =
        document.getElementById("phoneError");

    let passwordError =
        document.getElementById("passwordError");

    let successMessage =
        document.getElementById("successMessage");


    // ================= CLEAR OLD ERRORS =================

    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    passwordError.textContent = "";
    successMessage.style.display = "none";


    // ================= NAME VALIDATION =================

    let namePattern = /^[A-Za-z ]+$/;

    if (username === "") {

        nameError.textContent =
            "❌ Name is required.";

        return;
    }

    if (!namePattern.test(username)) {

        nameError.textContent =
            "❌ Name must contain alphabets only.";

        return;
    }

    if (username.length > 50) {

        nameError.textContent =
            "❌ Name must not exceed 50 characters.";

        return;
    }


    // ================= PHONE VALIDATION =================

    if (phone === "") {

        phoneError.textContent =
            "❌ Phone number is required.";

        return;
    }

    if (!/^[0-9]+$/.test(phone)) {

        phoneError.textContent =
            "❌ Phone number must contain numbers only.";

        return;
    }

    if (phone.length !== 10) {

        phoneError.textContent =
            "❌ Phone number must contain exactly 10 digits.";

        return;
    }


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


    // ================= PASSWORD VALIDATION =================

    if (password === "") {

        passwordError.textContent =
            "❌ Password is required.";

        return;
    }

    let passwordPattern =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/;

    if (!passwordPattern.test(password)) {

        passwordError.textContent =
            "❌ Password must contain capital, small, number, special character and minimum 8 characters.";

        return;
    }


    // =====================================================
    // GET EXISTING USERS
    // =====================================================

    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    // =====================================================
    // CHECK EMAIL ALREADY EXISTS
    // =====================================================

    let existingUser =
        users.find(function(user) {

            return user.email === email;

        });


    if (existingUser) {

        emailError.textContent =
            "❌ This email is already registered.";

        return;
    }


    // =====================================================
    // CREATE NEW USER
    // =====================================================

    let newUser = {

        username: username,
        email: email,
        phone: phone,
        address: address,
        password: password

    };


    // =====================================================
    // ADD USER TO USERS ARRAY
    // =====================================================

    users.push(newUser);


    // =====================================================
    // SAVE ALL USERS
    // =====================================================

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // ================= SUCCESS =================

    successMessage.textContent =
        "✓ Registered Successfully!";

    successMessage.style.display = "block";


    // Clear form

    registerForm.reset();

});


// =====================================================
// LIVE NAME VALIDATION
// =====================================================

document.getElementById("username")
.addEventListener("input", function() {

    let nameError =
        document.getElementById("nameError");

    let username =
        this.value;

    if (username.length > 50) {

        nameError.textContent =
            "❌ Name must not exceed 50 characters.";

        return;
    }

    if (username !== "" &&
        !/^[A-Za-z ]+$/.test(username)) {

        nameError.textContent =
            "❌ Name must contain alphabets only.";

        return;
    }

    nameError.textContent = "";

});


// =====================================================
// LIVE PHONE VALIDATION
// =====================================================

document.getElementById("phone")
.addEventListener("input", function() {

    let phoneError =
        document.getElementById("phoneError");

    // Remove anything except numbers

    this.value =
        this.value.replace(/[^0-9]/g, "");


    if (this.value.length > 10) {

        this.value =
            this.value.substring(0, 10);

        phoneError.textContent =
            "❌ Phone number cannot exceed 10 digits.";

        return;
    }

    phoneError.textContent = "";

});


// =====================================================
// LIVE EMAIL VALIDATION
// =====================================================

document.getElementById("email")
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

document.getElementById("password")
.addEventListener("input", function() {

    let passwordError =
        document.getElementById("passwordError");

    let password =
        this.value;


    let passwordPattern =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/;


    if (password !== "" &&
        !passwordPattern.test(password)) {

        passwordError.textContent =
            "❌ Password must contain capital, small, number, special character and minimum 8 characters.";

        return;
    }

    passwordError.textContent = "";

});

