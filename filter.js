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
        // Initialize category filter
        const categoryTypes = ['All', 'Show Cause', 'Interim', 'Priority'];
        this.createFilterCheckboxes(this.categoryFilter, categoryTypes, 'category');

        // Initialize categoryplus filter (will be populated from data)
        this.updateCategoryPlusFilter();
    }

    initializeEventListeners() {
        document.addEventListener('entriesUpdated', () => {
            this.updateCategoryPlusFilter();
            this.applyFilters();
        });
    }

    createFilterCheckboxes(container, options, type) {
        const checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'checkbox-group';

        options.forEach(option => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.checked = option === 'All';
            
            checkbox.addEventListener('change', (e) => {
                if (type === 'category') {
                    this.handleCategoryChange(e, checkboxGroup);
                } else {
                    this.handleCategoryPlusChange(e, checkboxGroup);
                }
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(option));
            checkboxGroup.appendChild(label);
        });

        // Clear existing checkboxes
        while (container.children.length > 1) {
            container.removeChild(container.lastChild);
        }
        container.appendChild(checkboxGroup);
    }

    handleCategoryChange(e, checkboxGroup) {
        const checkbox = e.target;
        
        if (checkbox.value === 'All') {
            // If "All" is checked, uncheck others
            if (checkbox.checked) {
                checkboxGroup.querySelectorAll('input').forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            }
        } else {
            // If other is checked, uncheck "All"
            const allCheckbox = checkboxGroup.querySelector('input[value="All"]');
            allCheckbox.checked = false;
        }

        this.updateSelectedCategory(checkboxGroup);
        this.applyFilters();
    }

    handleCategoryPlusChange(e, checkboxGroup) {
        const checkbox = e.target;
        
        if (checkbox.value === 'All') {
            if (checkbox.checked) {
                checkboxGroup.querySelectorAll('input').forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            }
        } else {
            const allCheckbox = checkboxGroup.querySelector('input[value="All"]');
            allCheckbox.checked = false;
        }

        this.updateSelectedCategoryPlus(checkboxGroup);
        this.applyFilters();
    }

    updateSelectedCategory(checkboxGroup) {
        const selectedCheckboxes = Array.from(checkboxGroup.querySelectorAll('input:checked'));
        this.selectedCategory = selectedCheckboxes.length === 0 ? 'All' : 
            selectedCheckboxes.map(cb => cb.value);
    }

    updateSelectedCategoryPlus(checkboxGroup) {
        const selectedCheckboxes = Array.from(checkboxGroup.querySelectorAll('input:checked'));
        this.selectedCategoryPlus = selectedCheckboxes.length === 0 ? 'All' : 
            selectedCheckboxes.map(cb => cb.value);
    }

    updateCategoryPlusFilter() {
        const entries = JSON.parse(localStorage.getItem('entrySystem')) || [];
        
        // Get unique categoryplus values
        const categoryplusValues = ['All', ...new Set(entries
            .map(entry => entry.cp)
            .filter(cp => cp && cp.trim()))];
        
        this.createFilterCheckboxes(this.categoryplusFilter, categoryplusValues, 'categoryplus');
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
