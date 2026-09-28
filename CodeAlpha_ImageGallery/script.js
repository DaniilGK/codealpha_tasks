/* Lightbox */
const lightbox = document.querySelector(".lightbox");
const lightboxSlides = document.querySelectorAll(".lightbox-slide");
const allImages = Array.from(document.querySelectorAll(".image"));
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxClose = document.querySelector(".lightbox-close");

let currentIndex = 0;
let currentFilter = "all";

 function openLightbox() {
    const clickedImage = event.target;
    currentIndex = allImages.indexOf(clickedImage);
    showSlide(currentIndex);
    lightbox.style.display = "flex";
    lightbox.style.justifyContent = "center";
    lightbox.style.alignItems = "center";   
    document.body.style.overflow = "hidden";
 };
 
 function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
 }

/* Click outside lightbox */
 lightbox.addEventListener("click", (e) => {
    if(e.target === lightbox) {
        closeLightbox();
    }
 });

 function showSlide(index) {
    lightboxSlides.forEach(e => {
        e.style.display = "none"
    });

    lightboxSlides[index].style.display = "flex";
 }

 function getFilteredIndexes() {
    return allImages.map((img, i) => i).filter(i => currentFilter === "all" || img_category(i) === currentFilter);
 }

/* Get image category */
 function img_category(i) {
    return allImages[i].closest(".category").dataset.category;
 }

 function plusSlides(direction) {
    const list = getFilteredIndexes();
    const posInList = list.indexOf(currentIndex);
    const newPos = (posInList + direction + list.length) % list.length;
    currentIndex = list[newPos];
    showSlide(currentIndex);
 }

 lightboxClose.addEventListener("click", closeLightbox);
 lightboxPrev.addEventListener("click", () => plusSlides(-1));
 lightboxNext.addEventListener("click", () => plusSlides(1));

/* Keyboard navigation */
 document.addEventListener("keydown", (e) => {
    if (lightbox.style.display !== "flex") return; 

    if (e.key === "Escape") {
        flashActive(lightboxClose);
        closeLightbox();
    } else if (e.key === "ArrowLeft") {
        flashActive(lightboxPrev);
        plusSlides(-1);
    } else if (e.key === "ArrowRight") {
        flashActive(lightboxNext);
        plusSlides(1);
    }
 });
/* Flash active key */
 function flashActive(button) {
    button.classList.add("active-key");
    setTimeout(() => {
        button.classList.remove("active-key");
    }, 150);
 }

 /* Swipe navigation */
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchEndX - touchStartX;
    const threshold = 50;

    if (Math.abs(diff) < threshold) return;

    if (diff < 0) {
        flashActive(lightboxNext);
        plusSlides(1);
    } else {
        flashActive(lightboxPrev);
        plusSlides(-1);
    }
}

/* Filtering */
const navLinks = document.querySelectorAll(".navigation-list a, .footer-navigation-list a");
const categories = document.querySelectorAll(".category");

function applyFilter(filter) {

    currentFilter = filter;

    navLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.filter === filter);
    });

    document.querySelector(".grid-gallery").classList.toggle("single-view", filter !== "all");

    categories.forEach(cat => {
        const show = (filter === "all") || (cat.dataset.category === filter);

        if(show) {  
            cat.style.display = "flex";
            requestAnimationFrame(() => { cat.classList.remove("hidden")});
        } else {
            cat.classList.add("hidden");
            setTimeout(() => {
                if(cat.classList.contains("hidden")) {
                    cat.style.display = "none";
                }
            }, 300)
        }
    });

    window.scrollTo({top: 0, behavior: "smooth"});

}

navLinks.forEach(link => {
    link.addEventListener("click", (e)=> {
        e.preventDefault();
        applyFilter(link.dataset.filter);
    });
})