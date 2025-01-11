class IndexHandler {
    constructor() {
        this.indexContainer = document.getElementById('indexContainer');
        this.abbreviations = new Map();
        
        this.initializeEventListeners();
        this.initializeAbbreviations();
    }

    initializeEventListeners() {
        document.addEventListener('entriesUpdated', () => this.updateIndex());
        document.addEventListener('entriesRendered', () => this.updateIndex());
    }

    initializeAbbreviations() {
        // Initialize default category abbreviations
        this.abbreviations.set('Show Cause', 'SC');
        this.abbreviations.set('Interim', 'INT');
        this.abbreviations.set('Priority', 'PRI');
        
        // Add more abbreviations as needed
        this.abbreviations.set('High', 'H');
        this.abbreviations.set('Medium', 'M');
        this.abbreviations.set('Low', 'L');
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
        
        const toggle = document.createElement('span');
        toggle.className = 'index-toggle';
        toggle.textContent = '▶';
        
        const name = document.createElement('span');
        name.className = 'index-name';
        name.textContent = `${this.getAbbreviation(category)} (${entries.size})`;
        
        header.appendChild(toggle);
        header.appendChild(name);
        
        const content = document.createElement('div');
        content.className = 'index-content hidden';
        
        // Sort entries by ID
        Array.from(entries).sort().forEach(id => {
            const item = document.createElement('div');
            item.className = 'index-item';
            item.textContent = id;
            item.addEventListener('click', () => this.scrollToEntry(id));
            content.appendChild(item);
        });

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.textContent = content.classList.contains('hidden') ? '▼' : '▶';
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
            // Highlight the entry briefly
            entry.classList.add('highlight-entry');
            setTimeout(() => {
                entry.classList.remove('highlight-entry');
            }, 2000);
        }
    }

    updateIndex() {
        // Clear existing index
        this.indexContainer.innerHTML = '';
        
        // Create index header
        const indexHeader = document.createElement('div');
        indexHeader.className = 'index-title';
        indexHeader.textContent = 'Index';
        this.indexContainer.appendChild(indexHeader);
        
        // Create and append new index
        const indexStructure = this.createIndexStructure();
        
        if (indexStructure.size === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'index-empty';
            emptyMessage.textContent = 'No entries available';
            this.indexContainer.appendChild(emptyMessage);
            return;
        }
        
        // Sort categories alphabetically and create elements
        Array.from(indexStructure.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([category, entries]) => {
                const indexElement = this.createIndexElement(category, entries);
                this.indexContainer.appendChild(indexElement);
            });
    }
}

// Initialize index handler
const indexHandler = new IndexHandler();