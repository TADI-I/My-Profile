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
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to a server
            // For now, we'll just log it and show an alert
            console.log({ name, email, subject, message });
            
            alert(`Thank you, ${name}! Your message has been sent. I'll get back to you soon.`);
            
            // Reset the form
            contactForm.reset();
        });
    }
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

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-lang', project.language || 'Other');
    
    // Default image or placeholder
    const imageUrl = `https://via.placeholder.com/400x200/16213e/ffffff?text=${encodeURIComponent(project.name)}`;
    
    // Format description
    let description = project.description || 'No description provided.';
    if (description.length > 100) {
        description = description.substring(0, 100) + '...';
    }
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${imageUrl}" alt="${project.name}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="project-info">
            <h3>${project.name}</h3>
            <p>${description}</p>
            <div class="project-meta">
                <span class="project-lang">${project.language || 'Other'}</span>
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