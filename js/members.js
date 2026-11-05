// ================= GET ELEMENTS =================

let memberForm = document.getElementById("memberForm");

let memberId = document.getElementById("memberId");
let memberName = document.getElementById("memberName");
let department = document.getElementById("department");
let memberEmail = document.getElementById("memberEmail");
let memberMobile = document.getElementById("memberMobile");

let memberIdError = document.getElementById("memberIdError");
let memberNameError = document.getElementById("memberNameError");
let departmentError = document.getElementById("departmentError");
let memberEmailError = document.getElementById("memberEmailError");
let memberMobileError = document.getElementById("memberMobileError");

let successMessage = document.getElementById("successMessage");
let memberTableBody = document.getElementById("memberTableBody");

let addMemberSection = document.getElementById("addMemberSection");
let showAddMember = document.getElementById("showAddMember");
let cancelButton = document.getElementById("cancelButton");

let searchMember = document.getElementById("searchMember");
let clearSearch = document.getElementById("clearSearch");


// ================= MODAL ELEMENTS =================

let memberModal = document.getElementById("memberModal");
let closeMemberModal = document.getElementById("closeMemberModal");
let closeMemberBtn = document.getElementById("closeMemberBtn");


// ================= EDIT MODE =================

let editMemberId = null;


// ================= GET MEMBERS =================

function getMembers() {

    return JSON.parse(
        localStorage.getItem("members")
    ) || [];

}


// ================= SAVE MEMBERS =================

function saveMembers(members) {

    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );

}


// ================= CLEAR ERRORS =================

function clearErrors() {

    memberIdError.textContent = "";
    memberNameError.textContent = "";
    departmentError.textContent = "";
    memberEmailError.textContent = "";
    memberMobileError.textContent = "";

}


// ================= SHOW ADD MEMBER FORM =================

showAddMember.addEventListener("click", function() {

    addMemberSection.style.display = "block";

    memberForm.reset();

    clearErrors();

    successMessage.textContent = "";

    editMemberId = null;

    memberId.disabled = false;

    memberId.focus();

    addMemberSection.scrollIntoView({
        behavior: "smooth"
    });

});


// ================= CANCEL BUTTON =================

cancelButton.addEventListener("click", function() {

    memberForm.reset();

    clearErrors();

    successMessage.textContent = "";

    editMemberId = null;

    memberId.disabled = false;

    addMemberSection.style.display = "none";

});


// ================= MEMBER ID VALIDATION =================

memberId.addEventListener("input", function() {

    this.value = this.value.replace(/\s/g, "");

    if (this.value === "") {

        memberIdError.textContent =
            "❌ Member ID is required.";

    } else {

        memberIdError.textContent = "";

    }

});


// ================= NAME VALIDATION =================

memberName.addEventListener("input", function() {

    this.value = this.value.replace(/[^a-zA-Z ]/g, "");

    if (this.value.trim() === "") {

        memberNameError.textContent =
            "❌ Name is required.";

    } else {

        memberNameError.textContent = "";

    }

});


// ================= DEPARTMENT VALIDATION =================

department.addEventListener("input", function() {

    if (this.value.trim() === "") {

        departmentError.textContent =
            "❌ Department is required.";

    } else {

        departmentError.textContent = "";

    }

});


// ================= EMAIL VALIDATION =================

memberEmail.addEventListener("input", function() {

    let email = this.value.trim();

    if (email === "") {

        memberEmailError.textContent =
            "❌ Email is required.";

        return;

    }

    if (!email.includes("@")) {

        memberEmailError.textContent =
            "❌ Email must contain @.";

        return;

    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        memberEmailError.textContent =
            "❌ Please enter a valid email address.";

        return;

    }

    memberEmailError.textContent = "";

});


// ================= MOBILE VALIDATION =================

memberMobile.addEventListener("input", function() {

    this.value = this.value
        .replace(/[^0-9]/g, "")
        .slice(0, 10);

    if (this.value === "") {

        memberMobileError.textContent =
            "❌ Mobile number is required.";

    } else if (this.value.length < 10) {

        memberMobileError.textContent =
            "❌ Mobile number must be 10 digits.";

    } else {

        memberMobileError.textContent = "";

    }

});


