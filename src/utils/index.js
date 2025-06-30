/**
 * Mengubah string menjadi format URL-friendly (slug).
 * @param {string} text - Teks yang akan diubah.
 * @returns {string} Slug.
 */
export const slugify = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Ganti spasi dengan -
      .replace(/[^\w\-]+/g, '') // Hapus karakter non-kata
      .replace(/\-\-+/g, '-') // Ganti -- dengan -
      .replace(/^-+/, '') // Hapus - dari awal
      .replace(/-+$/, ''); // Hapus - dari akhir
  };
  
  /**
   * Mendekode entitas HTML menjadi string biasa.
   * @param {string} html - String HTML yang akan didekode.
   * @returns {string} Teks yang sudah didekode.
   */
  export const decodeHtml = (html) => {
    if (!html) return '';
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };