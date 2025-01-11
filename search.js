class SearchHandler {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.prevButton = document.getElementById('prevMatch');
        this.nextButton = document.getElementById('nextMatch');
        this.matchCountDisplay = document.getElementById('matchCount');
        
        this.currentMatchIndex = -1;
        this.matches = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.prevButton.addEventListener('click', () => this.navigateMatches('prev'));
        this.nextButton.addEventListener('click', () => this.navigateMatches('next'));
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        this.clearHighlights();
        
        if (searchTerm.length < 2) {
            this.updateMatchCount(0);
            this.matches = [];
            this.currentMatchIndex = -1;
            this.updateNavigationButtons();
            return;
        }

        const entries = document.querySelectorAll('.entry');
        this.matches = [];

        entries.forEach(entry => {
            const text = entry.textContent.toLowerCase();
            const content = entry.querySelector('.entry-content');
            
            if (text.includes(searchTerm)) {
                // Highlight matches in the content
                const regex = new RegExp(searchTerm, 'gi');
                content.innerHTML = content.textContent.replace(
                    regex,
                    match => `<span class="highlight">${match}</span>`
                );
                
                // Store match references
                const highlights = content.querySelectorAll('.highlight');
                highlights.forEach(highlight => {
                    this.matches.push(highlight);
                });
            }
        });

        this.updateMatchCount(this.matches.length);
        this.currentMatchIndex = this.matches.length > 0 ? 0 : -1;
        this.updateNavigationButtons();
        this.scrollToCurrentMatch();
    }

    clearHighlights() {
        document.querySelectorAll('.highlight').forEach(element => {
            const parent = element.parentNode;
            parent.replaceChild(document.createTextNode(element.textContent), element);
        });
    }

    updateMatchCount(count) {
        this.matchCountDisplay.textContent = `${count} match${count !== 1 ? 'es' : ''}`;
    }

    navigateMatches(direction) {
        if (this.matches.length === 0) return;

        if (direction === 'next') {
            this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
        } else {
            this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length;
        }

        this.scrollToCurrentMatch();
        this.updateNavigationButtons();
    }

    scrollToCurrentMatch() {
        if (this.currentMatchIndex >= 0 && this.matches[this.currentMatchIndex]) {
            this.matches.forEach(match => match.classList.remove('current'));
            const currentMatch = this.matches[this.currentMatchIndex];
            currentMatch.classList.add('current');
            currentMatch.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    updateNavigationButtons() {
        const hasMatches = this.matches.length > 0;
        this.prevButton.disabled = !hasMatches;
        this.nextButton.disabled = !hasMatches;
    }
}

// Initialize search handler
const searchHandler = new SearchHandler();