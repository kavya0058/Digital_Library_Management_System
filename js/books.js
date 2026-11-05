// ================= BOOK FORM =================

const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");
const addBookSection = document.getElementById("addBookSection");
const showAddBook = document.getElementById("showAddBook");
const cancelButton = document.getElementById("cancelButton");
const successMessage = document.getElementById("successMessage");



// ================= INDEX VARIABLES =================

let editIndex = -1;
let deleteIndex = -1;


// ================= GET BOOKS =================

function getBooks() {
    try {
        return JSON.parse(sessionStorage.getItem("books")) || [];
    } catch (error) {
        return [];
    }
}


// ================= SAVE BOOKS =================

function saveBooks(books) {
    sessionStorage.setItem("books", JSON.stringify(books));
}


// ================= HELPER FUNCTIONS =================

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}

function setValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.value = value || "";
    }
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "";
    }
}

function clearErrors() {
    const errorIds = [
        "bookIdError",
        "bookNameError",
        "authorError",
        "categoryError",
        "publisherError",
        "yearError",
        "quantityError"
    ];

    errorIds.forEach(function (id) {
        setText(id, "");
    });
}


// ================= SHOW ADD BOOK FORM =================

if (showAddBook) {
    showAddBook.addEventListener("click", function () {

        addBookSection.style.display = "block";

        addBookSection.scrollIntoView({
            behavior: "smooth"
        });

    });
}


// ================= CANCEL BUTTON =================

if (cancelButton) {
    cancelButton.addEventListener("click", function () {

        bookForm.reset();

        addBookSection.style.display = "none";

        editIndex = -1;

        clearErrors();

        setText("successMessage", "");

    });
}


// ================= DISPLAY BOOKS =================

function displayBooks() {

    if (!bookTableBody) return;

    const books = getBooks();

    const searchValue = bookSearch
        ? bookSearch.value.trim().toLowerCase()
        : "";

    const filteredBooks = books
        .map(function (book, index) {
            return {
                book: book,
                index: index
            };
        })
        .filter(function (item) {

            const book = item.book;

            return (
                String(book.bookId || "").toLowerCase().includes(searchValue) ||
                String(book.bookName || "").toLowerCase().includes(searchValue) ||
                String(book.author || "").toLowerCase().includes(searchValue) ||
                String(book.category || "").toLowerCase().includes(searchValue)
            );

        });

    bookTableBody.replaceChildren();


    // NO BOOKS

    if (books.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent =
            'No books available. Click "Add Book" to add a book.';

        cell.style.textAlign = "center";

        row.appendChild(cell);
        bookTableBody.appendChild(row);

        return;
    }


    // NO SEARCH RESULTS

    if (filteredBooks.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No books found.";
        cell.style.textAlign = "center";

        row.appendChild(cell);
        bookTableBody.appendChild(row);

        return;
    }


    // DISPLAY BOOKS

    filteredBooks.forEach(function (item) {

        const book = item.book;
        const index = item.index;

        const row = document.createElement("tr");

        const values = [
            book.bookId,
            book.bookName,
            book.author,
            book.category,
            book.quantity
        ];

        values.forEach(function (value) {

            const cell = document.createElement("td");

            cell.textContent = value ?? "";

            row.appendChild(cell);

        });


        // ACTION BUTTONS

        const actionCell = document.createElement("td");

        const viewButton = document.createElement("button");
        viewButton.type = "button";
        viewButton.className = "view-button";
        viewButton.textContent = "View";

        viewButton.addEventListener("click", function () {
            viewBook(index);
        });


        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editBook(index);
        });


        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteBook(index);
        });


        actionCell.append(
            viewButton,
            document.createTextNode(" "),
            editButton,
            document.createTextNode(" "),
            deleteButton
        );

        row.appendChild(actionCell);

        bookTableBody.appendChild(row);

    });

}


// ================= SEARCH MY LIBRARY =================

if (bookSearch) {

    bookSearch.addEventListener("input", function () {
        displayBooks();
    });

}


