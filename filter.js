class FilterHandler {
    constructor() {
        this.categoryFilter = document.getElementById('categoryFilter');
        this.categoryplusFilter = document.getElementById('categoryplusFilter');
        
        this.selectedCategory = 'All';
        this.selectedCategoryPlus = 'All';
        
        this.initializeFilters();
        this.initializeEventListeners();
    }

    initializeFilters() {
        // Create dropdown containers
        this.createFilterDropdown(this.categoryFilter, 'Category');
        this.createFilterDropdown(this.categoryplusFilter, 'Category+');
        
        // Initialize filters
        const categoryTypes = ['All', 'Show Cause', 'Interim', 'Priority'];
        this.populateFilterDropdown(this.categoryFilter, categoryTypes, 'category');
        this.updateCategoryPlusFilter();
    }

    createFilterDropdown(container, label) {
        container.innerHTML = `
            <div class="filter-dropdown">
                <button class="dropdown-btn">${label} ▼</button>
                <div class="dropdown-content">
                    <!-- Checkboxes will be inserted here -->
                </div>
            </div>
        `;

        const dropdownBtn = container.querySelector('.dropdown-btn');
        const dropdownContent = container.querySelector('.dropdown-content');

        // Toggle dropdown
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdownContent.classList.remove('show');
        });
    }

    populateFilterDropdown(container, options, type) {
        const dropdownContent = container.querySelector('.dropdown-content');
        dropdownContent.innerHTML = ''; // Clear existing content

        options.forEach(option => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.checked = option === 'All';
            
            checkbox.addEventListener('change', (e) => {
                if (type === 'category') {
                    this.handleCategoryChange(e, dropdownContent);
                } else {
                    this.handleCategoryPlusChange(e, dropdownContent);
                }
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(option));
            dropdownContent.appendChild(label);
        });
    }

    initializeEventListeners() {
        document.addEventListener('entriesUpdated', () => {
            this.updateCategoryPlusFilter();
            this.applyFilters();
        });
    }

    handleCategoryChange(e, dropdownContent) {
        const checkbox = e.target;
        
        if (checkbox.value === 'All') {
            if (checkbox.checked) {
                dropdownContent.querySelectorAll('input').forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            }
        } else {
            const allCheckbox = dropdownContent.querySelector('input[value="All"]');
            allCheckbox.checked = false;
        }

        this.updateSelectedCategory(dropdownContent);
        this.applyFilters();
    }

    handleCategoryPlusChange(e, dropdownContent) {
        const checkbox = e.target;
        
        if (checkbox.value === 'All') {
            if (checkbox.checked) {
                dropdownContent.querySelectorAll('input').forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            }
        } else {
            const allCheckbox = dropdownContent.querySelector('input[value="All"]');
            allCheckbox.checked = false;
        }

        this.updateSelectedCategoryPlus(dropdownContent);
        this.applyFilters();
    }

    updateCategoryPlusFilter() {
        const entries = JSON.parse(localStorage.getItem('entrySystem')) || [];
        
        // Get unique categoryplus values
        const categoryplusValues = ['All', ...new Set(entries
            .map(entry => entry.cp)
            .filter(cp => cp && cp.trim()))];
        
        this.populateFilterDropdown(this.categoryplusFilter, categoryplusValues, 'categoryplus');
    }

    updateSelectedCategory(dropdownContent) {
        const selectedCheckboxes = Array.from(dropdownContent.querySelectorAll('input:checked'));
        this.selectedCategory = selectedCheckboxes.length === 0 ? 'All' : 
            selectedCheckboxes.map(cb => cb.value);
    }

    updateSelectedCategoryPlus(dropdownContent) {
        const selectedCheckboxes = Array.from(dropdownContent.querySelectorAll('input:checked'));
        this.selectedCategoryPlus = selectedCheckboxes.length === 0 ? 'All' : 
            selectedCheckboxes.map(cb => cb.value);
    }

    applyFilters() {
        const entries = document.querySelectorAll('.entry');
        
        entries.forEach(entry => {
            const categoryMatch = this.checkCategoryMatch(entry);
            const categoryPlusMatch = this.checkCategoryPlusMatch(entry);
            
            entry.style.display = categoryMatch && categoryPlusMatch ? 'block' : 'none';
        });
    }

    checkCategoryMatch(entry) {
        if (this.selectedCategory === 'All' || 
            (Array.isArray(this.selectedCategory) && this.selectedCategory.length === 0)) {
            return true;
        }

        const categories = [];
        const categoryData = entry.dataset.categories ? JSON.parse(entry.dataset.categories) : {};
        
        if (categoryData.s === 1) categories.push('Show Cause');
        if (categoryData.i === 1) categories.push('Interim');
        if (categoryData.p === 1) categories.push('Priority');

        if (Array.isArray(this.selectedCategory)) {
            return this.selectedCategory.some(cat => categories.includes(cat));
        }
        return categories.includes(this.selectedCategory);
    }

    checkCategoryPlusMatch(entry) {
        if (this.selectedCategoryPlus === 'All' || 
            (Array.isArray(this.selectedCategoryPlus) && this.selectedCategoryPlus.length === 0)) {
            return true;
        }

        const categoryPlus = entry.dataset.categoryplus;
        
        if (Array.isArray(this.selectedCategoryPlus)) {
            return this.selectedCategoryPlus.includes(categoryPlus);
        }
        return categoryPlus === this.selectedCategoryPlus;
    }
}

// Initialize filter handler
const filterHandler = new FilterHandler();
