import React from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const ContactPage = () => {
  useDocumentMeta(
    'Contact Us | Simply Trivial',
    'Have questions or feedback? Get in touch with the Simply Trivial team.'
  );

  return (
    <div className="bg-slate-800 p-8 rounded-lg max-w-4xl mx-auto text-left">
      <h1 className="text-4xl font-bold font-display text-white mb-6">Contact Us</h1>
      <div className="text-slate-300 leading-relaxed space-y-4">
        <p>
          We'd love to hear from you! Whether you have a question, feedback, or a suggestion for a new quiz category, please don't hesitate to reach out.
        </p>
        <p>
          For all inquiries, you can contact us via email:
        </p>
        <p className="text-lg text-sky-400 font-semibold">
          simplytrivialgame@gmail.com 
        </p>
        <p>
          We do our best to respond to all messages within 48 hours. Thank you for your support!
        </p>
      </div>
    </div>
  );
};