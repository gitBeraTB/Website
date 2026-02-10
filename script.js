document.addEventListener('DOMContentLoaded', () => {

    // --- Typing Effect ---
    const textElement = document.querySelector('.dynamic-text');
    const words = ["Websites", "UI/UX Designs", "Mobile Apps", "Solutions"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect
    if (textElement) type();


    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate using querySelectorAll
    const hiddenElements = document.querySelectorAll('.hero-content, .section-title, .about-img-wrapper, .about-text, .project-card, .contact-wrapper');
    hiddenElements.forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });


    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.querySelector('i').classList.toggle('fa-times');
            hamburger.querySelector('i').classList.toggle('fa-bars');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- GitHub Projects Fetcher ---
    const projectsContainer = document.getElementById('projects-container');
    const username = 'gitBeraTB';

    async function fetchProjects() {
        try {
            // Defined 'pinned' projects manually since the API is unstable
            const pinnedRepoNames = [
                'RISCV-Safety-BIST-IP',
                'Sparse-V-Accelerator',
                'Async-FIFO-Formal-Verification',
                'Non-Stationary-Electron-Transport-Simulation'
            ];

            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`);

            if (response.ok) {
                const allRepos = await response.json();
                // Filter repos to match the pinned list
                const projects = allRepos.filter(repo => pinnedRepoNames.includes(repo.name));

                // Sort them to match the order in pinnedRepoNames
                projects.sort((a, b) => pinnedRepoNames.indexOf(a.name) - pinnedRepoNames.indexOf(b.name));

                if (projects.length > 0) {
                    renderProjects(projects);
                } else {
                    // Fallback to top 4 latest if filtering fails
                    renderProjects(allRepos.slice(0, 4));
                }
            } else {
                if (projectsContainer) projectsContainer.innerHTML = '<p style="text-align:center; color:#fff;">Failed to load projects from GitHub.</p>';
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            if (projectsContainer) projectsContainer.innerHTML = '<p style="text-align:center; color:#fff;">Failed to load projects.</p>';
        }
    }

    function renderProjects(projects) {
        if (!projectsContainer) return;
        projectsContainer.innerHTML = '';

        projects.forEach((project, index) => {
            const name = project.repo || project.name;
            const desc = project.description || 'No description available.';
            const url = project.link || project.html_url;
            const language = project.language || 'Code';

            const gradient = generateGradient(name);

            const card = document.createElement('div');
            card.className = 'project-card glass-card hidden';
            card.style.transitionDelay = `${index * 100}ms`;

            card.innerHTML = `
                <div class="project-img" style="background: ${gradient}">
                     <i class="fas fa-code" style="font-size: 3rem; color: rgba(255,255,255,0.4);"></i>
                </div>
                <div class="project-info">
                    <h3>${name}</h3>
                    <p>${desc && desc.length > 80 ? desc.substring(0, 80) + '...' : desc}</p>
                    <div class="tags">
                        <span>${language}</span>
                    </div>
                    <a href="${url}" target="_blank" class="btn-sm">View Project <i class="fas fa-external-link-alt"></i></a>
                </div>
            `;

            projectsContainer.appendChild(card);
            observer.observe(card);
        });
    }

    function generateGradient(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h1 = Math.abs(hash % 360);
        const h2 = (h1 + 40) % 360;
        return `linear-gradient(135deg, hsl(${h1}, 70%, 20%), hsl(${h2}, 70%, 30%))`;
    }

    fetchProjects();

});