// ================= CLEAR SEARCH =================

if (clearSearch) {

    clearSearch.addEventListener("click", function () {

        if (bookSearch) {

            bookSearch.value = "";

            displayBooks();

            bookSearch.focus();

        }

    });

}


// ================= ADD / UPDATE BOOK =================

if (bookForm) {

    bookForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearErrors();

        setText("successMessage", "");


        // GET FORM VALUES

        const bookId = getValue("bookId");
        const bookName = getValue("bookName");
        const author = getValue("author");
        const category = getValue("category");
        const publisher = getValue("publisher");
        const year = getValue("year");
        const quantity = getValue("quantity");

        const image = getValue("bookImage");
        const url = getValue("bookUrl");

        let valid = true;

        const books = getBooks();


        // BOOK ID VALIDATION

        if (bookId === "") {

            setText("bookIdError", "❌ Book ID is required.");

            valid = false;

        } else if (bookId.length > 10) {

            setText(
                "bookIdError",
                "❌ Book ID must not exceed 10 characters."
            );

            valid = false;

        }


        // DUPLICATE BOOK ID

        if (bookId !== "") {

            const duplicateBook = books.some(function (book, index) {

                return (
                    String(book.bookId).toLowerCase() === bookId.toLowerCase() &&
                    index !== editIndex
                );

            });

            if (duplicateBook) {

                setText(
                    "bookIdError",
                    "❌ This Book ID already exists."
                );

                valid = false;

            }

        }


        // BOOK NAME

        if (bookName === "") {

            setText("bookNameError", "❌ Book Name is required.");

            valid = false;

        }


        // AUTHOR

        if (author === "") {

            setText("authorError", "❌ Author is required.");

            valid = false;

        }


        // CATEGORY

        if (category === "") {

            setText("categoryError", "❌ Category is required.");

            valid = false;

        }


        // PUBLISHER

        if (publisher === "") {

            setText("publisherError", "❌ Publisher is required.");

            valid = false;

        }


        // YEAR

        if (year === "") {

            setText("yearError", "❌ Year is required.");

            valid = false;

        } else if (!/^[0-9]{4}$/.test(year)) {

            setText(
                "yearError",
                "❌ Year must contain exactly 4 digits."
            );

            valid = false;

        }


        // QUANTITY

        if (quantity === "") {

            setText("quantityError", "❌ Quantity is required.");

            valid = false;

        } else if (!/^[0-9]+$/.test(quantity)) {

            setText(
                "quantityError",
                "❌ Quantity must contain numbers only."
            );

            valid = false;

        } else if (Number(quantity) <= 0) {

            setText(
                "quantityError",
                "❌ Quantity must be greater than zero."
            );

            valid = false;

        } else if (Number(quantity) > 100) {

            setText(
                "quantityError",
                "❌ Quantity must not exceed 100."
            );

            valid = false;

        }


        // STOP IF INVALID

        if (!valid) return;


        // BOOK OBJECT

        const bookData = {

            bookId: bookId,
            bookName: bookName,
            author: author,
            category: category,
            publisher: publisher,
            year: year,
            quantity: Number(quantity),

            image: image,
            url: url

        };


        // UPDATE BOOK

        if (editIndex !== -1) {

            books[editIndex] = bookData;

            saveBooks(books);

            setText(
                "successMessage",
                "✅ Book updated successfully!"
            );

        } else {

            // ADD NEW BOOK

            books.push(bookData);

            saveBooks(books);

            setText(
                "successMessage",
                "✅ Book added successfully!"
            );

        }


        bookForm.reset();

        editIndex = -1;

        displayBooks();


        setTimeout(function () {

            if (addBookSection) {
                addBookSection.style.display = "none";
            }

            setText("successMessage", "");

        }, 1500);

    });

}


// ================= EDIT BOOK =================