// ================= ADD / UPDATE MEMBER =================

memberForm.addEventListener("submit", function(event) {

    event.preventDefault();

    clearErrors();

    successMessage.textContent = "";

    let idValue = memberId.value.trim();
    let nameValue = memberName.value.trim();
    let departmentValue = department.value.trim();
    let emailValue = memberEmail.value.trim();
    let mobileValue = memberMobile.value.trim();

    let valid = true;


    // MEMBER ID

    if (idValue === "") {

        memberIdError.textContent =
            "❌ Member ID is required.";

        valid = false;

    }


    // NAME

    if (nameValue === "") {

        memberNameError.textContent =
            "❌ Name is required.";

        valid = false;

    }


    // DEPARTMENT

    if (departmentValue === "") {

        departmentError.textContent =
            "❌ Department is required.";

        valid = false;

    }


    // EMAIL

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {

        memberEmailError.textContent =
            "❌ Email is required.";

        valid = false;

    } else if (!emailPattern.test(emailValue)) {

        memberEmailError.textContent =
            "❌ Please enter a valid email address.";

        valid = false;

    }


    // MOBILE

    if (mobileValue === "") {

        memberMobileError.textContent =
            "❌ Mobile number is required.";

        valid = false;

    } else if (!/^\d{10}$/.test(mobileValue)) {

        memberMobileError.textContent =
            "❌ Mobile number must be exactly 10 digits.";

        valid = false;

    }


    if (!valid) {
        return;
    }


    // GET EXISTING MEMBERS

    let members = getMembers();


    // DUPLICATE MEMBER ID

    let duplicateId = members.find(function(member) {

        return (
            member.memberId.toLowerCase() === idValue.toLowerCase() &&
            member.memberId !== editMemberId
        );

    });


    if (duplicateId) {

        memberIdError.textContent =
            "❌ This Member ID is already registered.";

        return;

    }


    // DUPLICATE EMAIL

    let duplicateEmail = members.find(function(member) {

        return (
            member.email.toLowerCase() === emailValue.toLowerCase() &&
            member.memberId !== editMemberId
        );

    });


    if (duplicateEmail) {

        memberEmailError.textContent =
            "❌ This email is already registered.";

        return;

    }


    // UPDATE MEMBER

    if (editMemberId !== null) {

        let memberIndex = members.findIndex(function(member) {

            return member.memberId === editMemberId;

        });


        if (memberIndex !== -1) {

            members[memberIndex] = {

                memberId: editMemberId,
                name: nameValue,
                department: departmentValue,
                email: emailValue,
                mobile: mobileValue

            };

        }


        saveMembers(members);

        successMessage.textContent =
            "✓ Member updated successfully!";

    }


    // ADD MEMBER

    else {

        let newMember = {

            memberId: idValue,
            name: nameValue,
            department: departmentValue,
            email: emailValue,
            mobile: mobileValue

        };

        members.push(newMember);

        saveMembers(members);

        successMessage.textContent =
            "✓ Member added successfully!";

    }


    // REFRESH TABLE

    displayMembers();


    // RESET FORM

    memberForm.reset();

    editMemberId = null;

    memberId.disabled = false;


    setTimeout(function() {

        addMemberSection.style.display = "none";

        successMessage.textContent = "";

    }, 1200);

});


// ================= DISPLAY MEMBERS =================

function displayMembers(list) {

    let members = list || getMembers();

    memberTableBody.innerHTML = "";


    if (members.length === 0) {

        memberTableBody.innerHTML = `

            <tr>

                <td colspan="6" style="text-align:center; padding:20px;">

                    No members available.
                    Click "Add Member" to add a member.

                </td>

            </tr>

        `;

        return;

    }


    members.forEach(function(member) {

        let row = document.createElement("tr");


        // Build table cells safely

        [
            member.memberId,
            member.name,
            member.department,
            member.email,
            member.mobile
        ].forEach(function(value) {

            let cell = document.createElement("td");

            cell.textContent = value || "-";

            row.appendChild(cell);

        });


        let actionCell = document.createElement("td");


        // VIEW BUTTON

        let viewButton = document.createElement("button");

        viewButton.className = "view-button";

        viewButton.textContent = "View";

        viewButton.type = "button";

        viewButton.addEventListener("click", function() {

            viewMember(member.memberId);

        });


        // EDIT BUTTON

        let editButton = document.createElement("button");

        editButton.className = "edit-button";

        editButton.textContent = "Edit";

        editButton.type = "button";

        editButton.addEventListener("click", function() {

            editMember(member.memberId);

        });


        // DELETE BUTTON

        let deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";

        deleteButton.textContent = "Delete";

        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {

            deleteMember(member.memberId);

        });


        actionCell.appendChild(viewButton);

        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        memberTableBody.appendChild(row);

    });

}


