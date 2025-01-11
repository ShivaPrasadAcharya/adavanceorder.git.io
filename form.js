class FormHandler {
    constructor() {
        this.form = document.getElementById('dataEntryForm');
        this.toggleButton = document.getElementById('toggleForm');
        this.cancelButton = document.getElementById('cancelForm');
        this.formContainer = document.getElementById('entryForm');
        this.codeInput = document.getElementById('code');
        this.copyButton = document.getElementById('copyCode');
        this.currentEditId = null;

        this.initializeEventListeners();
        this.initializeFormInputs();
    }

    initializeEventListeners() {
        // Form submit event
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Toggle form visibility
        this.toggleButton.addEventListener('click', () => this.toggleForm());
        this.cancelButton.addEventListener('click', () => this.hideForm());
        
        // Copy code button
        this.copyButton.addEventListener('click', () => this.copyCodeToClipboard());

        // Live code generation
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => this.generateCode());
            input.addEventListener('change', () => this.generateCode());
        });
    }

    initializeFormInputs() {
        this.inputs = {
            id: document.getElementById('id'),
            description: document.getElementById('description'),
            descriptionplus: document.getElementById('descriptionplus'),
            showCause: document.getElementById('showCause'),
            interim: document.getElementById('interim'),
            priority: document.getElementById('priority'),
            categoryplus: document.getElementById('categoryplus'),
            url: document.getElementById('url'),
            urlname: document.getElementById('urlname'),
            date: document.getElementById('date')
        };

        // Add date validation
        this.inputs.date.addEventListener('input', (e) => {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(e.target.value)) {
                e.target.setCustomValidity('Please use YYYY-MM-DD format');
            } else {
                e.target.setCustomValidity('');
            }
        });

        // Add ID validation
        this.inputs.id.addEventListener('input', (e) => {
            const idRegex = /^\d{4}$/;
            if (!idRegex.test(e.target.value)) {
                e.target.setCustomValidity('ID must be exactly 4 digits');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }

    toggleForm() {
        this.formContainer.classList.toggle('hidden');
        this.toggleButton.textContent = this.formContainer.classList.contains('hidden') 
            ? '+ Add New Entry' 
            : '- Close Form';
    }

    hideForm() {
        this.formContainer.classList.add('hidden');
        this.toggleButton.textContent = '+ Add New Entry';
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
        this.currentEditId = null;
        this.generateCode();
    }

    async copyCodeToClipboard() {
        try {
            await navigator.clipboard.writeText(this.codeInput.value);
            this.copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
            alert('Failed to copy code to clipboard');
        }
    }

    generateCode() {
        const entry = {
            i: this.inputs.id.value,
            d: this.inputs.description.value,
            dp: this.inputs.descriptionplus.value,
            c: {
                s: this.inputs.showCause.checked ? 1 : 0,
                i: this.inputs.interim.checked ? 1 : 0,
                p: this.inputs.priority.checked ? 1 : 0
            },
            cp: this.inputs.categoryplus.value,
            u: this.inputs.url.value,
            un: this.inputs.urlname.value,
            dt: this.inputs.date.value
        };

        // Remove empty optional fields
        if (!entry.dp) delete entry.dp;
        if (!entry.cp) delete entry.cp;
        if (!entry.u) delete entry.u;
        if (!entry.un) delete entry.un;

        this.codeInput.value = JSON.stringify(entry, null, 2);
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate required fields
        if (!this.form.checkValidity()) {
            return;
        }

        // Get current entries
        const entries = JSON.parse(localStorage.getItem('entrySystem')) || [];

        // Check for duplicate ID if not editing
        if (!this.currentEditId) {
            const isDuplicate = entries.some(entry => entry.i === this.inputs.id.value);
            if (isDuplicate) {
                alert('This ID already exists. Please use a different ID.');
                return;
            }
        }

        const newEntry = {
            i: this.inputs.id.value,
            d: this.inputs.description.value,
            dp: this.inputs.descriptionplus.value,
            c: {
                s: this.inputs.showCause.checked ? 1 : 0,
                i: this.inputs.interim.checked ? 1 : 0,
                p: this.inputs.priority.checked ? 1 : 0
            },
            cp: this.inputs.categoryplus.value,
            u: this.inputs.url.value,
            un: this.inputs.urlname.value,
            dt: this.inputs.date.value
        };

        if (this.currentEditId) {
            // Update existing entry
            const index = entries.findIndex(entry => entry.i === this.currentEditId);
            if (index !== -1) {
                entries[index] = newEntry;
            }
        } else {
            // Add new entry at the beginning
            entries.unshift(newEntry);
            // Keep only the latest 7 entries
            while (entries.length > 7) {
                entries.pop();
            }
        }

        // Save to localStorage
        localStorage.setItem('entrySystem', JSON.stringify(entries));

        // Update UI
        document.dispatchEvent(new CustomEvent('entriesUpdated'));
        
        // Reset and hide form
        this.hideForm();
    }

    editEntry(entry) {
        this.currentEditId = entry.i;
        
        // Fill form fields
        this.inputs.id.value = entry.i;
        this.inputs.description.value = entry.d;
        this.inputs.descriptionplus.value = entry.dp || '';
        this.inputs.showCause.checked = entry.c.s === 1;
        this.inputs.interim.checked = entry.c.i === 1;
        this.inputs.priority.checked = entry.c.p === 1;
        this.inputs.categoryplus.value = entry.cp || '';
        this.inputs.url.value = entry.u || '';
        this.inputs.urlname.value = entry.un || '';
        this.inputs.date.value = entry.dt;

        // Generate code
        this.generateCode();

        // Show form
        this.formContainer.classList.remove('hidden');
        this.toggleButton.textContent = '- Close Form';
        
        // Scroll to form
        this.formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize form handler
const formHandler = new FormHandler();