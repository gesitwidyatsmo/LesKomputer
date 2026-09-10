'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Highlighter,
	Keyboard,
	List,
	ListOrdered,
	Eye,
	Edit3,
	HelpCircle,
	Palette,
} from 'lucide-react';
import RichTipsRenderer from '@/components/common/RichTipsRenderer';

export default function RichTipsEditor({
	value = '',
	onChange,
	placeholder = 'Ketik tips, trik, atau shortcut penting di sini...',
	rows = 3,
}) {
	const textareaRef = useRef(null);
	const selectionRef = useRef({ start: 0, end: 0, scrollTop: 0 });
	const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
	const [showHelp, setShowHelp] = useState(false);
	const [showHighlightMenu, setShowHighlightMenu] = useState(false);
	const [showColorMenu, setShowColorMenu] = useState(false);

	// Catat posisi kursor & seleksi setiap kali kursor berpindah
	const updateSelectionState = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		selectionRef.current = {
			start: textarea.selectionStart,
			end: textarea.selectionEnd,
			scrollTop: textarea.scrollTop,
		};
	};

	// Helper untuk menyisipkan / membungkus teks pada textarea di posisi kursor aktif
	const applyFormatting = (prefix, suffix = '', defaultText = 'teks') => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		// Ambil posisi seleksi dan scroll
		let start = textarea.selectionStart;
		let end = textarea.selectionEnd;
		const savedScrollTop = textarea.scrollTop ?? selectionRef.current.scrollTop ?? 0;

		// Jika seleksi di textarea hilang karena blur, gunakan riwayat seleksi terakhir
		if (typeof start !== 'number' || (start === 0 && end === 0 && selectionRef.current.start > 0)) {
			start = selectionRef.current.start;
			end = selectionRef.current.end;
		}

		const originalText = textarea.value || '';
		const selectedText = originalText.substring(start, end);

		let replacement = '';
		let newCursorStart = start;
		let newCursorEnd = end;

		if (selectedText.length > 0) {
			// Toggle format: Jika sudah terbungkus format ini, buka kembali formatnya
			if (
				selectedText.startsWith(prefix) &&
				selectedText.endsWith(suffix) &&
				selectedText.length >= prefix.length + suffix.length
			) {
				replacement = selectedText.substring(prefix.length, selectedText.length - suffix.length);
				newCursorStart = start;
				newCursorEnd = start + replacement.length;
			} else {
				replacement = `${prefix}${selectedText}${suffix}`;
				newCursorStart = start;
				newCursorEnd = start + replacement.length;
			}
		} else {
			// Jika tidak ada teks yang diblok: sisipkan template di posisi kursor saat ini (bukan di awal teks)
			replacement = `${prefix}${defaultText}${suffix}`;
			newCursorStart = start + prefix.length;
			newCursorEnd = newCursorStart + defaultText.length;
		}

		const updated = originalText.substring(0, start) + replacement + originalText.substring(end);
		onChange(updated);

		// Perbarui referensi seleksi segera
		selectionRef.current = {
			start: newCursorStart,
			end: newCursorEnd,
			scrollTop: savedScrollTop,
		};

		// Kembalikan fokus, seleksi, dan posisi scroll secara presisi
		requestAnimationFrame(() => {
			if (textareaRef.current) {
				textareaRef.current.focus();
				textareaRef.current.setSelectionRange(newCursorStart, newCursorEnd);
				textareaRef.current.scrollTop = savedScrollTop;
			}
		});
	};

	// Helper untuk format per baris (Bullet & Numbered List)
	const applyLineFormatting = (type) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		let start = textarea.selectionStart;
		let end = textarea.selectionEnd;
		const savedScrollTop = textarea.scrollTop ?? selectionRef.current.scrollTop ?? 0;

		if (typeof start !== 'number' || (start === 0 && end === 0 && selectionRef.current.start > 0)) {
			start = selectionRef.current.start;
			end = selectionRef.current.end;
		}

		const originalText = textarea.value || '';

		// Cari baris yang terkena seleksi
		const lineStart = originalText.lastIndexOf('\n', start - 1) + 1;
		let lineEnd = originalText.indexOf('\n', end);
		if (lineEnd === -1) lineEnd = originalText.length;

		const before = originalText.substring(0, lineStart);
		const linesToFormat = originalText.substring(lineStart, lineEnd);
		const after = originalText.substring(lineEnd);

		const lines = (linesToFormat || 'Poin baru').split('\n');

		const formattedLines = lines.map((line, idx) => {
			// Bersihkan bullet/nomor lama jika ada
			const clean = line.replace(/^(([•\-]|\*(?!\*))|\d+[\.\)])\s*/, '');
			if (type === 'bullet') {
				// Toggle bullet: jika sudah ber-bullet, lepas bulletnya
				if (line.startsWith('• ') || line.startsWith('- ')) {
					return clean;
				}
				return `• ${clean}`;
			} else if (type === 'number') {
				// Toggle number
				if (/^\d+[\.\)]\s*/.test(line)) {
					return clean;
				}
				return `${idx + 1}. ${clean}`;
			}
			return line;
		});

		const replacement = formattedLines.join('\n');
		const updated = before + replacement + after;
		onChange(updated);

		const newStart = lineStart;
		const newEnd = lineStart + replacement.length;

		selectionRef.current = {
			start: newStart,
			end: newEnd,
			scrollTop: savedScrollTop,
		};

		requestAnimationFrame(() => {
			if (textareaRef.current) {
				textareaRef.current.focus();
				textareaRef.current.setSelectionRange(newStart, newEnd);
				textareaRef.current.scrollTop = savedScrollTop;
			}
		});
	};

	// Tangani Keyboard Shortcuts di dalam textarea (Ctrl+B, Ctrl+I, Ctrl+U)
	const handleKeyDown = (e) => {
		if (e.ctrlKey || e.metaKey) {
			if (e.key.toLowerCase() === 'b') {
				e.preventDefault();
				applyFormatting('**', '**', 'tebal');
			} else if (e.key.toLowerCase() === 'i') {
				e.preventDefault();
				applyFormatting('*', '*', 'miring');
			} else if (e.key.toLowerCase() === 'u') {
				e.preventDefault();
				applyFormatting('<u>', '</u>', 'garis bawah');
			}
		}
	};

	// Tutup dropdown menu saat klik di luar
	useEffect(() => {
		const handleClickOutside = () => {
			setShowHighlightMenu(false);
			setShowColorMenu(false);
		};
		if (showHighlightMenu || showColorMenu) {
			window.addEventListener('click', handleClickOutside);
			return () => window.removeEventListener('click', handleClickOutside);
		}
	}, [showHighlightMenu, showColorMenu]);

	return (
		<div className='border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-white rounded-none'>
			{/* Baris Atas: Toolbar Format ala MS Word & Toggle Preview */}
			<div className='flex flex-wrap items-center justify-between gap-1 p-1.5 bg-slate-100 border-b-2 border-black select-none'>
				{/* Grup Tombol Format */}
				<div className='flex flex-wrap items-center gap-1'>
					{/* Bold */}
					<button
						type='button'
						title='Tebal / Bold (Ctrl+B)'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => applyFormatting('**', '**', 'teks tebal')}
						className='w-7 h-7 flex items-center justify-center bg-white hover:bg-yellow-200 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer font-black'>
						<Bold className='w-3.5 h-3.5 stroke-[3]' />
					</button>

					{/* Italic */}
					<button
						type='button'
						title='Miring / Italic (Ctrl+I)'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => applyFormatting('*', '*', 'teks miring')}
						className='w-7 h-7 flex items-center justify-center bg-white hover:bg-yellow-200 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
						<Italic className='w-3.5 h-3.5' />
					</button>

					{/* Underline */}
					<button
						type='button'
						title='Garis Bawah / Underline (Ctrl+U)'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => applyFormatting('<u>', '</u>', 'garis bawah')}
						className='w-7 h-7 flex items-center justify-center bg-white hover:bg-yellow-200 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
						<Underline className='w-3.5 h-3.5' />
					</button>

					{/* Strikethrough */}
					<button
						type='button'
						title='Coret / Strikethrough'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => applyFormatting('~~', '~~', 'coret')}
						className='w-7 h-7 flex items-center justify-center bg-white hover:bg-yellow-200 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
						<Strikethrough className='w-3.5 h-3.5' />
					</button>

					<div className='w-px h-5 bg-slate-400 mx-0.5' />

					{/* Stabilo / Highlight Dropdown */}
					<div className='relative'>
						<button
							type='button'
							title='Stabilo / Highlight Kata'
							onMouseDown={(e) => e.preventDefault()}
							onClick={(e) => {
								e.stopPropagation();
								setShowHighlightMenu(!showHighlightMenu);
								setShowColorMenu(false);
							}}
							className='h-7 px-1.5 flex items-center gap-1 bg-yellow-300 hover:bg-yellow-400 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs font-mono font-bold'>
							<Highlighter className='w-3.5 h-3.5' />
							<span className='text-[10px] hidden sm:inline'>Stabilo</span>
						</button>

						{showHighlightMenu && (
							<div
								onClick={(e) => e.stopPropagation()}
								className='absolute left-0 top-8 z-30 bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_#000] flex flex-col gap-1 min-w-[130px]'>
								<button
									type='button'
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										applyFormatting('==', '==', 'stabilo kuning');
										setShowHighlightMenu(false);
									}}
									className='flex items-center gap-2 px-2 py-1 text-left text-xs font-mono font-bold hover:bg-yellow-100 cursor-pointer'>
									<span className='w-3 h-3 bg-yellow-300 border border-black rounded-sm' />
									Kuning
								</button>
								<button
									type='button'
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										applyFormatting('==hijau:', '==', 'stabilo hijau');
										setShowHighlightMenu(false);
									}}
									className='flex items-center gap-2 px-2 py-1 text-left text-xs font-mono font-bold hover:bg-emerald-100 cursor-pointer'>
									<span className='w-3 h-3 bg-emerald-300 border border-black rounded-sm' />
									Hijau
								</button>
								<button
									type='button'
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										applyFormatting('==biru:', '==', 'stabilo biru');
										setShowHighlightMenu(false);
									}}
									className='flex items-center gap-2 px-2 py-1 text-left text-xs font-mono font-bold hover:bg-cyan-100 cursor-pointer'>
									<span className='w-3 h-3 bg-cyan-300 border border-black rounded-sm' />
									Biru Muda
								</button>
								<button
									type='button'
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										applyFormatting('==pink:', '==', 'stabilo pink');
										setShowHighlightMenu(false);
									}}
									className='flex items-center gap-2 px-2 py-1 text-left text-xs font-mono font-bold hover:bg-rose-100 cursor-pointer'>
									<span className='w-3 h-3 bg-rose-300 border border-black rounded-sm' />
									Pink
								</button>
							</div>
						)}
					</div>

					{/* Warna Teks */}
					<div className='relative'>
						<button
							type='button'
							title='Warna Teks'
							onMouseDown={(e) => e.preventDefault()}
							onClick={(e) => {
								e.stopPropagation();
								setShowColorMenu(!showColorMenu);
								setShowHighlightMenu(false);
							}}
							className='h-7 px-1.5 flex items-center gap-1 bg-white hover:bg-slate-200 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs font-mono font-bold'>
							<Palette className='w-3.5 h-3.5 text-rose-500' />
							<span className='text-[10px] hidden sm:inline'>Warna</span>
						</button>

						{showColorMenu && (
							<div
								onClick={(e) => e.stopPropagation()}
								className='absolute left-0 top-8 z-30 bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_#000] flex flex-col gap-1 min-w-[130px]'>
								<button
									type='button'
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										applyFormatting('{merah:', '}', 'teks merah');
										setShowColorMenu(false);
									}}
									className='flex items-center gap-2 px-2 py-1 text-left text-xs font-mono font-bold hover:bg-rose-50 text-rose-600 cursor-pointer'>
									<span className='w-2.5 h-2.5 bg-rose-500 rounded-full' />
									Merah
								</button>
								<button
									type='button'
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										applyFormatting('{hijau:', '}', 'teks hijau');
										setShowColorMenu(false);
									}}
									className='flex items-center gap-2 px-2 py-1 text-left text-xs font-mono font-bold hover:bg-emerald-50 text-emerald-600 cursor-pointer'>
									<span className='w-2.5 h-2.5 bg-emerald-500 rounded-full' />
									Hijau
								</button>
								<button
									type='button'
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										applyFormatting('{biru:', '}', 'teks biru');
										setShowColorMenu(false);
									}}
									className='flex items-center gap-2 px-2 py-1 text-left text-xs font-mono font-bold hover:bg-blue-50 text-blue-600 cursor-pointer'>
									<span className='w-2.5 h-2.5 bg-blue-500 rounded-full' />
									Biru
								</button>
							</div>
						)}
					</div>

					<div className='w-px h-5 bg-slate-400 mx-0.5' />

					{/* Shortcut Keyboard Tombol Keren */}
					<button
						type='button'
						title='Tombol Shortcut Keyboard Retro (contoh: Ctrl + C)'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => applyFormatting('[[', ']]', 'Ctrl + C')}
						className='h-7 px-2 flex items-center gap-1 bg-amber-200 hover:bg-amber-300 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs font-mono font-bold'>
						<Keyboard className='w-3.5 h-3.5' />
						<span className='text-[10px]'>[ Kbd ]</span>
					</button>

					<div className='w-px h-5 bg-slate-400 mx-0.5' />

					{/* Bullet List */}
					<button
						type='button'
						title='Daftar Poin (Bullet List)'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => applyLineFormatting('bullet')}
						className='w-7 h-7 flex items-center justify-center bg-white hover:bg-yellow-200 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
						<List className='w-3.5 h-3.5' />
					</button>

					{/* Numbered List */}
					<button
						type='button'
						title='Daftar Bernomor (Numbered List)'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => applyLineFormatting('number')}
						className='w-7 h-7 flex items-center justify-center bg-white hover:bg-yellow-200 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
						<ListOrdered className='w-3.5 h-3.5' />
					</button>
				</div>

				{/* Bagian Kanan: Toggle Editor / Live Preview & Cheat Sheet */}
				<div className='flex items-center gap-1.5 ml-auto'>
					<button
						type='button'
						onClick={() => setShowHelp(!showHelp)}
						title='Bantuan Panduan Format'
						className='h-7 w-7 flex items-center justify-center bg-white hover:bg-cyan-100 text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] cursor-pointer'>
						<HelpCircle className='w-3.5 h-3.5 text-slate-700' />
					</button>

					<div className='flex border border-black rounded overflow-hidden shadow-[1px_1px_0px_0px_#000]'>
						<button
							type='button'
							onClick={() => setActiveTab('editor')}
							className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer ${
								activeTab === 'editor' ? 'bg-black text-yellow-300' : 'bg-white text-black hover:bg-slate-200'
							}`}>
							<Edit3 className='w-3 h-3' />
							<span>Editor</span>
						</button>
						<button
							type='button'
							onClick={() => setActiveTab('preview')}
							className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer ${
								activeTab === 'preview' ? 'bg-black text-cyan-300' : 'bg-white text-black hover:bg-slate-200'
							}`}>
							<Eye className='w-3 h-3' />
							<span>Pratinjau</span>
						</button>
					</div>
				</div>
			</div>

			{/* Area Bantuan Singkat (Cheat Sheet) jika dibuka */}
			{showHelp && (
				<div className='p-3 bg-cyan-50 border-b-2 border-black text-xs font-mono space-y-1.5'>
					<p className='font-bold text-black uppercase text-[11px] flex items-center gap-1.5'>
						Panduan Singkat Format Teks ala MS Word:
					</p>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] pt-1'>
						<div className='bg-white p-1.5 border border-black rounded'>
							<span className='font-bold text-black'>Tebal / Bold:</span>
							<div className='text-slate-600'>**kata penting**</div>
						</div>
						<div className='bg-white p-1.5 border border-black rounded'>
							<span className='font-bold text-black'>Miring / Italic:</span>
							<div className='text-slate-600'>*kata istilah*</div>
						</div>
						<div className='bg-white p-1.5 border border-black rounded'>
							<span className='font-bold text-black'>Garis Bawah:</span>
							<div className='text-slate-600'>&lt;u&gt;garis bawah&lt;/u&gt;</div>
						</div>
						<div className='bg-white p-1.5 border border-black rounded'>
							<span className='font-bold text-black'>Tombol Keyboard:</span>
							<div className='text-slate-600'>[[Ctrl + C]] atau [[Alt + Tab]]</div>
						</div>
						<div className='bg-white p-1.5 border border-black rounded'>
							<span className='font-bold text-black'>Stabilo / Sorot:</span>
							<div className='text-slate-600'>==kata kunci== atau ==hijau:sukses==</div>
						</div>
						<div className='bg-white p-1.5 border border-black rounded'>
							<span className='font-bold text-black'>Warna Teks:</span>
							<div className='text-slate-600'>{`{merah:awas}`} atau {`{hijau:trik}`}</div>
						</div>
					</div>
					<p className='text-[10px] text-slate-600 pt-1'>
						* Tip: Cukup <strong>blok kata</strong> yang ingin diformat di kotak teks, lalu klik tombol di toolbar atas!
					</p>
				</div>
			)}

			{/* Konten Utama: Editor atau Live Preview */}
			{activeTab === 'editor' ? (
				<div>
					<textarea
						ref={textareaRef}
						value={value}
						onChange={(e) => {
							onChange(e.target.value);
							updateSelectionState();
						}}
						onSelect={updateSelectionState}
						onKeyUp={updateSelectionState}
						onClick={updateSelectionState}
						onScroll={updateSelectionState}
						onKeyDown={handleKeyDown}
						rows={rows}
						placeholder={placeholder}
						className='w-full px-3 py-2.5 text-xs font-mono bg-white focus:bg-yellow-50/50 focus:outline-none resize-y min-h-[90px] leading-relaxed block'
					/>
					<div className='px-3 py-1 bg-slate-50 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex items-center justify-between'>
						<span>Gunakan tombol toolbar di atas atau shortcut keyboard (Ctrl+B, Ctrl+I, Ctrl+U).</span>
						<span>{value ? `${value.length} karakter` : 'Kosong'}</span>
					</div>
				</div>
			) : (
				<div className='p-3.5 bg-slate-100 min-h-[120px]'>
					<p className='font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1'>
						<span>👁️</span> Pratinjau Tampilan di Layar Siswa:
					</p>
					{value && value.trim() ? (
						<RichTipsRenderer content={value} compact={false} />
					) : (
						<div className='p-4 bg-white border border-dashed border-slate-400 text-center font-mono text-xs text-slate-400'>
							Belum ada teks tips. Tulis sesuatu di tab Editor untuk melihat pratinjaunya.
						</div>
					)}
				</div>
			)}
		</div>
	);
}
