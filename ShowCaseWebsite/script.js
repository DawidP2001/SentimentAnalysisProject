window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Remove active class from all links
                    navLinks.forEach((link) => link.classList.remove("active"));

                    // Add active class to the corresponding link
                    const activeLink = document.querySelector(
                        `.nav-link[data-section="${entry.target.id}"]`
                    );
                    activeLink.classList.add("active");
                }
            });
        },
        { threshold: 0.4 } // Trigger when 60% of the section is visible
    );

    sections.forEach((section) => observer.observe(section));
});
