document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.cards-table tbody');
  const newCardModal = document.getElementById('newCardModal');
  const returnModal = document.getElementById('returnModal');
  const addCardForm = document.getElementById('addCardForm');
  const returnBookForm = document.getElementById('returnBookForm');
  const visitorSelect = document.getElementById('visitorSelect');
  const bookSelect = document.getElementById('bookSelect');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const filterBy = document.getElementById('filterBy'); 
  const filterId = document.getElementById('filterId'); 
  const searchInput = document.getElementById('searchInput'); 

  let currentCardId = null; 


  let cards = JSON.parse(localStorage.getItem('cards')) || [];
  let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
  let books = JSON.parse(localStorage.getItem('books')) || [];


  renderTable(cards);
  populateVisitorSelect();
  populateBookSelect();


  function populateVisitorSelect() {
      visitorSelect.innerHTML = visitors.map(visitor => `
          <option value="${visitor.id}">${visitor.name}</option>
      `).join('');
  }


  function populateBookSelect() {
      const availableBooks = books.filter(book => !book.isDeleted && book.copies > 0);
      bookSelect.innerHTML = availableBooks.map(book => `
          <option value="${book.id}">${book.title} (${book.copies} available)</option>
      `).join('');
  }

  // Yeni Kart Ekleme 
  addCardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const visitorId = parseInt(visitorSelect.value, 10);
      const bookId = parseInt(bookSelect.value, 10);

      const visitor = visitors.find(v => v.id === visitorId);
      const book = books.find(b => b.id === bookId);

      if (visitor && book && book.copies > 0 && !book.isDeleted) {
          const newCard = {
              id: cards.length + 1, 
              visitorId: visitor.id, 
              bookId: book.id, 
              borrowDate: formatDate(new Date()), 
              returnDate: null
          };

          cards.push(newCard);
          book.copies -= 1; 
          localStorage.setItem('cards', JSON.stringify(cards));
          localStorage.setItem('books', JSON.stringify(books));
          renderTable(cards);
          closeModal();
          addCardForm.reset(); 
          populateBookSelect(); 
          showToast('Kitap başarıyla ödünç verildi!', 'success'); 
      } else {
          showToast('Kitap ödünç verilemedi!', 'error'); 
      }
  });

  // Kitap İade 
  returnBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const returnDate = formatDate(new Date()); // Tarihi bilgisayardan 

      const card = cards.find(c => c.id === currentCardId);
      const book = books.find(b => b.id === card.bookId);

      if (card && book) {
          card.returnDate = returnDate;
          book.copies += 1;
          localStorage.setItem('cards', JSON.stringify(cards));
          localStorage.setItem('books', JSON.stringify(books));
          renderTable(cards);
          closeModal(); 
          showToast('Kitap başarıyla iade edildi!', 'success'); 
      } else {
          showToast('Kitap iade edilemedi!', 'error'); 
      }
  });

  // Tabloyu güncelle
  function renderTable(data) {
      tableBody.innerHTML = data.map(card => {
          const visitor = visitors.find(v => v.id === card.visitorId); 
          const book = books.find(b => b.id === card.bookId); 

          return `
              <tr data-id="${card.id}">
                  <td>${card.id}</td> <!-- ID sütunu -->
                  <td>${visitor ? visitor.name : 'Unknown'}</td>
                  <td>${book ? book.title : 'Unknown'}</td>
                  <td>${formatDateForDisplay(card.borrowDate)}</td> 
                  <td>${card.returnDate ? formatDateForDisplay(card.returnDate) : 'Not Returned'}</td>
                  <td>
                      ${!card.returnDate ? `
                          <button class="return-btn" onclick="openReturnModal(${card.id})">
                              <i class="fas fa-undo"></i> 
                          </button>
                      ` : ''}
                  </td>
              </tr>
          `;
      }).join('');
  }

  // Tarihi standart yapma
  function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  // Tarihi kullanıcıya göster
  function formatDateForDisplay(dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  }

  // Filtre yeri
  filterBy.addEventListener('change', () => {
      const selectedFilter = filterBy.value;

      if (selectedFilter === 'id') {
          filterId.style.display = 'inline-block'; 
      } else {
          filterId.style.display = 'none'; 
      }
  });

  
  filterId.addEventListener('input', () => {
      const searchTerm = filterId.value.trim(); 
      const filteredCards = cards.filter(card => card.id.toString().includes(searchTerm)); 
      renderTable(filteredCards); 
  });

  // Arama İşlemi
  searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredCards = cards.filter(card => {
          const visitor = visitors.find(v => v.id === card.visitorId);
          const book = books.find(b => b.id === card.bookId);
          return (
              visitor.name.toLowerCase().includes(searchTerm) ||
              book.title.toLowerCase().includes(searchTerm)
          );
      });
      renderTable(filteredCards);
  });

  // Yeni Kart yeri
  window.openNewCardModal = () => {
      newCardModal.style.display = 'block'; 
  };

  // İade yeri
  window.openReturnModal = (id) => {
      currentCardId = id; 
      returnModal.style.display = 'block'; 
  };

 //kapatma
  window.closeModal = () => {
      newCardModal.style.display = 'none'; 
      returnModal.style.display = 'none'; 
  };

  //kapatma
  window.addEventListener('click', (e) => {
      if (e.target === newCardModal || e.target === returnModal) {
          closeModal(); 
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