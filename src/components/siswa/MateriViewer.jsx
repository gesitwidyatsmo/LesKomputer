"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  FileText,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function MateriViewer({ fileUrl, fileName, fileSize }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isError, setIsError] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsError(false);
  }

  function onDocumentLoadError() {
    setIsError(true);
  }

  const changePage = (offset) => {
    setPageNumber((prev) => prev + offset);
  };

  const previousPage = () => {
    if (pageNumber > 1) changePage(-1);
  };

  const nextPage = () => {
    if (pageNumber < numPages) changePage(1);
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));

  return (
    <div className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden flex flex-col">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span>📄</span>
          <span className="tracking-wide truncate">
            Pembaca Dokumen: {fileName}
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-mono shrink-0">
          ● Siap Dibaca
        </span>
      </div>

      {/* Action Subheader */}
      <div className="bg-[#FFFDF5] border-b-2 border-black px-4 py-3 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 border border-black rounded uppercase">
            PDF
          </span>
          <p className="text-xs sm:text-sm font-heading font-black text-black truncate max-w-[200px] sm:max-w-xs">
            {fileName}
          </p>
          {fileSize && (
            <span className="text-xs text-slate-500 font-bold">
              ({fileSize} MB)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-cyan-200 text-black text-xs font-bold uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-heading"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-200 text-black text-xs font-bold uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-heading"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka di Tab Baru</span>
          </a>
        </div>
      </div>

      {/* PDF Controls & Viewer Body (Desktop) */}
      <div className="hidden sm:flex flex-col h-[520px]">
        {/* PDF Navigation Controls */}
        {!isError && (
          <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-xs font-heading border-b-2 border-black select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="px-2.5 py-1 bg-black text-white border border-slate-600 rounded hover:border-white disabled:opacity-30 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="bg-black px-3 py-1 border border-slate-600 rounded font-bold">
                Halaman {pageNumber || (numPages ? 1 : "--")} dari{" "}
                {numPages || "--"}
              </span>
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="px-2.5 py-1 bg-black text-white border border-slate-600 rounded hover:border-white disabled:opacity-30 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="p-1.5 bg-black border border-slate-600 rounded hover:border-white transition-colors cursor-pointer"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="w-14 text-center font-bold bg-black py-0.5 border border-slate-600 rounded">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-1.5 bg-black border border-slate-600 rounded hover:border-white transition-colors cursor-pointer"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PDF Canvas Rendering */}
        <div className="flex-1 overflow-auto flex justify-center bg-slate-200 p-4 relative border-b-2 border-black">
          {isError ? (
            <div className="flex flex-col items-center justify-center text-slate-800 h-full text-center p-6 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] m-4 max-w-md">
              <ExternalLink className="w-10 h-10 mb-2 text-slate-600" />
              <p className="font-heading font-black text-sm uppercase">
                Pratinjau PDF Tidak Dapat Ditampilkan
              </p>
              <p className="text-xs text-slate-600 mt-1 mb-4 font-medium">
                Kamu bisa langsung membuka atau mengunduh file ini melalui tombol di bawah:
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]"
              >
                Buka PDF di Tab Baru
              </a>
            </div>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex h-64 items-center justify-center text-xs font-bold text-black animate-pulse font-heading">
                  Memuat dokumen materi... 📖
                </div>
              }
              className="pdf-document"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="border-2 border-black rounded shadow-[4px_4px_0px_0px_#000]"
              />
            </Document>
          )}
        </div>
      </div>

      {/* Mobile view fallback message */}
      <div className="sm:hidden p-4 text-center bg-yellow-50 border-t-2 border-black text-xs text-slate-800 font-bold space-y-2.5">
        <p>Gunakan tombol di bawah untuk mengunduh dan membaca materi di HP kamu:</p>
        <a
          href={fileUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-black uppercase font-heading"
        >
          <Download className="w-4 h-4" /> Unduh Dokumen PDF
        </a>
      </div>
    </div>
  );
}