function editBook(index) {

    const books = getBooks();

    const book = books[index];

    if (!book) return;

    editIndex = index;

    setValue("bookId", book.bookId);
    setValue("bookName", book.bookName);
    setValue("author", book.author);
    setValue("category", book.category);
    setValue("publisher", book.publisher);
    setValue("year", book.year);
    setValue("quantity", book.quantity);

    setValue("bookImage", book.image || book.bookImage || "");
    setValue("bookUrl", book.url || book.bookUrl || "");

    clearErrors();

    addBookSection.style.display = "block";

    addBookSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ================= VIEW BOOK =================

function viewBook(index) {

    const books = getBooks();

    const book = books[index];

    if (!book) return;


    setText("viewBookId", book.bookId);
    setText("viewBookName", book.bookName);
    setText("viewAuthor", book.author);
    setText("viewCategory", book.category);
    setText("viewPublisher", book.publisher);
    setText("viewYear", book.year);
    setText("viewQuantity", book.quantity);


    // BOOK COVER IMAGE

    const imageElement = document.getElementById("viewBookImage");

    const imageUrl = book.image || book.bookImage || "";

    if (imageElement) {

        if (imageUrl) {

            imageElement.src = imageUrl;
            imageElement.alt = "Cover of " + book.bookName;
            imageElement.style.display = "block";

            imageElement.onerror = function () {
                this.style.display = "none";
            };

        } else {

            imageElement.removeAttribute("src");
            imageElement.style.display = "none";

        }

    }


    // BOOK INFORMATION LINK

    const linkElement = document.getElementById("viewBookUrl");

    const bookUrl = book.url || book.bookUrl || "";

    if (linkElement) {

        if (bookUrl) {

            linkElement.href = bookUrl;
            linkElement.textContent = "Open book information";
            linkElement.target = "_blank";
            linkElement.rel = "noopener noreferrer";
            linkElement.style.display = "inline-block";

        } else {

            linkElement.removeAttribute("href");
            linkElement.textContent = "";
            linkElement.style.display = "none";

        }

    }


    const modal = document.getElementById("bookModal");

    if (modal) {
        modal.style.display = "flex";
    }

}


// ================= CLOSE BOOK DETAILS =================

function closeBookDetails() {

    const modal = document.getElementById("bookModal");

    if (modal) {
        modal.style.display = "none";
    }

}


// ================= DELETE BOOK =================

function deleteBook(index) {

    const books = getBooks();

    const book = books[index];

    if (!book) return;

    deleteIndex = index;

    setText("deleteBookName", book.bookName);

    const modal = document.getElementById("deleteModal");

    if (modal) {
        modal.style.display = "flex";
    }

}


// ================= CLOSE DELETE MODAL =================

function closeDeleteModal() {

    const modal = document.getElementById("deleteModal");

    if (modal) {
        modal.style.display = "none";
    }

    deleteIndex = -1;

}


// ================= CONFIRM DELETE =================

function confirmDelete() {

    if (deleteIndex === -1) return;

    const books = getBooks();

    books.splice(deleteIndex, 1);

    saveBooks(books);

    displayBooks();

    closeDeleteModal();

}


// Make functions available to HTML onclick attributes

window.viewBook = viewBook;
window.editBook = editBook;
window.deleteBook = deleteBook;
window.closeBookDetails = closeBookDetails;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;


// ================= YEAR INPUT =================

const yearInput = document.getElementById("year");

if (yearInput) {

    yearInput.addEventListener("input", function () {

        this.value = this.value
            .replace(/[^0-9]/g, "")
            .slice(0, 4);

    });

}


// ================= QUANTITY INPUT =================

const quantityInput = document.getElementById("quantity");

if (quantityInput) {

    quantityInput.addEventListener("input", function () {

        this.value = this.value
            .replace(/[^0-9]/g, "")
            .slice(0, 3);

    });

}
// ================= INITIAL DISPLAY =================

displayBooks();

// ================= TABLE / GALLERY VIEW =================

let currentBookView = "table";

const tableViewBtn = document.getElementById("tableViewBtn");
const galleryViewBtn = document.getElementById("galleryViewBtn");
const bookGallery = document.getElementById("bookGallery");

function renderBookGallery() {

    if (!bookGallery) return;

    const books = getBooks();

    const searchValue = bookSearch
        ? bookSearch.value.trim().toLowerCase()
        : "";

    const filteredBooks = books
        .map(function (book, index) {
            return {
                book: book,
                index: index
            };
        })
        .filter(function (item) {

            const book = item.book;

            return (
                String(book.bookId || "").toLowerCase().includes(searchValue) ||
                String(book.bookName || "").toLowerCase().includes(searchValue) ||
                String(book.author || "").toLowerCase().includes(searchValue) ||
                String(book.category || "").toLowerCase().includes(searchValue)
            );

        });

    bookGallery.replaceChildren();

    if (filteredBooks.length === 0) {

        const message = document.createElement("p");

        message.textContent = books.length === 0
            ? "No books available. Add your first book!"
            : "No books found.";

        bookGallery.appendChild(message);

        return;
    }

    filteredBooks.forEach(function (item) {

        const book = item.book;
        const index = item.index;

        const card = document.createElement("div");
        card.className = "gallery-book-card";

        const imageUrl = book.image || book.bookImage || "";

        if (imageUrl) {

            const image = document.createElement("img");

            image.className = "gallery-book-cover";
            image.src = imageUrl;
            image.alt = "Cover of " + book.bookName;

            image.onerror = function () {

                const placeholder = document.createElement("div");

                placeholder.className = "gallery-no-cover";
                placeholder.textContent = "📚 Cover unavailable";

                this.replaceWith(placeholder);

            };

            card.appendChild(image);

        } else {

            const placeholder = document.createElement("div");

            placeholder.className = "gallery-no-cover";
            placeholder.textContent = "📚 No cover image";

            card.appendChild(placeholder);

        }


        const title = document.createElement("h3");

        title.textContent = book.bookName || "Untitled";

        card.appendChild(title);


        const author = document.createElement("p");

        author.textContent = "Author: " + (book.author || "Unknown");

        card.appendChild(author);


        const category = document.createElement("p");

        category.textContent = "Category: " + (book.category || "Uncategorized");

        card.appendChild(category);


        const quantity = document.createElement("p");

        quantity.textContent = "Available: " + (book.quantity ?? 0);

        card.appendChild(quantity);


        const viewButton = document.createElement("button");

        viewButton.type = "button";
        viewButton.className = "gallery-details-btn";
        viewButton.textContent = "View Details";

        viewButton.addEventListener("click", function () {
            viewBook(index);
        });

        card.appendChild(viewButton);

        bookGallery.appendChild(card);

    });

}


// ================= SWITCH VIEW =================

function switchBookView(view) {

    currentBookView = view;

    const table = document.getElementById("bookTableBody");

    const tableContainer = table
        ? table.closest("table")
        : null;

    if (tableContainer) {

        tableContainer.style.display =
            view === "table" ? "" : "none";

    }

    if (bookGallery) {

        bookGallery.style.display =
            view === "gallery" ? "grid" : "none";

    }

    if (tableViewBtn) {

        tableViewBtn.classList.toggle(
            "active-view",
            view === "table"
        );

    }

    if (galleryViewBtn) {

        galleryViewBtn.classList.toggle(
            "active-view",
            view === "gallery"
        );

    }

    if (view === "gallery") {
        renderBookGallery();
    }

}


if (tableViewBtn) {

    tableViewBtn.addEventListener("click", function () {
        switchBookView("table");
    });

}


if (galleryViewBtn) {

    galleryViewBtn.addEventListener("click", function () {
        switchBookView("gallery");
    });

}


// Refresh gallery after books are added, edited, or deleted.
const originalDisplayBooks = displayBooks;

displayBooks = function () {

    originalDisplayBooks();

    if (currentBookView === "gallery") {
        renderBookGallery();
    }

};