document.addEventListener("DOMContentLoaded", function () {
    const girisButton = document.querySelector("button"); 
    const loadingScreen = document.getElementById("loading-screen"); 
    const loadingText = document.getElementById("loading-text"); 

   
    girisButton.addEventListener("click", function () {
       
        loadingScreen.style.display = "flex";

       
        setTimeout(() => {
            loadingText.textContent = "Kullanıcılar yükleniyor...";
        }, 2000);

      
        setTimeout(() => {
            window.location.href = "books.html"; 
        }, 5000);
    });
});