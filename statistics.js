document.addEventListener('DOMContentLoaded', () => {

    const books = JSON.parse(localStorage.getItem('books')) || [];
    const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const cards = JSON.parse(localStorage.getItem('cards')) || [];

    // En çok alınan kitapları hesapla
    const popularBooks = calculatePopularBooks(books, cards);
    renderTable(popularBooks, 'popularBooksTable');

    // En çok kitap alan ziyaretçileri hesapla
    const activeVisitors = calculateActiveVisitors(visitors, cards);
    renderTable(activeVisitors, 'activeVisitorsTable');

    // En uzun süre ödünçte kalan kitapları hesapla
    const longestBorrowedBooks = calculateLongestBorrowedBooks(books, cards);
    renderTable(longestBorrowedBooks, 'longestBorrowedBooksTable');

    // En az ödünç alınan kitapları hesapla
    const leastBorrowedBooks = calculateLeastBorrowedBooks(books, cards);
    renderTable(leastBorrowedBooks, 'leastBorrowedBooksTable');

    //aylık ödünc almayı hesapla
    const monthlyBorrowStats = calculateMonthlyBorrowStats(cards);
    renderTable(monthlyBorrowStats, 'monthlyBorrowStatsTable');
});

// En çok alınan kitapları hesapla
function calculatePopularBooks(books, cards) {
    const bookBorrowCounts = {};

    cards.forEach(card => {
        if (!bookBorrowCounts[card.bookId]) {
            bookBorrowCounts[card.bookId] = 0;
        }
        bookBorrowCounts[card.bookId]++;
    });

    const sortedBooks = books.map(book => ({
        title: book.title,
        author: book.author,
        borrowCount: bookBorrowCounts[book.id] || 0
    })).sort((a, b) => b.borrowCount - a.borrowCount);

    return sortedBooks.slice(0, 5); 
}

// En çok kitap alan ziyaretçileri hesapla
function calculateActiveVisitors(visitors, cards) {
    const visitorBorrowCounts = {};

    cards.forEach(card => {
        if (!visitorBorrowCounts[card.visitorId]) {
            visitorBorrowCounts[card.visitorId] = 0;
        }
        visitorBorrowCounts[card.visitorId]++;
    });

    const sortedVisitors = visitors.map(visitor => ({
        name: visitor.name,
        totalBorrowed: visitorBorrowCounts[visitor.id] || 0
    })).sort((a, b) => b.totalBorrowed - a.totalBorrowed);

    return sortedVisitors.slice(0, 5); 
}

// En uzun süre ödünçte kalan kitapları hesapla
function calculateLongestBorrowedBooks(books, cards) {
    const bookBorrowDurations = {};

    cards.forEach(card => {
        const borrowDate = new Date(card.borrowDate);
        const returnDate = card.returnDate ? new Date(card.returnDate) : new Date();
        const durationInDays = Math.floor((returnDate - borrowDate) / (1000 * 60 * 60 * 24));

        if (!bookBorrowDurations[card.bookId]) {
            bookBorrowDurations[card.bookId] = 0;
        }

        if (durationInDays > bookBorrowDurations[card.bookId]) {
            bookBorrowDurations[card.bookId] = durationInDays;
        }
    });

    const sortedBooks = books.map(book => ({
        title: book.title,
        author: book.author,
        duration: bookBorrowDurations[book.id] || 0
    })).sort((a, b) => b.duration - a.duration);

    return sortedBooks.slice(0, 5); 
}

// En az ödünç alınan kitapları hesapla
function calculateLeastBorrowedBooks(books, cards) {
    const bookBorrowCounts = {};

    cards.forEach(card => {
        if (!bookBorrowCounts[card.bookId]) {
            bookBorrowCounts[card.bookId] = 0;
        }
        bookBorrowCounts[card.bookId]++;
    });

    const sortedBooks = books.map(book => ({
        title: book.title,
        author: book.author,
        borrowCount: bookBorrowCounts[book.id] || 0
    })).sort((a, b) => a.borrowCount - b.borrowCount);

    return sortedBooks.slice(0, 5); 
}

// Aylık ödünç alma istatistiklerini hesapla
function calculateMonthlyBorrowStats(cards) {
    const monthlyStats = {};

    cards.forEach(card => {
        const borrowDate = new Date(card.borrowDate);
        const monthYear = `${borrowDate.getFullYear()}-${String(borrowDate.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyStats[monthYear]) {
            monthlyStats[monthYear] = 0;
        }
        monthlyStats[monthYear]++;
    });

    const sortedStats = Object.keys(monthlyStats).map(month => ({
        month: month,
        borrowCount: monthlyStats[month]
    })).sort((a, b) => new Date(a.month) - new Date(b.month));

    return sortedStats;
}

// Tabloyu güncelle
function renderTable(data, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = data.map(item => {
        const row = Object.values(item).map(value => `<td>${value}</td>`).join('');
        return `<tr>${row}</tr>`;
    }).join('');
}