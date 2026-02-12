document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Fetch Publications
    fetchPublications();
});

async function fetchPublications() {
    const listContainer = document.getElementById('publication-list');
    const jsonPath = 'data/publications.json'; // Path to the static JSON file

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const publications = await response.json();
        renderPublications(publications, listContainer);
    } catch (error) {
        console.error('Error fetching publications:', error);
        listContainer.innerHTML = '<p>Unable to load publications at this time.</p>';
    }
}

function renderPublications(publications, container) {
    container.innerHTML = ''; // Clear loading spinner

    if (publications.length === 0) {
        container.innerHTML = '<p>No publications found.</p>';
        return;
    }

    publications.forEach(pub => {
        const pubItem = document.createElement('div');
        pubItem.classList.add('publication-item');

        const title = pub.title || 'Untitled';
        const authors = highlightAuthor(pub.authors || 'Unknown Authors', 'Eduard Nedelciu'); // Replace with your actual name format
        const venue = pub.venue || '';
        const year = pub.year || '';
        const link = pub.link || '#';

        pubItem.innerHTML = `
            <div class="pub-title">${title}</div>
            <div class="pub-authors">${authors}</div>
            <div class="pub-venue">${venue} ${year ? `(${year})` : ''}</div>
            ${link && link !== '#' ? `
            <div class="pub-links">
                <a href="${link}" target="_blank" class="pub-link">View Paper <i class="fas fa-external-link-alt"></i></a>
            </div>` : ''}
        `;

        container.appendChild(pubItem);
    });
}

function highlightAuthor(authorsStr, myName) {
    // Simple string replace to wrap myName in a span
    // Case insensitive/flexible matching could be added if needed
    if (!authorsStr) return '';
    
    // Normalize logic can be added here if needed. 
    // Assuming simple string matching for now.
    // We try to match "Eduard Nedelciu" or "E. Nedelciu" or similar if known.
    // For now, exact match on the provided name argument.
    
    const regex = new RegExp(`(${myName})`, 'gi');
    return authorsStr.replace(regex, '<span class="highlight-author">$1</span>');
}
