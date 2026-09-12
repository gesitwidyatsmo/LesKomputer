"use client";

import { useState, useEffect, useRef } from "react";
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

  const containerRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [fullscreenWidth, setFullscreenWidth] = useState(null);

  // Measure inline container width
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        setContainerWidth(Math.max(clientWidth - 20, 240));
      }
    };

    updateWidth();

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateWidth);
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", updateWidth);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Measure fullscreen container width
  useEffect(() => {
    if (!isFullscreen) return;

    const updateFullscreenWidth = () => {
      if (fullscreenContainerRef.current) {
        const clientWidth = fullscreenContainerRef.current.clientWidth;
        setFullscreenWidth(Math.max(clientWidth - 24, 260));
      } else {
        setFullscreenWidth(Math.max(window.innerWidth - 24, 260));
      }
    };

    updateFullscreenWidth();

    let observer = null;
    if (typeof ResizeObserver !== "undefined" && fullscreenContainerRef.current) {
      observer = new ResizeObserver(updateFullscreenWidth);
      observer.observe(fullscreenContainerRef.current);
    }
    window.addEventListener("resize", updateFullscreenWidth);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateFullscreenWidth);
    };
  }, [isFullscreen]);

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
      <div className="bg-white border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] rounded-xl overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-black text-white font-heading text-xs font-bold border-b-2 border-black select-none">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span>📄</span>
            <span className="tracking-wide truncate text-[11px] sm:text-xs">
              Pembaca Dokumen: {fileName}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-400 font-mono shrink-0">
            ● Siap Dibaca
          </span>
        </div>

        {/* Action Subheader */}
        <div className="bg-[#FFFDF5] border-b-2 border-black px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap gap-2 sm:gap-3 justify-between items-center">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 border border-black rounded uppercase shrink-0">
              PDF
            </span>
            <p className="text-xs sm:text-sm font-heading font-black text-black truncate max-w-[140px] sm:max-w-xs">
              {fileName}
            </p>
            {fileSize && (
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold shrink-0">
                ({fileSize} MB)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Full Screen Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-yellow-300 hover:bg-yellow-200 text-black text-[11px] sm:text-xs font-bold uppercase border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-heading"
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
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-cyan-200 text-black text-[11px] sm:text-xs font-bold uppercase border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-heading"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </a>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xs:flex sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-amber-200 text-black text-[11px] sm:text-xs font-bold uppercase border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-heading"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tab Baru</span>
            </a>
          </div>
        </div>

        {/* PDF Controls & Viewer Body (Responsive for both Mobile & Desktop) */}
        <div className="flex flex-col h-[460px] sm:h-[560px]">
          {/* PDF Navigation Controls */}
          {!isError && (
            <div className="bg-slate-900 text-white px-2.5 sm:px-4 py-2 flex flex-wrap justify-between items-center gap-2 text-xs font-heading border-b-2 border-black select-none">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={previousPage}
                  disabled={pageNumber <= 1}
                  className="p-1 sm:px-2.5 sm:py-1 bg-black text-white border border-slate-600 rounded hover:border-white disabled:opacity-30 transition-all cursor-pointer"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="bg-black px-2 sm:px-3 py-1 border border-slate-600 rounded font-bold text-[11px] sm:text-xs">
                  Hal. {pageNumber || (numPages ? 1 : "--")} / {numPages || "--"}
                </span>
                <button
                  onClick={nextPage}
                  disabled={pageNumber >= numPages}
                  className="p-1 sm:px-2.5 sm:py-1 bg-black text-white border border-slate-600 rounded hover:border-white disabled:opacity-30 transition-all cursor-pointer"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={zoomOut}
                  className="p-1 sm:p-1.5 bg-black border border-slate-600 rounded hover:border-white transition-colors cursor-pointer"
                  title="Perkecil (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={resetZoom}
                  className="px-1.5 sm:w-14 text-center font-bold bg-black py-0.5 border border-slate-600 rounded text-[11px] sm:text-xs hover:text-amber-300 transition-colors cursor-pointer"
                  title="Reset Zoom (Fit)"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={zoomIn}
                  className="p-1 sm:p-1.5 bg-black border border-slate-600 rounded hover:border-white transition-colors cursor-pointer"
                  title="Perbesar (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-1 sm:p-1.5 bg-yellow-400 text-black border border-black rounded hover:bg-yellow-300 transition-colors cursor-pointer ml-1"
                  title="Tampilan Layar Penuh"
                >
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PDF Canvas Rendering */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto flex justify-center items-start bg-slate-200 p-2 sm:p-4 relative border-b-2 border-black"
          >
            {isError ? (
              <div className="flex flex-col items-center justify-center text-slate-800 h-full text-center p-4 sm:p-6 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] m-2 sm:m-4 max-w-md">
                <ExternalLink className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-slate-600" />
                <p className="font-heading font-black text-xs sm:text-sm uppercase">
                  Pratinjau PDF Tidak Dapat Ditampilkan
                </p>
                <p className="text-xs text-slate-600 mt-1 mb-3 sm:mb-4 font-medium">
                  Kamu bisa langsung membuka atau mengunduh file ini melalui tombol di bawah:
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs font-black uppercase border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]"
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
                  width={containerWidth ? Math.min(containerWidth, 800) : undefined}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="border-2 border-black rounded shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] max-w-full"
                />
              </Document>
            )}
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN OVERLAY MODAL ────────────────────────────────────────── */}
      {isFullscreen && (
        <ClientPortal>
          <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col animate-in fade-in duration-200">
            {/* Fullscreen Header */}
            <div className="bg-black text-white px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 border-slate-700 flex items-center justify-between gap-2 select-none shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-rose-500 text-white font-black text-xs flex items-center justify-center border border-white/20 shrink-0">
                  PDF
                </span>
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-xs sm:text-sm text-white truncate max-w-[130px] xs:max-w-[180px] sm:max-w-md md:max-w-lg">
                    {fileName}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 hidden sm:block">
                    Mode Layar Penuh (Tekan <kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600 text-amber-300">Esc</kbd> untuk keluar)
                  </p>
                </div>
              </div>

              {/* Navigation & Zoom controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Page Prev / Next */}
                <div className="flex items-center gap-1 bg-slate-900 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-700">
                  <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="p-1 text-white hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="text-[11px] sm:text-xs font-mono font-bold px-1 sm:px-2 text-slate-200">
                    {pageNumber} / {numPages || "--"}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={pageNumber >= numPages}
                    className="p-1 text-white hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    title="Halaman Selanjutnya"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Zoom Controls (Responsive for mobile & desktop) */}
                <div className="flex items-center gap-1 bg-slate-900 px-1 sm:px-2 py-1 rounded-lg border border-slate-700">
                  <button
                    onClick={zoomOut}
                    className="p-1 text-white hover:text-amber-300 cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={resetZoom}
                    className="text-[10px] sm:text-xs font-mono font-bold px-1 text-slate-200 hover:text-amber-300 cursor-pointer"
                    title="Reset Zoom (Fit)"
                  >
                    {Math.round(scale * 100)}%
                  </button>
                  <button
                    onClick={zoomIn}
                    className="p-1 text-white hover:text-amber-300 cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase rounded-lg border border-rose-400 shadow-sm transition-colors cursor-pointer font-heading"
                  title="Tutup Layar Penuh"
                >
                  <X className="w-4 h-4 sm:hidden" />
                  <Minimize2 className="w-3.5 h-3.5 hidden sm:inline" />
                  <span className="hidden sm:inline">Tutup</span>
                </button>
              </div>
            </div>

            {/* Fullscreen PDF Viewer Body */}
            <div
              ref={fullscreenContainerRef}
              className="flex-1 overflow-auto bg-slate-900 flex justify-center items-start p-2 sm:p-6 pb-20 sm:pb-6 relative"
            >
              {isError ? (
                <div className="flex flex-col items-center justify-center text-slate-800 text-center p-6 sm:p-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] m-auto max-w-md">
                  <ExternalLink className="w-10 h-10 sm:w-12 sm:h-12 mb-3 text-slate-600" />
                  <p className="font-heading font-black text-sm sm:text-base uppercase">
                    Gagal Menampilkan Pratinjau PDF
                  </p>
                  <p className="text-xs text-slate-600 mt-1 mb-4 font-medium">
                    Buka file langsung di tab baru browser kamu:
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-heading text-xs font-black uppercase border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000]"
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
                    width={fullscreenWidth ? Math.min(fullscreenWidth, 1000) : undefined}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="border-2 border-black rounded-lg shadow-2xl overflow-hidden max-w-full"
                  />
                </Document>
              )}
            </div>

            {/* Mobile Thumb-Friendly Floating Bar (Quick Flip & Fit) */}
            <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/90 backdrop-blur-md px-3.5 py-2 border-2 border-slate-600 rounded-full shadow-2xl text-white">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-amber-300 cursor-pointer"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1.5">
                {pageNumber} / {numPages || "--"}
              </span>
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-amber-300 cursor-pointer"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-3.5 bg-slate-600 mx-0.5" />
              <button
                onClick={resetZoom}
                className="text-[10px] font-mono font-bold px-1 text-slate-300 hover:text-white"
                title="Fit Width"
              >
                Fit
              </button>
              <button
                onClick={zoomIn}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ClientPortal>
      )}
    </>
  );
}
