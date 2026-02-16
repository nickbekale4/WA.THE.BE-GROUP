document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALISATION DES LIBRAIRIES (AOS) ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out-quart'
        });
    }

    // --- 2. COPYRIGHT DYNAMIQUE ---
    const year = new Date().getFullYear();
    const copyrightElem = document.getElementById('copyright');
    if (copyrightElem) {
        copyrightElem.innerHTML = `
            <span data-lang="fr">&copy; ${year} W.A.THE.BE GROUP. Tous droits réservés.</span>
            <span data-lang="en" style="display:none;">&copy; ${year} W.A.THE.BE GROUP. All rights reserved.</span>
        `;
    }

    // --- 3. GESTION DU LANGAGE (FR/EN) ---
    const langBtns = document.querySelectorAll('.lang-btn');
    
    function setLanguage(lang) {
        // A. Textes
        document.querySelectorAll('[data-lang]').forEach(element => {
            if (element.getAttribute('data-lang') === lang) {
                element.style.display = ''; 
            } else {
                element.style.display = 'none'; 
            }
        });
        // B. Boutons
        langBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `lang-${lang}`) btn.classList.add('active');
        });
        // C. Sauvegarde
        localStorage.setItem('preferredLang', lang);
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const chosenLang = btn.id.split('-')[1]; 
            setLanguage(chosenLang);
        });
    });

    const savedLang = localStorage.getItem('preferredLang') || 'fr';
    setLanguage(savedLang);


    // --- 4. GESTION DU MENU BURGER & NAVIGATION ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const navLinksAnchors = document.querySelectorAll('.nav-links a'); // Les liens cliquables

    function toggleMenu() {
        // Basculer le menu
        nav.classList.toggle('nav-active');
        // Animation Croix
        burger.classList.toggle('toggle');
        
        // Animation des liens
        navLinksItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Fermer le menu quand on clique sur un lien
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', () => {
            // Si le menu est ouvert (vérification via la classe), on le ferme
            if (nav.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    });


    // --- 5. GESTION DU HEADER AU SCROLL (Sticky Effect) ---
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });


    // --- 6. GESTION DU THÈME (Dark/Light) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    function setDarkMode(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        } else {
            body.classList.remove('dark-mode');
            if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        }
        if (typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 100); 
    }

    const savedTheme = localStorage.getItem('theme');
    const hour = new Date().getHours();

    if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
    } else {
        setDarkMode(hour >= 18 || hour < 7);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            setDarkMode(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }


    // --- 7. ANIMATION DES COMPTEURS (STATS) ---
    // NOUVEAU : Gestion du défilement des chiffres sur la page À Propos
    const statsSection = document.getElementById('stats-section');
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false; // Pour ne lancer l'animation qu'une seule fois

    if (statsSection && counters.length > 0) {
        const observerOptions = {
            root: null, // viewport
            threshold: 0.5 // Déclenche quand 50% de la section est visible
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    // Lancer le comptage
                    counters.forEach(counter => {
                        const updateCount = () => {
                            const target = +counter.getAttribute('data-target'); // Le chiffre final
                            const count = +counter.innerText; // Le chiffre actuel
                            
                            // Vitesse : On divise la distance restante
                            const increment = target / 50; 

                            if (count < target) {
                                counter.innerText = Math.ceil(count + increment);
                                setTimeout(updateCount, 30); // Vitesse de rafraîchissement
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                    
                    hasCounted = true; // On bloque pour ne pas relancer
                    observer.unobserve(statsSection); // On arrête d'observer
                }
            });
        }, observerOptions);

        statsObserver.observe(statsSection);
    }


    // --- 8. LANCEMENT FLUIDE ---
    document.body.classList.add('loaded');
});