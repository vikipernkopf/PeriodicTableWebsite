document.addEventListener("DOMContentLoaded", function() {
    let navbar = document.querySelector(".navbar");

    if (navbar) {
        let navbarHeight = navbar.offsetHeight;
        document.body.style.paddingTop = navbarHeight + "px";
    }
});