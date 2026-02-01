import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Printer, Download } from 'lucide-react';

interface ResultDisplayProps {
  content: string;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => (
  <ReactMarkdown 
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 border-b pb-2 text-primary-800" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-8 mb-4 text-primary-700 break-after-avoid" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800" {...props} />,
      p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
      table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full border-collapse border border-gray-300 text-sm" {...props} /></div>,
      th: ({node, ...props}) => <th className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold text-left" {...props} />,
      td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2 align-top" {...props} />,
      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary-400 pl-4 italic bg-gray-50 py-2 my-4 rounded-r" {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {

  const handlePrint = () => {
    window.print();
  };

  // Logic to split content for mixed layout printing
  const sections = useMemo(() => {
    // We expect specific headers from Gemini
    const kisiKisiMarker = "## I. KISI-KISI";
    const soalMarker = "## II. SOAL";
    
    const kisiKisiIndex = content.indexOf(kisiKisiMarker);
    const soalIndex = content.indexOf(soalMarker);

    if (kisiKisiIndex === -1 || soalIndex === -1) {
      // Fallback if headers are missing: print everything as one block
      return {
        intro: content,
        kisiKisi: null,
        soal: null
      };
    }

    const intro = content.substring(0, kisiKisiIndex);
    const kisiKisi = content.substring(kisiKisiIndex, soalIndex);
    const soal = content.substring(soalIndex);

    return { intro, kisiKisi, soal };
  }, [content]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full max-h-[800px] md:max-h-full">
      <div className="bg-gray-100 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 no-print">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          Hasil Generasi
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white border border-primary-600 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
           <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Cetak
          </button>
        </div>
      </div>

      <div className="p-8 overflow-y-auto markdown-body custom-prose flex-grow bg-white">
        {/* Render logic: if sections detected, render distinct divs for print control */}
        {sections.kisiKisi ? (
          <>
            {/* Identity/Intro: Portrait */}
            <div className="print-section-portrait">
              <MarkdownRenderer content={sections.intro} />
            </div>

            {/* Kisi-Kisi: Landscape (via CSS named page) */}
            <div className="print-section-landscape mt-4">
               <MarkdownRenderer content={sections.kisiKisi} />
            </div>

            {/* Soal & Key: Portrait */}
            <div className="print-section-portrait mt-4">
               <MarkdownRenderer content={sections.soal || ''} />
            </div>
          </>
        ) : (
          /* Fallback view */
          <MarkdownRenderer content={content} />
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;