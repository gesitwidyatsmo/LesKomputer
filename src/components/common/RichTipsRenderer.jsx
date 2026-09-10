'use client';

import React from 'react';

/**
 * Mem-parse teks inline menjadi elemen React:
 * - Bold: **teks** atau <b>teks</b>
 * - Italic: *teks* atau <i>teks</i>
 * - Underline: <u>teks</u> atau __teks__
 * - Strikethrough: ~~teks~~ atau <s>teks</s>
 * - Stabilo/Highlight: ==teks== atau ==warna:teks== (kuning, hijau, biru, pink)
 * - Shortcut Keyboard: [[Ctrl + C]] atau <kbd>Ctrl + C</kbd>
 * - Warna Teks: {merah:teks}, {hijau:teks}, {biru:teks}, {ungu:teks}, {oranye:teks} atau [color=red]teks[/color]
 */
export function renderFormattedInline(rawText) {
	if (!rawText) return null;

	const tokenRegex = /(\[\[[^\]\r\n]+?\]\]|<kbd>[\s\S]+?<\/kbd>|==(?:(?:kuning|yellow|hijau|green|biru|blue|pink):)?[^=\r\n]+?==|<mark(?: class="[^"]*")?>[\s\S]+?<\/mark>|\*\*[^\*\r\n]+?\*\*|<b>[\s\S]+?<\/b>|__[^_\r\n]+?__|<u>[\s\S]+?<\/u>|~~[^~\r\n]+?~~|<s>[\s\S]+?<\/s>|\*(?!\*)[^\*\r\n]+?\*|<i>[\s\S]+?<\/i>|\{(?:merah|red|hijau|green|biru|blue|ungu|purple|oranye|orange):[\s\S]+?\}|\[color=(?:red|green|blue|purple|orange)\][\s\S]+?\[\/color\])/gu;

	const parts = rawText.split(tokenRegex);

	return parts.map((part, index) => {
		if (!part) return null;

		// 1. Shortcut Keyboard: [[Ctrl + C]] atau <kbd>...</kbd>
		const kbdMatch = part.match(/^\[\[([\s\S]+?)\]\]$/) || part.match(/^<kbd>([\s\S]+?)<\/kbd>$/i);
		if (kbdMatch) {
			const keys = kbdMatch[1].split('+').map((k) => k.trim());
			return (
				<span key={index} className='inline-flex items-center gap-1 mx-1 align-baseline select-none'>
					{keys.map((keyStr, kIdx) => (
						<React.Fragment key={kIdx}>
							{kIdx > 0 && <span className='text-[10px] sm:text-xs font-black text-slate-800 font-mono'>+</span>}
							<kbd className='px-1.5 py-0.5 text-[11px] sm:text-xs font-mono font-black text-black bg-white border-2 border-black rounded shadow-[1.5px_1.5px_0px_0px_#000] inline-block leading-none tracking-wide'>
								{keyStr}
							</kbd>
						</React.Fragment>
					))}
				</span>
			);
		}

		// 2. Stabilo / Highlight: ==teks== atau ==warna:teks== atau <mark>...</mark>
		const markCustom = part.match(/^==(?:(kuning|yellow|hijau|green|biru|blue|pink):)?([\s\S]+?)==$/);
		const markHtml = part.match(/^<mark(?: class="([^"]*)")?>([\s\S]+?)<\/mark>$/i);
		if (markCustom || markHtml) {
			let color = 'yellow';
			let text = '';
			if (markCustom) {
				color = markCustom[1] || 'yellow';
				text = markCustom[2];
			} else {
				const cls = markHtml[1] || '';
				if (cls.includes('green') || cls.includes('emerald') || cls.includes('hijau')) color = 'green';
				else if (cls.includes('blue') || cls.includes('cyan') || cls.includes('biru')) color = 'blue';
				else if (cls.includes('pink') || cls.includes('rose')) color = 'pink';
				text = markHtml[2];
			}

			let bgClass = 'bg-yellow-300 text-black border-amber-400';
			if (color === 'hijau' || color === 'green') bgClass = 'bg-emerald-300 text-black border-emerald-400';
			if (color === 'biru' || color === 'blue') bgClass = 'bg-cyan-300 text-black border-cyan-400';
			if (color === 'pink') bgClass = 'bg-rose-300 text-black border-rose-400';

			return (
				<mark key={index} className={`px-1.5 py-0.5 font-bold rounded border ${bgClass} shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]`}>
					{renderFormattedInline(text)}
				</mark>
			);
		}

		// 3. Warna Teks: {warna:teks} atau [color=warna]teks[/color]
		const colorMatch1 = part.match(/^\{(merah|red|hijau|green|biru|blue|ungu|purple|oranye|orange):([\s\S]+?)\}$/);
		const colorMatch2 = part.match(/^\[color=(red|green|blue|purple|orange)\]([\s\S]+?)\[\/color\]$/i);
		if (colorMatch1 || colorMatch2) {
			const color = (colorMatch1 ? colorMatch1[1] : colorMatch2[1]).toLowerCase();
			const text = colorMatch1 ? colorMatch1[2] : colorMatch2[2];

			let textClass = 'text-black';
			if (color === 'merah' || color === 'red') textClass = 'text-rose-600 font-bold';
			if (color === 'hijau' || color === 'green') textClass = 'text-emerald-700 font-bold';
			if (color === 'biru' || color === 'blue') textClass = 'text-blue-600 font-bold';
			if (color === 'ungu' || color === 'purple') textClass = 'text-purple-700 font-bold';
			if (color === 'oranye' || color === 'orange') textClass = 'text-amber-700 font-bold';

			return (
				<span key={index} className={textClass}>
					{renderFormattedInline(text)}
				</span>
			);
		}

		// 4. Bold: **teks** atau <b>...</b>
		const boldMatch = part.match(/^\*\*([^\*\r\n]+?)\*\*$/) || part.match(/^<b>([\s\S]+?)<\/b>$/i);
		if (boldMatch) {
			return (
				<strong key={index} className='font-black text-black'>
					{renderFormattedInline(boldMatch[1])}
				</strong>
			);
		}

		// 5. Underline: <u>...</u> atau __...__
		const underlineMatch = part.match(/^<u>([\s\S]+?)<\/u>$/i) || part.match(/^__([^_\r\n]+?)__$/);
		if (underlineMatch) {
			return (
				<span key={index} className='underline underline-offset-2 decoration-2 decoration-black/60 font-medium'>
					{renderFormattedInline(underlineMatch[1])}
				</span>
			);
		}

		// 6. Strikethrough: ~~teks~~ atau <s>...</s>
		const strikeMatch = part.match(/^~~([^~\r\n]+?)~~$/) || part.match(/^<s>([\s\S]+?)<\/s>$/i);
		if (strikeMatch) {
			return (
				<del key={index} className='line-through decoration-black/60 text-slate-600'>
					{renderFormattedInline(strikeMatch[1])}
				</del>
			);
		}

		// 7. Italic: *teks* atau <i>...</i>
		const italicMatch = part.match(/^\*(?!\*)([^\*\r\n]+?)\*$/) || part.match(/^<i>([\s\S]+?)<\/i>$/i);
		if (italicMatch) {
			return (
				<em key={index} className='italic'>
					{renderFormattedInline(italicMatch[1])}
				</em>
			);
		}

		return <React.Fragment key={index}>{part}</React.Fragment>;
	});
}

