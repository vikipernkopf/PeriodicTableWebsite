document.addEventListener("DOMContentLoaded", function() {
    let navbar = document.querySelector(".navbar");

    if (navbar) {
        let navbarHeight = navbar.offsetHeight;
        document.body.style.paddingTop = navbarHeight + "px";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const loginNavItem = document.querySelector(".log-in-nav-item");

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

                const isIndexPage = window.location.pathname.endsWith('index.html') ||
                    window.location.pathname.endsWith('/');

                window.location.href = isIndexPage ? "html/login.html" : "login.html";
            });
        }
    }
});