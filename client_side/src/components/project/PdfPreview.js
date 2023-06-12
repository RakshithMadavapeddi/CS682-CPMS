import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import '../../styles/pdfPreview.css'; // Import the CSS for the PDF preview component

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfPreview({ projectId, onClose }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    async function fetchPdf() {
      try {
        const response = await axios.get('/api/project/'+ projectId, {
          responseType: 'blob',
        });
        const pdfBlobUrl = URL.createObjectURL(response.data);
        setPdfUrl(pdfBlobUrl);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPdf();
  }, [projectId]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-preview-container">
      <div className="pdf-preview">
        <button className="close-btn" onClick={onClose}>Close</button>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ),
          )}
        </Document>
      </div>
    </div>
  );
}

export default PdfPreview;