/**
 * Komponen RichTipsRenderer
 * Merender konten Tips Cepat dari Guru secara bersih dan alami tanpa bullet otomatis.
 */
export default function RichTipsRenderer({ content, compact = false, showHeader = true }) {
	if (!content || !String(content).trim()) return null;

	const rawStr = String(content).trim();

	// Bersihkan prefix tag legacy jika ada di data lama
	const cleanContent = rawStr
		.replace(/^\[(?:TIPS|SHORTCUT|WARNING|PERINGATAN|SUCCESS|KIAT)\]\s*/i, '');

	// Membagi baris
	const rawLines = cleanContent
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);

	return (
		<div
			className={`${compact ? 'p-3' : 'p-4'} bg-amber-100 border-2 border-black rounded-lg ${
				compact ? 'shadow-[2px_2px_0px_0px_#000]' : 'shadow-[3px_3px_0px_0px_#000]'
			}`}>
			{showHeader && (
				<div className={`font-heading ${compact ? 'text-[11px]' : 'text-xs'} font-black text-black uppercase mb-3 border-b border-black/20 pb-2`}>
					<span>Tips Cepat dari Guru</span>
				</div>
			)}

			<div className={`${compact ? 'space-y-1.5' : 'space-y-2'}`}>
				{rawLines.map((line, idx) => (
					<p key={idx} className={`${compact ? 'text-xs' : 'text-xs sm:text-sm'} text-slate-900 leading-relaxed font-medium`}>
						{renderFormattedInline(line)}
					</p>
				))}
			</div>
		</div>
	);
}
