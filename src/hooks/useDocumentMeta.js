
import { useEffect } from 'react';

/**
 * Custom hook untuk mengatur meta tag dokumen secara dinamis.
 * @param {string} title - Judul halaman.
 * @param {string} description - Deskripsi meta.
 * @param {object} schemaData - Data schema JSON-LD.
 */
export const useDocumentMeta = (title, description, schemaData) => {
  useEffect(() => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const existingScript = document.getElementById('schema-json');
    if (existingScript) {
      existingScript.remove();
    }

    if (schemaData) {
      const script = document.createElement('script');
      script.id = 'schema-json';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }, [title, description, schemaData]);
};