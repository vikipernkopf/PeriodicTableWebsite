document.addEventListener("DOMContentLoaded", function() {
    let navbar = document.querySelector(".navbar");

    if (navbar) {
        let navbarHeight = navbar.offsetHeight;
        document.body.style.paddingTop = navbarHeight + "px";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const loginNavItem = document.querySelector(".nav-link[href='login.html']");

    if (navbar && loginNavItem) {
        const username = localStorage.getItem("username");

        if (username) {
            loginNavItem.textContent = "Log out";
            loginNavItem.href = "#";

            loginNavItem.addEventListener("click", function () {
                localStorage.removeItem("username");
                window.location.reload();
            });
        } else {
            // Redirect to login.html and store the current page URL
            loginNavItem.addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.setItem("redirectAfterLogin", window.location.href);
                window.location.href = "login.html";
            });
        }
    }
});