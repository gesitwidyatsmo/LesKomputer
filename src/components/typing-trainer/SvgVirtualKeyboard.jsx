'use client';

import React, { useMemo } from 'react';

// Map character to target SVG key path ID
const CHAR_TO_KEY_ID = {
	// Row 1 (Numbers & symbols)
	'`': 'tilda',
	'~': 'tilda',
	1: 'key-1',
	'!': 'key-1',
	2: 'key-2',
	'@': 'key-2',
	3: 'key-3',
	'#': 'key-3',
	4: 'key-4',
	$: 'key-4',
	5: 'key-5',
	'%': 'key-5',
	6: 'key-6',
	'^': 'key-6',
	7: 'key-7',
	'&': 'key-7',
	8: 'key-8',
	'*': 'key-8',
	9: 'key-9',
	'(': 'key-9',
	0: 'key-0',
	')': 'key-0',
	'-': 'minus',
	_: 'minus',
	'=': 'equal',
	'+': 'equal',
	backspace: 'backspace',

	// Row 2 (QWERTY)
	tab: 'tab',
	q: 'q',
	w: 'w',
	e: 'e',
	r: 'r',
	t: 't',
	y: 'y',
	u: 'u',
	i: 'i',
	o: 'o',
	p: 'p',
	'[': 'open-bracket',
	'{': 'open-bracket',
	']': 'close-bracket',
	'}': 'close-bracket',
	'\\': 'backslash',
	'|': 'backslash',

	// Row 3 (ASDF)
	capslock: 'capslock',
	a: 'a',
	s: 's',
	d: 'd',
	f: 'f',
	g: 'g',
	h: 'h',
	j: 'j',
	k: 'k',
	l: 'l',
	';': 'semicolon',
	':': 'semicolon',
	"'": 'quote',
	'"': 'quote',
	enter: 'enter',
	'\n': 'enter',

	// Row 4 (ZXCV)
	shiftleft: 'shift-left',
	z: 'z',
	x: 'x',
	c: 'c',
	v: 'v',
	b: 'b',
	n: 'n',
	m: 'm',
	',': 'comma',
	'<': 'comma',
	'.': 'dot',
	'>': 'dot',
	'/': 'slash',
	'?': 'slash',
	shiftright: 'shift-right',

	// Row 5 (Bottom)
	control: 'control',
	'option-left': 'option-left',
	' ': 'space',
	space: 'space',
	'option-right': 'option-right',
};

