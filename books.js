document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.books-table tbody');
    const searchInput = document.getElementById('searchInput');
    const sortBy = document.getElementById('sortBy');
    const newBookModal = document.getElementById('newBookModal');
    const editModal = document.getElementById('editModal');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const addBookForm = document.getElementById('addBookForm');
    const editBookForm = document.getElementById('editBookForm');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    let currentBookId = null; 

 
    let books = JSON.parse(localStorage.getItem('books')) || [];

 
    renderTable(books);

    //yeni kitap ekleme yeri
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const publisher = document.getElementById('bookPublisher').value.trim();
        const copies = parseInt(document.getElementById('bookCopies').value.trim(), 10);
        const pages = parseInt(document.getElementById('bookPages').value.trim(), 10); // Sayfa sayısı

        if (title && author && publisher && !isNaN(copies) && copies >= 0 && !isNaN(pages) && pages >= 1) {
            
            const existingBook = books.find(book =>
                book.title.toLowerCase() === title.toLowerCase() &&
                book.author.toLowerCase() === author.toLowerCase() &&
                book.publisher.toLowerCase() === publisher.toLowerCase()
            );

            if (existingBook) {
                
                existingBook.copies += copies;
                showToast('Kitabın kopya sayısı güncellendi!', 'success');
            } else {
                
                const newBook = {
                    id: books.length + 1,
                    title,
                    author,
                    publisher,
                    copies,
                    pages 
                };
                books.push(newBook);
                showToast('Kitap başarıyla eklendi!', 'success');
            }

            localStorage.setItem('books', JSON.stringify(books)); 
            renderTable(books);
            closeModal(); 
            addBookForm.reset(); 
        } else {
            showToast('Lütfen tüm alanları doğru şekilde doldurun!', 'error'); 
        }
    });

    // Tabloyu yükleme
    function renderTable(data) {
        tableBody.innerHTML = data.map(book => `
            <tr data-id="${book.id}">
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher}</td>
                <td>${book.copies}</td>
                <td>${book.pages}</td> 
                <td class="action-buttons">
                    <button class="edit-btn" onclick="openEditModal(${book.id})">
                        <i class="fas fa-pencil-alt"></i> 
                    </button>
                    <button class="delete-btn" onclick="openDeleteConfirmationModal(${book.id})">
                        <i class="fas fa-trash"></i> 
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Arama İşlemi
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.publisher.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredBooks);
    });

    // Sıralama İşlemi
    sortBy.addEventListener('change', () => {
        const sortKey = sortBy.value;
        const sortedBooks = books.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return -1;
            if (a[sortKey] > b[sortKey]) return 1;
            return 0;
        });
        renderTable(sortedBooks);
    });

    // Yeni Kitap yeri
    window.openNewBookModal = () => {
        newBookModal.style.display = 'block'; 
    };

    // kitap düzenleme yeri
    window.openEditModal = (id) => {
        const book = books.find(b => b.id === id);
        if (book) {
            currentBookId = id; 
            document.getElementById('editTitle').value = book.title;
            document.getElementById('editAuthor').value = book.author;
            document.getElementById('editPublisher').value = book.publisher;
            document.getElementById('editCopies').value = book.copies;
            document.getElementById('editPages').value = book.pages; 
            editModal.style.display = 'block'; // Modal'ı göster
        }
    };

    // Silme Onay yeri
    window.openDeleteConfirmationModal = (id) => {
        currentBookId = id; 
        deleteConfirmationModal.style.display = 'block'; 
    };

    // Silme İşlemini çalıştırma
    window.confirmDelete = () => {
        books = books.filter(book => book.id !== currentBookId); 
        localStorage.setItem('books', JSON.stringify(books)); 
        renderTable(books); // Tabloyu güncelle
        closeModal(); // Modal'ı kapat
        showToast('Kitap başarıyla silindi', 'success'); 
    };

    //pencere kapatma
    window.closeModal = () => {
        newBookModal.style.display = 'none'; 
        editModal.style.display = 'none'; 
        deleteConfirmationModal.style.display = 'none'; 
    };

    //pencere kapatma 
    window.addEventListener('click', (e) => {
        if (e.target === newBookModal || e.target === editModal || e.target === deleteConfirmationModal) {
            closeModal(); 
        }
    });

    // Kitap Düzenleme yeri
    editBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTitle = document.getElementById('editTitle').value.trim();
        const newAuthor = document.getElementById('editAuthor').value.trim();
        const newPublisher = document.getElementById('editPublisher').value.trim();
        const newCopies = parseInt(document.getElementById('editCopies').value.trim(), 10);
        const newPages = parseInt(document.getElementById('editPages').value.trim(), 10); 

        if (newTitle && newAuthor && newPublisher && !isNaN(newCopies) && newCopies >= 0 && !isNaN(newPages) && newPages >= 1) {
            const book = books.find(b => b.id === currentBookId);
            if (book) {
                book.title = newTitle;
                book.author = newAuthor;
                book.publisher = newPublisher;
                book.copies = newCopies;
                book.pages = newPages; 
                localStorage.setItem('books', JSON.stringify(books)); 
                renderTable(books); 
                closeModal();
                showToast('Kitap başarıyla güncellendi!', 'success'); 
            }
        } else {
            showToast('Lütfen tüm alanları doğru şekilde doldurun!', 'error'); 
        }
    });

    //bildirim
    function showToast(message, type = 'info') {
        toastMessage.textContent = message; 
        toast.className = 'toast'; 
        toast.classList.add('show', type); 
        setTimeout(() => {
            toast.classList.remove('show'); 
        }, 3000); 
    }
});