document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Fetch GitHub projects
    fetchGitHubProjects();
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
});
    
    
    // Contact form handling
    document.getElementById('contactForm').addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent actual form submission

            // Get input values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim() || "Message from website";
            const message = document.getElementById('message').value.trim();

            // Construct body with user input
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;

            // Create mailto link
            const mailtoLink = `mailto:tadiwasongore@gmail.com.com?subject=${encodeURIComponent(subject)}&body=${body}`;

            // Trigger mailto
            window.location.href = mailtoLink;
        });

    async function fetchGitHubProjects() {
        const username = 'TADI-I';
        const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`;
        const projectsContainer = document.getElementById('projects-container');
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const projects = await response.json();
            
            if (projects.length === 0) {
                projectsContainer.innerHTML = '<p>No projects found on GitHub.</p>';
                return;
            }
            
            projectsContainer.innerHTML = '';
            
            projects.forEach(project => {
                if (!project.fork) { // Exclude forked repositories
                    const projectCard = createProjectCard(project);
                    projectsContainer.appendChild(projectCard);
                }
            });
            
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        }
    }

    const languageIcons = {
        JavaScript: "devicon-javascript-plain colored",
        Python: "devicon-python-plain colored",
        Java: "devicon-java-plain colored",
        HTML: "devicon-html5-plain colored",
        CSS: "devicon-css3-plain colored",
        TypeScript: "devicon-typescript-plain colored",
        C: "devicon-c-plain colored",
        "C++": "devicon-cplusplus-plain colored",
        "C#": "devicon-csharp-plain colored",
        PHP: "devicon-php-plain colored",
        Ruby: "devicon-ruby-plain colored",
        Go: "devicon-go-plain colored",
        Swift: "devicon-swift-plain colored",
        Kotlin: "devicon-kotlin-plain colored",
        Shell: "devicon-bash-plain colored",
        Other: "devicon-code-plain"
    };

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';

        const lang = project.language || 'Other';
        const iconClass = languageIcons[lang] || languageIcons["Other"];
        
        // Format description
        let description = project.description || 'No description provided.';
        if (description.length > 200) {
            description = description.substring(0, 200) + '...';
        }

        card.innerHTML = `
            <div class="project-icon" style="text-align:center; font-size: 64px; padding: 20px;">
                <i class="${iconClass}"></i>
            </div>
            <div class="project-info">
                <h3>${project.name}</h3>
                <p>${description}</p>
                <div class="project-meta">
                    <span class="project-lang">${lang}</span>
                    <span>⭐ ${project.stargazers_count}</span>
                </div>
                <div class="project-links">
                    <a href="${project.html_url}" target="_blank">View Code</a>
                    ${project.homepage ? `<a href="${project.homepage}" target="_blank">Live Demo</a>` : ''}
                </div>
            </div>
        `;

        return card;
    }


    function filterProjects(filter) {
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach(project => {
            if (filter === 'all' || project.getAttribute('data-lang').toLowerCase().includes(filter.toLowerCase())) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
    }

