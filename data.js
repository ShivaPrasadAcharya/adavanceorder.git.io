// Initial data structure
const initialEntries = [
    {
        i: '0001',
        d: 'Example entry',
        dp: 'This is an example entry with additional description',
        c: {
            s: 1,
            i: 0,
            p: 1
        },
        cp: 'High',
        u: 'https://example.com',
        un: 'Example Link',
        dt: '2025-01-11'
    }
];

// Initialize or get data from localStorage
function initializeData() {
    if (!localStorage.getItem('entrySystem')) {
        localStorage.setItem('entrySystem', JSON.stringify(initialEntries));
    }
    return JSON.parse(localStorage.getItem('entrySystem'));
}

// Export the data
const entrySystem = {
    key: 'entrySystem',
    entries: initializeData()
};