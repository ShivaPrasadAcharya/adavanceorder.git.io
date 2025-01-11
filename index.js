class IndexHandler {
    constructor() {
        this.indexContainer = document.getElementById('indexContainer');
        this.abbreviations = new Map();
        
        this.initializeEventListeners();
        this.initializeAbbreviations();
    }

    initializeEventListeners() {
        document.addEventListener('entriesUpdated', () => this.updateIndex());
    }

    initializeAbbreviations() {
        // Initialize default category abbreviations
        this.abbreviations.set('Show Cause', 'SC');
        this.abbreviations.set('Interim', 'INT');
        this.abbreviations.set('Priority', 'PRI');
        
        // These can be expanded based on actual categories in use
    }

    getAbbreviation(term) {
        return this.abbreviations.get(term) || term;
    }

    createIndexStructure() {
        const entries = JSON.parse(localStorage.getItem('entrySystem')) || [];
        const indexStructure = new Map();

        entries.forEach(entry => {
            // Add category indices
            if (entry.c) {
                if (entry.c.s) this.addToStructure(indexStructure, 'Show Cause', entry);
                if (entry.c.i) this.addToStructure(indexStructure, 'Interim', entry);
                if (entry.c.p) this.addToStructure(indexStructure, 'Priority', entry);
            }

            // Add categoryplus indices
            if (entry.cp) {
                this.addToStructure(indexStructure, entry.cp, entry);
            }
        });

        return indexStructure;
    }

    addToStructure(structure, category, entry) {
        if (!structure.has(category)) {
            structure.set(category, new Set());
        }
        structure.get(category).add(entry.i);
    }

    createIndexElement(category, entries) {
        const container = document.createElement('div');
        container.className = 'index-category';
        
        const header = document.createElement('div');
        header.className = 'index-header';
        header.innerHTML = `
            <span class="index-toggle">▶</span>
            <span class="index-name">${this.getAbbreviation(category)} (${entries.size})</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'index-content hidden';
        
        Array.from(entries).sort().forEach(id => {
            const item = document.createElement('div');
            item.className = 'index-item';
            item.textContent = id;
            item.addEventListener('click', () => this.scrollToEntry(id));
            content.appendChild(item);
        });

        header.addEventListener('click', () => {
            header.querySelector('.index-toggle').textContent = 
                content.classList.contains('hidden') ? '▼' : '▶';
            content.classList.toggle('hidden');
        });

        container.appendChild(header);
        container.appendChild(content);
        return container;
    }

    scrollToEntry(id) {
        const entry = document.querySelector(`.entry[data-id="${id}"]`);
        if (entry) {
            entry.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateIndex() {
        // Clear existing index
        this.indexContainer.innerHTML = '';
        
        // Create and append new index
        const indexStructure = this.createIndexStructure();
        
        indexStructure.forEach((entries, category) => {
            const indexElement = this.createIndexElement(category, entries);
            this.indexContainer.appendChild(indexElement);
        });
    }
}

// Initialize index handler
const indexHandler = new IndexHandler();