// ================= VIEW MEMBER MODAL =================

function viewMember(id) {

    let members = getMembers();

    let member = members.find(function(item) {

        return item.memberId === id;

    });


    if (!member || !memberModal) {
        return;
    }


    // DISPLAY MEMBER DETAILS

    document.getElementById("viewMemberId").textContent =
        member.memberId || "-";

    document.getElementById("viewMemberName").textContent =
        member.name || "-";

    document.getElementById("viewMemberDepartment").textContent =
        member.department || "-";

    document.getElementById("viewMemberEmail").textContent =
        member.email || "-";

    document.getElementById("viewMemberMobile").textContent =
        member.mobile || "-";


    // OPEN MODAL

    memberModal.style.display = "flex";

    memberModal.setAttribute("aria-hidden", "false");

}


// ================= CLOSE MEMBER MODAL =================

function hideMemberModal() {

    if (!memberModal) {
        return;
    }

    memberModal.style.display = "none";

    memberModal.setAttribute("aria-hidden", "true");

}


if (closeMemberModal) {

    closeMemberModal.addEventListener("click", hideMemberModal);

}


if (closeMemberBtn) {

    closeMemberBtn.addEventListener("click", hideMemberModal);

}


if (memberModal) {

    memberModal.addEventListener("click", function(event) {

        if (event.target === memberModal) {

            hideMemberModal();

        }

    });

}


document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        hideMemberModal();

    }

});


// ================= EDIT MEMBER =================

function editMember(id) {

    let members = getMembers();

    let member = members.find(function(item) {

        return item.memberId === id;

    });


    if (!member) {
        return;
    }


    addMemberSection.style.display = "block";

    memberId.value = member.memberId;

    memberName.value = member.name;

    department.value = member.department;

    memberEmail.value = member.email;

    memberMobile.value = member.mobile;


    editMemberId = member.memberId;

    memberId.disabled = true;

    clearErrors();

    successMessage.textContent = "";

    addMemberSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ================= DELETE MEMBER =================

function deleteMember(id) {

    let members = getMembers();

    let member = members.find(function(item) {

        return item.memberId === id;

    });


    if (!member) {
        return;
    }


    let confirmDelete = confirm(
        "Are you sure you want to delete " + member.name + "?"
    );


    if (!confirmDelete) {
        return;
    }


    members = members.filter(function(item) {

        return item.memberId !== id;

    });


    saveMembers(members);

    displayMembers();

}


// ================= SEARCH MEMBER =================

searchMember.addEventListener("input", function() {

    let searchValue = this.value.trim().toLowerCase();

    let members = getMembers();


    if (searchValue === "") {

        displayMembers(members);

        return;

    }


    let filteredMembers = members.filter(function(member) {

        return (

            member.memberId.toLowerCase().includes(searchValue) ||

            member.name.toLowerCase().includes(searchValue) ||

            member.department.toLowerCase().includes(searchValue)

        );

    });


    displayMembers(filteredMembers);

});


// ================= CLEAR SEARCH =================

clearSearch.addEventListener("click", function() {

    searchMember.value = "";

    displayMembers();

});


// ================= LOGOUT =================

let logoutButton = document.getElementById("logout");

if (logoutButton) {

    logoutButton.addEventListener("click", function(event) {

        event.preventDefault();

        sessionStorage.clear();

        window.location.href = "login.html";

    });

}


// ================= INITIAL DISPLAY =================

displayMembers();