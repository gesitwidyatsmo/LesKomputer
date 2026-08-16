"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  FileText,
  Maximize2,
  Minimize2,
  X,
  RotateCw,
} from "lucide-react";
import ClientPortal from "@/components/ClientPortal";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function MateriViewer({ fileUrl, fileName, fileSize }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isError, setIsError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const zoomIn = () => setScale((s) => Math.min(Number((s + 0.2).toFixed(1)), 3.0));
  const zoomOut = () => setScale((s) => Math.max(Number((s - 0.2).toFixed(1)), 0.5));
  const resetZoom = () => setScale(1.0);

  // Keyboard navigation & body overflow lock for Fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (pageNumber > 1) changePage(-1);
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (pageNumber < numPages) changePage(1);
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, pageNumber, numPages]);

  return (
    <>
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Full Screen Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-300 hover:bg-yellow-200 text-black text-xs font-bold uppercase border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-heading"
              title="Buka Layar Penuh"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Layar Penuh</span>
            </button>

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
              <span>Tab Baru</span>
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
                  title="Perkecil (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-bold bg-black py-0.5 border border-slate-600 rounded">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-1.5 bg-black border border-slate-600 rounded hover:border-white transition-colors cursor-pointer"
                  title="Perbesar (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-1.5 bg-yellow-400 text-black border border-black rounded hover:bg-yellow-300 transition-colors cursor-pointer ml-1"
                  title="Tampilan Layar Penuh"
                >
                  <Maximize2 className="w-4 h-4" />
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
          <p>Buka layar penuh atau unduh materi untuk membaca di HP kamu:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-300 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-black uppercase font-heading text-xs cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" /> Buka Layar Penuh
            </button>
            <a
              href={fileUrl}
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] font-black uppercase font-heading text-xs cursor-pointer"
            >
              <Download className="w-4 h-4" /> Unduh PDF
            </a>
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN OVERLAY MODAL ────────────────────────────────────────── */}
      {isFullscreen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col animate-in fade-in duration-200">
            {/* Fullscreen Header */}
            <div className="bg-black text-white px-4 py-3 border-b-2 border-slate-700 flex flex-wrap items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded bg-rose-500 text-white font-black text-xs flex items-center justify-center border border-white/20 shrink-0">
                  PDF
                </span>
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-sm text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
                    {fileName}
                  </h2>
                  <p className="text-[11px] font-mono text-slate-400">
                    Mode Layar Penuh (Tekan <kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 text-amber-300">Esc</kbd> untuk keluar)
                  </p>
                </div>
              </div>

              {/* Navigation & Zoom controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Page Prev / Next */}
                <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                  <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="p-1 text-white hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    title="Halaman Sebelumnya (Panah Kiri)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-slate-200">
                    {pageNumber} / {numPages || "--"}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={pageNumber >= numPages}
                    className="p-1 text-white hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    title="Halaman Selanjutnya (Panah Kanan)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                  <button
                    onClick={zoomOut}
                    className="p-1 text-white hover:text-amber-300 cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="text-xs font-mono font-bold px-1.5 text-slate-200 hover:text-amber-300 cursor-pointer"
                    title="Reset Zoom (100%)"
                  >
                    {Math.round(scale * 100)}%
                  </button>
                  <button
                    onClick={zoomIn}
                    className="p-1 text-white hover:text-amber-300 cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Download */}
                <a
                  href={fileUrl}
                  download={fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-600 transition-colors font-heading cursor-pointer"
                  title="Unduh PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>

                {/* Close Fullscreen */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase rounded-lg border border-rose-400 shadow-sm transition-colors cursor-pointer font-heading ml-1"
                  title="Tutup Layar Penuh (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Tutup</span>
                </button>
              </div>
            </div>

            {/* Fullscreen PDF Viewer Body */}
            <div className="flex-1 overflow-auto bg-slate-900 flex justify-center items-start p-4 sm:p-8">
              {isError ? (
                <div className="flex flex-col items-center justify-center text-slate-800 text-center p-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] m-auto max-w-md">
                  <ExternalLink className="w-12 h-12 mb-3 text-slate-600" />
                  <p className="font-heading font-black text-base uppercase">
                    Gagal Menampilkan Pratinjau PDF
                  </p>
                  <p className="text-xs text-slate-600 mt-1 mb-5 font-medium">
                    Buka file langsung di tab baru browser kamu:
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]"
                  >
                    Buka di Tab Baru
                  </a>
                </div>
              ) : (
                <Document
                  file={fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex h-96 items-center justify-center text-sm font-bold text-amber-300 animate-pulse font-heading">
                      Memuat dokumen PDF layar penuh... 📖
                    </div>
                  }
                  className="pdf-document"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="border-2 border-black rounded-lg shadow-2xl overflow-hidden"
                  />
                </Document>
              )}
            </div>
          </div>
        </ClientPortal>
      )}
    </>
  );
}