// Shift symbols that require holding Shift
const SHIFT_SYMBOLS = new Set(['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '{', '}', '|', ':', '"', '<', '>', '?']);

// Finger zones for finger coloring option
const KEY_FINGER_COLORS = {
	// Left Pinky (Rose)
	tilda: '#fb7185',
	'key-1': '#fb7185',
	tab: '#fb7185',
	q: '#fb7185',
	capslock: '#fb7185',
	a: '#fb7185',
	'shift-left': '#fb7185',
	z: '#fb7185',
	control: '#fb7185',

	// Left Ring (Orange)
	'key-2': '#fb923c',
	w: '#fb923c',
	s: '#fb923c',
	x: '#fb923c',
	'option-left': '#fb923c',

	// Left Middle (Amber)
	'key-3': '#fcd34d',
	e: '#fcd34d',
	d: '#fcd34d',
	c: '#fcd34d',

	// Left Index (Emerald)
	'key-4': '#34d399',
	'key-5': '#34d399',
	r: '#34d399',
	t: '#34d399',
	f: '#34d399',
	g: '#34d399',
	v: '#34d399',
	b: '#34d399',

	// Thumbs (Cyan)
	space: '#67e8f9',

	// Right Index (Cyan / Sky)
	'key-6': '#38bdf8',
	'key-7': '#38bdf8',
	y: '#38bdf8',
	u: '#38bdf8',
	h: '#38bdf8',
	j: '#38bdf8',
	n: '#38bdf8',
	m: '#38bdf8',

	// Right Middle (Blue)
	'key-8': '#60a5fa',
	i: '#60a5fa',
	k: '#60a5fa',
	comma: '#60a5fa',

	// Right Ring (Indigo)
	'key-9': '#818cf8',
	o: '#818cf8',
	l: '#818cf8',
	dot: '#818cf8',

	// Right Pinky (Purple)
	'key-0': '#c084fc',
	minus: '#c084fc',
	equal: '#c084fc',
	backspace: '#c084fc',
	p: '#c084fc',
	'open-bracket': '#c084fc',
	'close-bracket': '#c084fc',
	backslash: '#c084fc',
	semicolon: '#c084fc',
	quote: '#c084fc',
	enter: '#c084fc',
	slash: '#c084fc',
	'shift-right': '#c084fc',
	'option-right': '#c084fc',
};

export default function SvgVirtualKeyboard({ currentChar = '', pressedKeys = new Set(), hasError = false, colorByFinger = false, showHands = true, handSvgPath = '' }) {
	// Determine target key path ID from currentChar
	const { targetKeyId, needShiftRight, needShiftLeft } = useMemo(() => {
		if (!currentChar) return { targetKeyId: null, needShiftRight: false, needShiftLeft: false };

		const lower = currentChar.toLowerCase();
		const isUppercase = currentChar >= 'A' && currentChar <= 'Z';
		const isShiftSym = SHIFT_SYMBOLS.has(currentChar);
		const keyId = CHAR_TO_KEY_ID[lower] || CHAR_TO_KEY_ID[currentChar] || null;

		// When typing uppercase or shift symbol:
		// Left-side keys use right shift, right-side keys use left shift
		let sRight = false;
		let sLeft = false;
		if (isUppercase || isShiftSym) {
			if (['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b', 'key-1', 'key-2', 'key-3', 'key-4', 'key-5', 'tilda'].includes(keyId)) {
				sRight = true;
			} else {
				sLeft = true;
			}
		}

		return { targetKeyId: keyId, needShiftRight: sRight, needShiftLeft: sLeft };
	}, [currentChar]);

	// Check if a specific SVG path is active or pressed
	const getKeyStatus = (keyId) => {
		const isTarget = targetKeyId === keyId || (needShiftRight && keyId === 'shift-right') || (needShiftLeft && keyId === 'shift-left');

		// Physical keypress match
		let isPressed = false;
		if (keyId === 'space' && pressedKeys.has(' ')) isPressed = true;
		else if (pressedKeys.has(keyId)) isPressed = true;
		else if (currentChar && CHAR_TO_KEY_ID[currentChar.toLowerCase()] === keyId && pressedKeys.has(currentChar.toLowerCase())) {
			isPressed = true;
		}

		return { isTarget, isPressed };
	};

	const getPathClass = (keyId) => {
		const { isTarget, isPressed } = getKeyStatus(keyId);
		let classes = 'edc-st0 transition-all duration-150';

		if (isTarget) {
			classes += hasError ? ' incorrect' : ' active';
		} else if (isPressed) {
			classes += ' pressed';
		}

		return classes;
	};

	const getPathStyle = (keyId) => {
		const { isTarget, isPressed } = getKeyStatus(keyId);

		if (isTarget) {
			return hasError ? { fill: '#f87171', stroke: '#dc2626', strokeWidth: '2' } : { fill: '#79bbff', stroke: '#2563eb', strokeWidth: '2.5', filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.7))' };
		}

		if (isPressed) {
			return { fill: '#1e293b', stroke: '#0f172a', strokeWidth: '1.5' };
		}

		if (colorByFinger && KEY_FINGER_COLORS[keyId]) {
			return { fill: KEY_FINGER_COLORS[keyId] + '33', stroke: '#475569', strokeWidth: '0.8' };
		}

		return { fill: '#ffffff', stroke: '#334155', strokeWidth: '0.8' };
	};

	return (
		<div className='w-full flex items-center justify-center select-none'>
			<div className='w-full max-w-3xl relative'>
				<svg
					viewBox='0 0 683.3 254'
					xmlns='http://www.w3.org/2000/svg'
					className='w-full h-auto drop-shadow-md'
					style={{ overflow: 'visible' }}>
					<style type='text/css'>{`
            .edc-st0 {
              stroke-miterlimit: 10;
              transition: all 0.1s ease;
            }
            .edc-st1 {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              font-weight: 700;
              user-select: none;
              pointer-events: none;
            }
            .edc-st2 {
              fill: #0f172a;
              font-size: 15px;
            }
            .b { font-size: 20px; font-weight: 800; }
            .b2 { font-size: 19px; font-weight: 800; }
            .s { font-size: 10.5px; font-weight: 700; text-transform: uppercase; fill: #475569; }
            .sym { font-size: 12px; fill: #64748b; font-weight: 600; }
            
            path.active {
              fill: #79bbff !important;
              stroke: #1d4ed8 !important;
              stroke-width: 2.5px !important;
            }
            path.incorrect {
              fill: #f87171 !important;
              stroke: #b91c1c !important;
            }
            path.pressed {
              fill: #0f172a !important;
            }
            
            .text-active {
              fill: #ffffff !important;
              font-weight: 900 !important;
            }
            .text-pressed {
              fill: #facc15 !important;
            }
          `}</style>

					{/* ── 1. KEYBOARD PATHS (Vector ANSI Keys) ── */}
					<g id='keys'>
						<path
							id='tilda'
							className={getPathClass('tilda')}
							style={getPathStyle('tilda')}
							d='M58.4,53.7c0,1.7-1.4,3-3,3H18.9c-1.6,0-3-1.3-3-3V18.3c0-1.7,1.3-3,3-3h36.5c1.6,0,3,1.3,3,3V53.7z'
						/>
						<path
							id='key-1'
							className={getPathClass('key-1')}
							style={getPathStyle('key-1')}
							d='M103.4,53.7c0,1.7-1.3,3-3,3H63.9c-1.7,0-3-1.3-3-3V18.3c0-1.6,1.3-3,3-3h36.5c1.7,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='key-2'
							className={getPathClass('key-2')}
							style={getPathStyle('key-2')}
							d='M148.4,53.7c0,1.7-1.4,3-3,3h-36.5c-1.6,0-3-1.3-3-3V18.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='key-3'
							className={getPathClass('key-3')}
							style={getPathStyle('key-3')}
							d='M193.4,53.7c0,1.7-1.4,3-3,3h-36.5c-1.7,0-3-1.3-3-3V18.3c0-1.6,1.3-3,3-3h36.5c1.6,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='key-4'
							className={getPathClass('key-4')}
							style={getPathStyle('key-4')}
							d='M238.4,53.7c0,1.7-1.4,3-3,3H199c-1.7,0-3-1.3-3-3V18.3c0-1.7,1.3-3,3-3h36.5c1.6,0,3,1.3,3,3V53.7z'
						/>
						<path
							id='key-5'
							className={getPathClass('key-5')}
							style={getPathStyle('key-5')}
							d='M283.4,53.7c0,1.7-1.3,3-3,3h-36.5c-1.7,0-3-1.3-3-3V18.3c0-1.7,1.3-3,3-3h36.5c1.7,0,3,1.3,3,3V53.7z'
						/>
						<path
							id='key-6'
							className={getPathClass('key-6')}
							style={getPathStyle('key-6')}
							d='M328.4,53.7c0,1.7-1.3,3-3,3h-36.5c-1.6,0-3-1.3-3-3V18.3c0-1.7,1.4-3,3-3h36.5c1.7,0,3,1.3,3,3V53.7z'
						/>
						<path
							id='key-7'
							className={getPathClass('key-7')}
							style={getPathStyle('key-7')}
							d='M373.4,53.7c0,1.7-1.3,3-3,3h-36.5c-1.6,0-3-1.3-3-3V18.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='key-8'
							className={getPathClass('key-8')}
							style={getPathStyle('key-8')}
							d='M418.4,53.7c0,1.7-1.3,3-3,3h-36.5c-1.6,0-3-1.3-3-3V18.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='key-9'
							className={getPathClass('key-9')}
							style={getPathStyle('key-9')}
							d='M463.4,53.7c0,1.7-1.3,3-3,3h-36.5c-1.6,0-3-1.3-3-3V18.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='key-0'
							className={getPathClass('key-0')}
							style={getPathStyle('key-0')}
							d='M508.4,53.7c0,1.7-1.3,3-3,3h-36.5c-1.6,0-3-1.3-3-3V18.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='minus'
							className={getPathClass('minus')}
							style={getPathStyle('minus')}
							d='M553.4,53.7c0,1.7-1.4,3-3,3h-36.5c-1.7,0-3-1.3-3-3V18.3c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V53.7z'
						/>
						<path
							id='equal'
							className={getPathClass('equal')}
							style={getPathStyle('equal')}
							d='M598.4,53.7c0,1.7-1.4,3-3,3h-36.5c-1.7,0-3-1.3-3-3V18.3c0-1.6,1.3-3,3-3h36.5c1.6,0,3,1.4,3,3V53.7z'
						/>
						<path
							id='backspace'
							className={getPathClass('backspace')}
							style={getPathStyle('backspace')}
							d='M668.8,53.7c0,1.7-1.3,3-3,3h-61.9c-1.7,0-3-1.3-3-3V18.3c0-1.6,1.3-3,3-3h61.9c1.7,0,3,1.4,3,3V53.7z'
						/>

						{/* Row 2 */}
						<path
							id='tab'
							className={getPathClass('tab')}
							style={getPathStyle('tab')}
							d='M81.7,97.6c0,1.6-1.3,3-3,3H18.9c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.3-3,3-3h59.8c1.7,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='q'
							className={getPathClass('q')}
							style={getPathStyle('q')}
							d='M126.7,97.6c0,1.6-1.3,3-3,3H87.2c-1.7,0-3-1.4-3-3V62.3c0-1.6,1.3-3,3-3h36.5c1.7,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='w'
							className={getPathClass('w')}
							style={getPathStyle('w')}
							d='M171.7,97.6c0,1.6-1.3,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='e'
							className={getPathClass('e')}
							style={getPathStyle('e')}
							d='M216.7,97.6c0,1.6-1.3,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.7,1.4-3,3-3h36.5c1.7,0,3,1.3,3,3V97.6z'
						/>
						<path
							id='r'
							className={getPathClass('r')}
							style={getPathStyle('r')}
							d='M261.7,97.6c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='t'
							className={getPathClass('t')}
							style={getPathStyle('t')}
							d='M306.7,97.6c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='y'
							className={getPathClass('y')}
							style={getPathStyle('y')}
							d='M351.7,97.6c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='u'
							className={getPathClass('u')}
							style={getPathStyle('u')}
							d='M396.7,97.6c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='i'
							className={getPathClass('i')}
							style={getPathStyle('i')}
							d='M441.7,97.6c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='o'
							className={getPathClass('o')}
							style={getPathStyle('o')}
							d='M486.7,97.6c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='p'
							className={getPathClass('p')}
							style={getPathStyle('p')}
							d='M531.7,97.6c0,1.6-1.3,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='open-bracket'
							className={getPathClass('open-bracket')}
							style={getPathStyle('open-bracket')}
							d='M576.7,97.6c0,1.6-1.3,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='close-bracket'
							className={getPathClass('close-bracket')}
							style={getPathStyle('close-bracket')}
							d='M621.7,97.6c0,1.6-1.3,3-3,3h-36.5c-1.6,0-3-1.4-3-3V62.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V97.6z'
						/>
						<path
							id='backslash'
							className={getPathClass('backslash')}
							style={getPathStyle('backslash')}
							d='M668.8,97.6c0,1.6-1.3,3-3,3h-38.6c-1.6,0-3-1.4-3-3V62.4c0-1.6,1.4-3,3-3h38.6c1.7,0,3,1.4,3,3V97.6z'
						/>

						{/* Row 3 (Home Row) */}
						<path
							id='capslock'
							className={getPathClass('capslock')}
							style={getPathStyle('capslock')}
							d='M92.4,141.5c0,1.6-1.3,3-3,3H18.9c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.3-3,3-3h70.4c1.7,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='a'
							className={getPathClass('a')}
							style={getPathStyle('a')}
							d='M137.4,141.5c0,1.6-1.4,3-3,3H97.9c-1.7,0-3-1.4-3-3v-35.4c0-1.7,1.3-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='s'
							className={getPathClass('s')}
							style={getPathStyle('s')}
							d='M182.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='d'
							className={getPathClass('d')}
							style={getPathStyle('d')}
							d='M227.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='f'
							className={getPathClass('f')}
							style={getPathStyle('f')}
							d='M272.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='g'
							className={getPathClass('g')}
							style={getPathStyle('g')}
							d='M317.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='h'
							className={getPathClass('h')}
							style={getPathStyle('h')}
							d='M362.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='j'
							className={getPathClass('j')}
							style={getPathStyle('j')}
							d='M407.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='k'
							className={getPathClass('k')}
							style={getPathStyle('k')}
							d='M452.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='l'
							className={getPathClass('l')}
							style={getPathStyle('l')}
							d='M497.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='semicolon'
							className={getPathClass('semicolon')}
							style={getPathStyle('semicolon')}
							d='M542.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.6,0-3-1.4-3-3v-35.4c0-1.7,1.4-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='quote'
							className={getPathClass('quote')}
							style={getPathStyle('quote')}
							d='M587.4,141.5c0,1.6-1.4,3-3,3h-36.5c-1.7,0-3-1.4-3-3v-35.4c0-1.7,1.3-3,3-3h36.5c1.6,0,3,1.3,3,3V141.5z'
						/>
						<path
							id='enter'
							className={getPathClass('enter')}
							style={getPathStyle('enter')}
							d='M668.8,141.5c0,1.6-1.3,3-3,3h-72.9c-1.7,0-3-1.4-3-3v-35.4c0-1.7,1.3-3,3-3h72.9c1.7,0,3,1.3,3,3V141.5z'
						/>

						{/* Row 4 */}
						<path
							id='shift-left'
							className={getPathClass('shift-left')}
							style={getPathStyle('shift-left')}
							d='M115.8,185.4c0,1.7-1.3,3-3,3H18.9c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.3-3,3-3h93.8c1.7,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='z'
							className={getPathClass('z')}
							style={getPathStyle('z')}
							d='M160.8,185.4c0,1.7-1.4,3-3,3h-36.5c-1.7,0-3-1.3-3-3v-35.3c0-1.7,1.3-3,3-3h36.5c1.6,0,3,1.3,3,3V185.4z'
						/>
						<path
							id='x'
							className={getPathClass('x')}
							style={getPathStyle('x')}
							d='M205.8,185.4c0,1.7-1.4,3-3,3h-36.5c-1.7,0-3-1.3-3-3v-35.3c0-1.6,1.3-3,3-3h36.5c1.6,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='c'
							className={getPathClass('c')}
							style={getPathStyle('c')}
							d='M250.8,185.4c0,1.7-1.4,3-3,3h-36.5c-1.7,0-3-1.3-3-3v-35.3c0-1.6,1.3-3,3-3h36.5c1.6,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='v'
							className={getPathClass('v')}
							style={getPathStyle('v')}
							d='M295.8,185.4c0,1.7-1.4,3-3,3h-36.5c-1.7,0-3-1.3-3-3v-35.3c0-1.6,1.3-3,3-3h36.5c1.6,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='b'
							className={getPathClass('b')}
							style={getPathStyle('b')}
							d='M340.8,185.4c0,1.7-1.4,3-3,3h-36.6c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.4-3,3-3h36.6c1.6,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='n'
							className={getPathClass('n')}
							style={getPathStyle('n')}
							d='M385.8,185.4c0,1.7-1.4,3-3,3h-36.5c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='m'
							className={getPathClass('m')}
							style={getPathStyle('m')}
							d='M430.8,185.4c0,1.7-1.4,3-3,3h-36.5c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='comma'
							className={getPathClass('comma')}
							style={getPathStyle('comma')}
							d='M475.8,185.4c0,1.7-1.4,3-3,3h-36.5c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.4-3,3-3h36.5c1.6,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='dot'
							className={getPathClass('dot')}
							style={getPathStyle('dot')}
							d='M520.8,185.4c0,1.7-1.3,3-3,3h-36.5c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='slash'
							className={getPathClass('slash')}
							style={getPathStyle('slash')}
							d='M565.8,185.4c0,1.7-1.3,3-3,3h-36.5c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.4-3,3-3h36.5c1.7,0,3,1.4,3,3V185.4z'
						/>
						<path
							id='shift-right'
							className={getPathClass('shift-right')}
							style={getPathStyle('shift-right')}
							d='M668.8,185.4c0,1.7-1.3,3-3,3h-94.5c-1.6,0-3-1.3-3-3v-35.3c0-1.6,1.4-3,3-3h94.5c1.7,0,3,1.4,3,3V185.4z'
						/>

						{/* Row 5 (Space row) */}
						<path
							id='control'
							className={getPathClass('control')}
							style={getPathStyle('control')}
							d='M105,236c0,1.6-1.3,3-3,3H18.9c-1.6,0-3-1.4-3-3v-42c0-1.7,1.3-3,3-3H102c1.7,0,3,1.3,3,3V236z'
						/>
						<path
							id='option-left'
							className={getPathClass('option-left')}
							style={getPathStyle('option-left')}
							d='M182.4,236c0,1.7-1.4,3-3,3h-68.8c-1.7,0-3-1.3-3-3v-42c0-1.7,1.3-3,3-3h68.8c1.6,0,3,1.3,3,3V236z'
						/>
						<path
							id='space'
							className={getPathClass('space')}
							style={getPathStyle('space')}
							d='M460.4,191c1.6,0,3,1.4,3,3v42c0,1.7-1.4,3-3,3H187.5c-1.6,0-3-1.3-3-3v-42c0-1.6,1.4-3,3-3H460.4z'
						/>
						<path
							id='option-right'
							className={getPathClass('option-right')}
							style={getPathStyle('option-right')}
							d='M531.8,191c1.7,0,3,1.4,3,3v42c0,1.7-1.3,3-3,3h-62.9c-1.6,0-3-1.3-3-3v-42c0-1.6,1.4-3,3-3H531.8z'
						/>
						<path
							id='control-right'
							className={getPathClass('control-right')}
							style={getPathStyle('control-right')}
							d='M668.8,236.1c0,1.7-1.3,3-3,3H540.3c-1.6,0-3-1.3-3-3v-42c0-1.6,1.4-3,3-3h125.5c1.7,0,3,1.4,3,3V236.1z'
						/>
					</g>

					{/* ── 2. TACTILE ANCHOR BUMPS (F & J Home-Row Dots/Bars) ── */}
					<rect
						x='250'
						y='137'
						width='8'
						height='2'
						rx='1'
						fill='#475569'
						opacity='0.8'
					/>
					<rect
						x='385'
						y='137'
						width='8'
						height='2'
						rx='1'
						fill='#475569'
						opacity='0.8'
					/>

					{/* ── 3. LETTER & SYMBOL LABELS (Typography Layer) ── */}
					<g id='letters'>
						{/* Number row symbols & numbers */}
						<text
							transform='matrix(1 0 0 1 33.49 31.8)'
							className='edc-st1 sym'>
							~
						</text>
						<text
							transform='matrix(1 0 0 1 35.80 50.6)'
							className='edc-st1 edc-st2'>
							`
						</text>

						<text
							transform='matrix(1 0 0 1 80.55 31.7)'
							className='edc-st1 sym'>
							!
						</text>
						<text
							transform='matrix(1 0 0 1 78.62 50.4)'
							className='edc-st1 edc-st2'>
							1
						</text>

						<text
							transform='matrix(1 0 0 1 119.85 30.4)'
							className='edc-st1 sym'>
							@
						</text>
						<text
							transform='matrix(1 0 0 1 123.29 51.1)'
							className='edc-st1 edc-st2'>
							2
						</text>

						<text
							transform='matrix(1 0 0 1 169.68 31.7)'
							className='edc-st1 sym'>
							#
						</text>
						<text
							transform='matrix(1 0 0 1 169.68 51.4)'
							className='edc-st1 edc-st2'>
							3
						</text>

						<text
							transform='matrix(1 0 0 1 213.07 31.2)'
							className='edc-st1 sym'>
							$
						</text>
						<text
							transform='matrix(1 0 0 1 213.07 51.4)'
							className='edc-st1 edc-st2'>
							4
						</text>

						<text
							transform='matrix(1 0 0 1 255.57 30.8)'
							className='edc-st1 sym'>
							%
						</text>
						<text
							transform='matrix(1 0 0 1 258.07 51.4)'
							className='edc-st1 edc-st2'>
							5
						</text>

						<text
							transform='matrix(1 0 0 1 303.95 32.4)'
							className='edc-st1 sym'>
							^
						</text>
						<text
							transform='matrix(1 0 0 1 303.28 51.0)'
							className='edc-st1 edc-st2'>
							6
						</text>

						<text
							transform='matrix(1 0 0 1 348.25 31.7)'
							className='edc-st1 sym'>
							&amp;
						</text>
						<text
							transform='matrix(1 0 0 1 349.50 51.0)'
							className='edc-st1 edc-st2'>
							7
						</text>

						<text
							transform='matrix(1 0 0 1 394.53 32.8)'
							className='edc-st1 sym'>
							*
						</text>
						<text
							transform='matrix(1 0 0 1 393.28 51.2)'
							className='edc-st1 edc-st2'>
							8
						</text>

						<text
							transform='matrix(1 0 0 1 440.30 30.6)'
							className='edc-st1 sym'>
							(
						</text>
						<text
							transform='matrix(1 0 0 1 438.57 51.2)'
							className='edc-st1 edc-st2'>
							9
						</text>

						<text
							transform='matrix(1 0 0 1 485.16 30.6)'
							className='edc-st1 sym'>
							)
						</text>
						<text
							transform='matrix(1 0 0 1 483.49 51.2)'
							className='edc-st1 edc-st2'>
							0
						</text>

						<text
							transform='matrix(1 0 0 1 528.75 25.5)'
							className='edc-st1 sym'>
							_
						</text>
						<text
							transform='matrix(1 0 0 1 530.40 50.4)'
							className='edc-st1 edc-st2'>
							-
						</text>

						<text
							transform='matrix(1 0 0 1 573.51 32.4)'
							className='edc-st1 sym'>
							+
						</text>
						<text
							transform='matrix(1 0 0 1 573.51 51.2)'
							className='edc-st1 edc-st2'>
							=
						</text>

						<text
							transform='matrix(1 0 0 1 614.46 44.1)'
							className='edc-st1 s'>
							⌫ Delete
						</text>

						{/* Row 2 (QWERTY letters) */}
						<text
							transform='matrix(1 0 0 1 33.34 84.2)'
							className='edc-st1 s'>
							Tab ⇥
						</text>

						<text
							transform='matrix(1 0 0 1 100.90 87.4)'
							className='edc-st1 edc-st2 b'>
							Q
						</text>
						<text
							transform='matrix(1 0 0 1 145.36 87.4)'
							className='edc-st1 edc-st2 b'>
							W
						</text>
						<text
							transform='matrix(1 0 0 1 190.59 87.4)'
							className='edc-st1 edc-st2 b'>
							E
						</text>
						<text
							transform='matrix(1 0 0 1 236.99 87.4)'
							className='edc-st1 edc-st2 b'>
							R
						</text>
						<text
							transform='matrix(1 0 0 1 280.60 87.4)'
							className='edc-st1 edc-st2 b'>
							T
						</text>
						<text
							transform='matrix(1 0 0 1 326.51 87.4)'
							className='edc-st1 edc-st2 b'>
							Y
						</text>
						<text
							transform='matrix(1 0 0 1 371.13 87.4)'
							className='edc-st1 edc-st2 b'>
							U
						</text>
						<text
							transform='matrix(1 0 0 1 418.55 87.4)'
							className='edc-st1 edc-st2 b'>
							I
						</text>
						<text
							transform='matrix(1 0 0 1 459.96 87.4)'
							className='edc-st1 edc-st2 b'>
							O
						</text>
						<text
							transform='matrix(1 0 0 1 506.93 87.4)'
							className='edc-st1 edc-st2 b'>
							P
						</text>

						<text
							transform='matrix(1 0 0 1 552.97 74.8)'
							className='edc-st1 sym'>
							&#123;
						</text>
						<text
							transform='matrix(1 0 0 1 553.39 94.4)'
							className='edc-st1 edc-st2'>
							[
						</text>

						<text
							transform='matrix(1 0 0 1 598.34 74.7)'
							className='edc-st1 sym'>
							&#125;
						</text>
						<text
							transform='matrix(1 0 0 1 598.76 94.4)'
							className='edc-st1 edc-st2'>
							]
						</text>

						<text
							transform='matrix(1 0 0 1 644.49 74.8)'
							className='edc-st1 sym'>
							|
						</text>
						<text
							transform='matrix(1 0 0 1 644.35 94.8)'
							className='edc-st1 edc-st2'>
							\
						</text>

						{/* Row 3 (ASDF Home row letters) */}
						<text
							transform='matrix(1 0 0 1 30.34 128.7)'
							className='edc-st1 s'>
							Caps 🔒
						</text>

						<text
							transform='matrix(1 0 0 1 112.13 131.3)'
							className='edc-st1 edc-st2 b'>
							A
						</text>
						<text
							transform='matrix(1 0 0 1 156.01 131.3)'
							className='edc-st1 edc-st2 b'>
							S
						</text>
						<text
							transform='matrix(1 0 0 1 201.52 131.3)'
							className='edc-st1 edc-st2 b'>
							D
						</text>
						<text
							transform='matrix(1 0 0 1 247.11 131.3)'
							className='edc-st1 edc-st2 b'>
							F
						</text>
						<text
							transform='matrix(1 0 0 1 289.47 131.3)'
							className='edc-st1 edc-st2 b'>
							G
						</text>
						<text
							transform='matrix(1 0 0 1 335.58 131.3)'
							className='edc-st1 edc-st2 b'>
							H
						</text>
						<text
							transform='matrix(1 0 0 1 382.26 131.3)'
							className='edc-st1 edc-st2 b'>
							J
						</text>
						<text
							transform='matrix(1 0 0 1 426.01 131.3)'
							className='edc-st1 edc-st2 b'>
							K
						</text>
						<text
							transform='matrix(1 0 0 1 470.87 131.3)'
							className='edc-st1 edc-st2 b'>
							L
						</text>

						<text
							transform='matrix(1 0 0 1 519.07 119.3)'
							className='edc-st1 sym'>
							:
						</text>
						<text
							transform='matrix(1 0 0 1 519.07 136.7)'
							className='edc-st1 edc-st2'>
							;
						</text>

						<text
							transform='matrix(1 0 0 1 565.62 120.3)'
							className='edc-st1 sym'>
							&quot;
						</text>
						<text
							transform='matrix(1 0 0 1 565.62 138.7)'
							className='edc-st1 edc-st2'>
							&apos;
						</text>

						<text
							transform='matrix(1 0 0 1 620.31 128.7)'
							className='edc-st1 s'>
							Enter ↵
						</text>

						{/* Row 4 (ZXCV bottom row letters) */}
						<text
							transform='matrix(1 0 0 1 40.34 172.0)'
							className='edc-st1 s'>
							Shift ⇧
						</text>

						<text
							transform='matrix(1 0 0 1 134.78 174.7)'
							className='edc-st1 edc-st2 b'>
							Z
						</text>
						<text
							transform='matrix(1 0 0 1 179.23 174.7)'
							className='edc-st1 edc-st2 b'>
							X
						</text>
						<text
							transform='matrix(1 0 0 1 222.54 174.7)'
							className='edc-st1 edc-st2 b'>
							C
						</text>
						<text
							transform='matrix(1 0 0 1 269.39 174.7)'
							className='edc-st1 edc-st2 b'>
							V
						</text>
						<text
							transform='matrix(1 0 0 1 314.00 174.7)'
							className='edc-st1 edc-st2 b'>
							B
						</text>
						<text
							transform='matrix(1 0 0 1 358.48 174.7)'
							className='edc-st1 edc-st2 b'>
							N
						</text>
						<text
							transform='matrix(1 0 0 1 401.68 174.7)'
							className='edc-st1 edc-st2 b'>
							M
						</text>

						<text
							transform='matrix(1 0 0 1 450.28 164.3)'
							className='edc-st1 sym'>
							&lt;
						</text>
						<text
							transform='matrix(1 0 0 1 451.32 180.0)'
							className='edc-st1 edc-st2 b2'>
							,
						</text>

						<text
							transform='matrix(1 0 0 1 494.92 164.3)'
							className='edc-st1 sym'>
							&gt;
						</text>
						<text
							transform='matrix(1 0 0 1 495.97 181.0)'
							className='edc-st1 edc-st2 b2'>
							.
						</text>

						<text
							transform='matrix(1 0 0 1 541.32 163.2)'
							className='edc-st1 sym'>
							?
						</text>
						<text
							transform='matrix(1 0 0 1 543.40 181.0)'
							className='edc-st1 edc-st2'>
							/
						</text>

						<text
							transform='matrix(1 0 0 1 608.82 172.0)'
							className='edc-st1 s'>
							Shift ⇧
						</text>

						{/* Row 5 (Control, Alt, Space, etc.) */}
						<text
							transform='matrix(1 0 0 1 44.34 220.4)'
							className='edc-st1 s'>
							Ctrl
						</text>
						<text
							transform='matrix(1 0 0 1 138.23 220.4)'
							className='edc-st1 s'>
							Alt
						</text>
						<text
							transform='matrix(1 0 0 1 300.78 220.4)'
							className='edc-st1 s'
							style={{ letterSpacing: '2px' }}>
							SPACE
						</text>
						<text
							transform='matrix(1 0 0 1 488.88 220.4)'
							className='edc-st1 s'>
							Alt
						</text>
						<text
							transform='matrix(1 0 0 1 590.88 220.4)'
							className='edc-st1 s'>
							Ctrl
						</text>
					</g>

					{/* ── 4. VECTOR HAND OVERLAY (Exact 1:1 Co-ordinate Alignment) ── */}
					{showHands && handSvgPath && (
						<g
							id='hands-overlay'
							className='pointer-events-none transition-all duration-100'>
							<image
								href={handSvgPath}
								x='-140' /* <-- GESER KIRI / KANAN (angka makin minus = makin ke kiri) */
								y='-160' /* <-- GESER ATAS / BAWAH (angka minus = makin ke atas) */
								width='1070' /* <-- LEBAR UKURAN TANGAN */
								height='670' /* <-- TINGGI UKURAN TANGAN */
								preserveAspectRatio='xMidYMin meet'
								style={{ opacity: 0.88 }} /* <-- TINGKAT TRANSPARANSI TANGAN */
							/>
						</g>
					)}
				</svg>
			</div>
		</div>
	);
}
