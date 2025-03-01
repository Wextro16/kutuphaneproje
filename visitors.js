document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.visitors-table tbody');
    const searchInput = document.getElementById('searchInput');
    const sortBy = document.getElementById('sortBy');
    const newVisitorModal = document.getElementById('newVisitorModal');
    const editModal = document.getElementById('editModal');
    const addVisitorForm = document.getElementById('addVisitorForm');
    const editVisitorForm = document.getElementById('editVisitorForm');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const controls = document.querySelector('.controls');

    let currentVisitorId = null; 

    
    const searchContainer = document.createElement('div');
    searchContainer.style.marginLeft = 'auto'; 
    searchContainer.appendChild(searchInput);
    controls.appendChild(searchContainer);

    
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];

    // Sayfa yüklendiğinde güncelle
    renderTable(visitors);

    // Telefon numarası kontrol
    const phoneInput = document.getElementById('visitorPhone');
    const editPhoneInput = document.getElementById('editPhone');

    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9\s-]/g, ''); //  rakam, boşluk ve tire
    });

    editPhoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9\s-]/g, ''); //  rakam, boşluk ve tire
    });

    // Yeni Ziyaretçi Ekleme Formu
    addVisitorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('visitorName').value.trim();
        const phone = document.getElementById('visitorPhone').value.trim();

        if (name && phone) {
           
            const normalizedPhone = phone.replace(/[\s-]/g, '');

           
            if (normalizedPhone.length !== 11) {
                showToast('Telefon numarası 11 haneli olmalıdır!', 'error'); 
                return;
            }

          
            if (isPhoneUnique(normalizedPhone)) {
                const newVisitor = {
                    id: visitors.length + 1,
                    name,
                    phone: normalizedPhone 
                };

                visitors.push(newVisitor);
                localStorage.setItem('visitors', JSON.stringify(visitors)); 
                renderTable(visitors);
                closeModal(); 
                addVisitorForm.reset(); 
                showToast('Ziyaretçi başarıyla eklendi!', 'success'); 
            } else {
                showToast('Bu telefon numarası zaten kayıtlı!', 'error'); 
            }
        } else {
            showToast('Lütfen tüm alanları doldurun!', 'error'); 
        }
    });

    // Tabloyu güncelleme
    function renderTable(data) {
        tableBody.innerHTML = data.map(visitor => `
            <tr data-id="${visitor.id}">
                <td>${visitor.id}</td>
                <td>${visitor.name}</td>
                <td>${formatPhoneNumber(visitor.phone)}</td> 
                <td>
                    <button class="edit-btn" onclick="openEditModal(${visitor.id})">
                        <i class="fas fa-pencil-alt"></i> 
                    </button>
                </td>
            </tr>
        `).join('');
    }

    
    function formatPhoneNumber(phone) {
        return phone.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4');
    }

    // Arama İşlemi
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredVisitors = visitors.filter(visitor =>
            visitor.name.toLowerCase().includes(searchTerm) ||
            visitor.phone.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredVisitors);
    });

    // Sıralama İşlemi
    sortBy.addEventListener('change', () => {
        const sortKey = sortBy.value;
        const sortedVisitors = visitors.sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return -1;
            if (a[sortKey] > b[sortKey]) return 1;
            return 0;
        });
        renderTable(sortedVisitors);
    });

  
    window.openNewVisitorModal = () => {
        newVisitorModal.style.display = 'block'; 
    };

   
    window.openEditModal = (id) => {
        const visitor = visitors.find(v => v.id === id);
        if (visitor) {
            currentVisitorId = id; 
            document.getElementById('editName').value = visitor.name;
            document.getElementById('editPhone').value = formatPhoneNumber(visitor.phone);
            editModal.style.display = 'block'; 
        }
    };

    // kapatma
    window.closeModal = () => {
        newVisitorModal.style.display = 'none'; 
        editModal.style.display = 'none'; 
    };

  
    window.addEventListener('click', (e) => {
        if (e.target === newVisitorModal || e.target === editModal) {
            closeModal(); 
        }
    });

    // Ziyaretçi Düzenleme 
    editVisitorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('editName').value.trim();
        const newPhone = document.getElementById('editPhone').value.trim();

        if (newName && newPhone) {
           
            const normalizedPhone = newPhone.replace(/[\s-]/g, '');

           
            if (normalizedPhone.length !== 11) {
                showToast('Telefon numarası 11 haneli olmalıdır!', 'error'); 
                return;
            }

            //telefon no sunun benzeri varmı diye bak
            if (isPhoneUnique(normalizedPhone, currentVisitorId)) {
                const visitor = visitors.find(v => v.id === currentVisitorId);
                if (visitor) {
                    visitor.name = newName;
                    visitor.phone = normalizedPhone; 
                    localStorage.setItem('visitors', JSON.stringify(visitors)); 
                    renderTable(visitors); 
                    closeModal(); 
                    showToast('Ziyaretçi başarıyla güncellendi!', 'success'); 
                }
            } else {
                showToast('Bu telefon numarası zaten kayıtlı!', 'error'); 
            }
        } else {
            showToast('Lütfen tüm alanları doldurun!', 'error'); 
        }
    });

    // Telefon nosunun benzeri avrmı diye bakma
    function isPhoneUnique(phone, currentId = null) {
        return !visitors.some(visitor => visitor.phone === phone && visitor.id !== currentId);
    }

    //bildirim mesajı
    function showToast(message, type = 'info') {
        toastMessage.textContent = message; 
        toast.className = 'toast'; 
        toast.classList.add('show', type); 
        setTimeout(() => {
            toast.classList.remove('show'); 
        }, 3000); 
    }
});