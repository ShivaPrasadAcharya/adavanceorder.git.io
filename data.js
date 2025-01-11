const entrySystem = {
    key: 'entrySystem',
    entries: [
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
        // Add more entries here
    ]
};

// Store in localStorage if not exists
if (!localStorage.getItem(entrySystem.key)) {
    localStorage.setItem(entrySystem.key, JSON.stringify(entrySystem.entries));
}