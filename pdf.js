class PDFHandler {
    constructor() {
        this.pdfOptions = {
            margin: 10,
            filename: 'entry.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
    }

    async generatePDF(entryElement) {
        // Create a clone of the entry to modify for PDF
        const pdfContent = entryElement.cloneNode(true);
        
        // Remove action buttons from PDF
        const actionButtons = pdfContent.querySelector('.entry-actions');
        if (actionButtons) {
            actionButtons.remove();
        }

        // Add styles for PDF
        pdfContent.style.padding = '20px';
        pdfContent.style.backgroundColor = 'white';
        pdfContent.style.maxWidth = '210mm'; // A4 width
        
        try {
            // Create temporary container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.appendChild(pdfContent);
            document.body.appendChild(container);

            // Generate PDF
            await html2pdf()
                .set(this.pdfOptions)
                .from(pdfContent)
                .save();

            // Clean up
            document.body.removeChild(container);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    }
}

// Initialize PDF handler
const pdfHandler = new PDFHandler();