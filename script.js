class EntrySystem {
    constructor() {
        this.entriesContainer = document.getElementById('entriesContainer');
        this.initializeEventListeners();
        this.renderEntries();
    }

    initializeEventListeners() {
        document.addEventListener('entriesUpdated', () => this.renderEntries());
    }

    renderEntries() {
        const entries = JSON.parse(localStorage.getItem('entrySystem')) || [];
        this.entriesContainer.innerHTML = '';

        entries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            this.entriesContainer.appendChild(entryElement);
        });

        // Trigger other components to update
        document.dispatchEvent(new CustomEvent('entriesRendered'));
    }

    createEntryElement(entry) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        entryDiv.dataset.id = entry.i;
        entryDiv.dataset.categories = JSON.stringify(entry.c);
        entryDiv.dataset.categoryplus = entry.cp || '';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'entry-header';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'entry-title';
        titleDiv.innerHTML = `<strong>#${entry.i}</strong>`;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'entry-actions';
        
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => formHandler.editEntry(entry));

        const pdfButton = document.createElement('button');
        pdfButton.innerHTML = '<i class="fas fa-file-pdf"></i>';
        pdfButton.addEventListener('click', () => pdfHandler.generatePDF(entryDiv));

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(pdfButton);

        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(actionsDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'entry-content';
        
        // Build content HTML
        let contentHtml = `<p>${entry.d}</p>`;
        if (entry.dp) contentHtml += `<p>${entry.dp}</p>`;
        
        // Add categories
        const categories = [];
        if (entry.c.s) categories.push('SC');
        if (entry.c.i) categories.push('INT');
        if (entry.c.p) categories.push('PRI');
        
        if (categories.length > 0) {
            contentHtml += `<p><strong>Categories:</strong> ${categories.join(', ')}</p>`;
        }
        
        if (entry.cp) {
            contentHtml += `<p><strong>Category+:</strong> ${entry.cp}</p>`;
        }
        
        if (entry.u) {
            contentHtml += `<p><strong>URL:</strong> <a href="${entry.u}" target="_blank">${entry.un || entry.u}</a></p>`;
        }
        
        contentHtml += `<p><strong>Date:</strong> ${entry.dt}</p>`;
        
        contentDiv.innerHTML = contentHtml;

        entryDiv.appendChild(headerDiv);
        entryDiv.appendChild(contentDiv);

        return entryDiv;
    }
}

// Initialize the entire system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EntrySystem();
});