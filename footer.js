class FooterHandler {
    constructor() {
        this.footerText = 'Shiva Prasad Acharya (2081)';
        document.addEventListener('entriesUpdated', () => this.addFootersToEntries());
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'entry-footer';
        footer.textContent = this.footerText;
        return footer;
    }

    addFootersToEntries() {
        const entries = document.querySelectorAll('.entry');
        entries.forEach(entry => {
            // Remove existing footer if any
            const existingFooter = entry.querySelector('.entry-footer');
            if (existingFooter) {
                existingFooter.remove();
            }
            
            // Add new footer
            entry.appendChild(this.createFooter());
        });
    }
}

// Initialize footer handler
const footerHandler = new FooterHandler();