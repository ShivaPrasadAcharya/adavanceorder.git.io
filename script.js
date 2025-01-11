class EntrySystem {
    constructor() {
        this.entriesContainer = document.getElementById('entriesContainer');
        this.initializeEventListeners();
        this.renderEntries();
    }

    initializeEventListeners() {
        document.addEventListener('entriesUpdated', () => {
            this.renderEntries();
            // Trigger index and filter updates
            document.dispatchEvent(new CustomEvent('entriesRendered'));
        });
    }

    renderEntries() {
        const entries = JSON.parse(localStorage.getItem('entrySystem')) || [];
        this.entriesContainer.innerHTML = '';

        if (entries.length === 0) {
            this.entriesContainer.innerHTML = `
                <div class="entry">
                    <p>No entries available. Click the "Add New Entry" button to create one.</p>
                </div>
            `;
            return;
        }

        entries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            this.entriesContainer.appendChild(entryElement);
        });
    }

    createEntryElement(entry) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        entryDiv.dataset.id = entry.i;
        entryDiv.dataset.categories = JSON.stringify(entry.c);
        entryDiv.dataset.categoryplus = entry.cp || '';

        // Create header with ID and actions
        const headerDiv = document.createElement('div');
        headerDiv.className = 'entry-header';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'entry-title';
        titleDiv.innerHTML = `<strong>#${entry.i}</strong>`;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'entry-actions';
        
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editButton.addEventListener('click', () => formHandler.editEntry(entry));

        const pdfButton = document.createElement('button');
        pdfButton.innerHTML = '<i class="fas fa-file-pdf"></i> PDF';
        pdfButton.addEventListener('click', () => pdfHandler.generatePDF(entryDiv));

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(pdfButton);

        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(actionsDiv);

        // Create content section
        const contentDiv = document.createElement('div');
        contentDiv.className = 'entry-content';
        
        // Build content HTML
        let contentHtml = `<p class="description"><strong>Description:</strong> ${entry.d}</p>`;
        
        if (entry.dp) {
            contentHtml += `<p class="description-plus"><strong>Additional Description:</strong> ${entry.dp}</p>`;
        }
        
        // Add categories with abbreviations
        const categories = [];
        if (entry.c.s) categories.push('SC');
        if (entry.c.i) categories.push('INT');
        if (entry.c.p) categories.push('PRI');
        
        if (categories.length > 0) {
            contentHtml += `<p class="categories"><strong>Categories:</strong> ${categories.join(', ')}</p>`;
        }
        
        if (entry.cp) {
            contentHtml += `<p class="category-plus"><strong>Category+:</strong> ${entry.cp}</p>`;
        }
        
        if (entry.u) {
            contentHtml += `
                <p class="url"><strong>URL:</strong> 
                    <a href="${entry.u}" target="_blank">${entry.un || entry.u}</a>
                </p>
            `;
        }
        
        contentHtml += `<p class="date"><strong>Date:</strong> ${entry.dt}</p>`;
        
        contentDiv.innerHTML = contentHtml;

        // Add components to entry
        entryDiv.appendChild(headerDiv);
        entryDiv.appendChild(contentDiv);

        // Add footer (will be populated by FooterHandler)
        const footerDiv = document.createElement('div');
        footerDiv.className = 'entry-footer';
        entryDiv.appendChild(footerDiv);

        return entryDiv;
    }
}

// Initialize the entire system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EntrySystem();
});