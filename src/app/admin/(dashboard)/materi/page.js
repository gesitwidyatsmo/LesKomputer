'use client';

import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { getMateriByModul, upsertMateri, uploadPDF, deleteMateri, upsertLampiran, deleteLampiran } from '@/lib/materiService';
import { getQuizByMateri, upsertQuiz, saveSoalPilihan, deleteQuiz } from '@/lib/quizService';
import { getSemuaModul, upsertModul, deleteModul, updateUrutanModul } from '@/lib/modulService';
import { Plus, Edit2, Trash2, BookOpen, FileText, Brain, Upload, Loader2, X, Layers, ChevronRight, Save, GripVertical, AlertCircle, Package } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ClientPortal from '@/components/ClientPortal';

// ─── Modul Form Modal ────────────────────────────────────────────────────────
function ModulModal({ modul, onClose, onSaved }) {
	const isEdit = !!modul?.id;
	const [form, setForm] = useState({
		id: modul?.id || '',
		nama: modul?.nama || '',
		deskripsi: modul?.deskripsi || '',
		icon: modul?.icon || '💻',
		total_pertemuan: modul?.total_pertemuan || 10,
		urutan: modul?.urutan ?? 0,
	});
	const [saving, setSaving] = useState(false);
	const [err, setErr] = useState('');

	const handleSave = async () => {
		if (!form.id.trim() || !form.nama.trim()) {
			setErr('ID dan Nama modul wajib diisi.');
			return;
		}
		setSaving(true);
		const { error } = await upsertModul({ ...form, urutan: Number(form.urutan), total_pertemuan: Number(form.total_pertemuan) });
		if (error) {
			setErr(error.message);
			setSaving(false);
			return;
		}
		onSaved();
	};

	return (
		<ClientPortal>
			<div className='fixed inset-0 z-[60] flex items-center justify-center p-4'>
				<div
					className='fixed inset-0 bg-black/70 backdrop-blur-xs'
					onClick={onClose}
				/>
				<div
					className='relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full max-h-[90vh] flex flex-col overflow-hidden'
					style={{ maxWidth: '650px' }}>
					
					{/* Window Titlebar */}
					<div className='flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0'>
						<div className='flex items-center gap-2'>
							<div className='flex gap-1.5'>
								<span className='w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block'></span>
								<span className='w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block'></span>
								<span className='w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block'></span>
							</div>
							<span>module_spec_editor.exe</span>
						</div>
						<button
							onClick={onClose}
							className='px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px]'>
							ESC [X]
						</button>
					</div>

					<div className='px-5 py-3 bg-yellow-100 border-b-2 border-black shrink-0'>
						<h3 className='font-heading font-black text-base uppercase text-black'>{isEdit ? 'Edit Modul Kursus' : 'Tambah Modul Kursus Baru'}</h3>
						<p className='font-mono text-xs text-slate-700 mt-0.5'>Konfigurasi cartridge kurikulum pembelajaran</p>
					</div>

				<div className='p-5 overflow-y-auto bg-[#FFFDF5] space-y-4'>
					{err && (
						<div className='flex items-center gap-2 text-xs font-mono font-bold text-black bg-rose-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2'>
							<AlertCircle className='w-4 h-4 shrink-0 text-black' /> {err}
						</div>
					)}

					<div className='space-y-4'>
						<div className='flex gap-3'>
							<div className='w-20 shrink-0'>
								<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>Icon</label>
								<input
									value={form.icon}
									onChange={(e) => setForm({ ...form, icon: e.target.value })}
									className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2 py-2 text-center text-2xl bg-white focus:bg-yellow-50 focus:outline-none'
									maxLength={2}
								/>
							</div>
							<div className='flex-1'>
								<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>Nama Modul *</label>
								<input
									value={form.nama}
									onChange={(e) => setForm({ ...form, nama: e.target.value })}
									placeholder='cth: MS Office, Desain Grafis'
									className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-medium bg-white focus:bg-yellow-50 focus:outline-none'
								/>
							</div>
						</div>

						<div>
							<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>ID / Slug * {isEdit && <span className='text-slate-500'>[LOCKED]</span>}</label>
							<input
								value={form.id}
								onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
								placeholder='cth: ms-office'
								disabled={isEdit}
								className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm disabled:bg-slate-200 disabled:text-slate-600 font-mono font-bold'
							/>
						</div>

						<div>
							<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>Deskripsi Ringkas</label>
							<textarea
								value={form.deskripsi}
								onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
								rows={2}
								className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm bg-white focus:bg-yellow-50 focus:outline-none font-medium'
							/>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>Total Pertemuan</label>
								<input
									type='number'
									min={1}
									value={form.total_pertemuan}
									onChange={(e) => setForm({ ...form, total_pertemuan: e.target.value })}
									className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-mono font-bold bg-white focus:bg-yellow-50 focus:outline-none'
								/>
							</div>
							<div>
								<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>Urutan Tampil</label>
								<input
									type='number'
									min={0}
									value={form.urutan}
									onChange={(e) => setForm({ ...form, urutan: e.target.value })}
									className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-mono font-bold bg-white focus:bg-yellow-50 focus:outline-none'
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='flex gap-3 p-4 border-t-2 border-black bg-white justify-end shrink-0'>
					<button
						onClick={onClose}
						className='px-4 py-2 text-xs font-mono font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
						Batal
					</button>
					<button
						onClick={handleSave}
						disabled={saving}
						className='inline-flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all cursor-pointer'>
						{saving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
						Simpan Modul
					</button>
				</div>
			</div>
		</div>
	</ClientPortal>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManajemenMateri() {
	// ── Modul state ──
	const [modulList, setModulList] = useState([]);
	const [selectedModul, setSelectedModul] = useState(null);
	const [modulModalOpen, setModulModalOpen] = useState(false);
	const [editingModul, setEditingModul] = useState(null);
	const [modulLoading, setModulLoading] = useState(true);

	// ── Materi state ──
	const [materiList, setMateriList] = useState([]);
	const [materiLoading, setMateriLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('konten');
	const [isSaving, setIsSaving] = useState(false);

	const [editData, setEditData] = useState({
		id: null,
		modul_id: '',
		pertemuan: 1,
		judul: '',
		deskripsi: '',
		tipe_konten: 'materi_quiz',
		topik: [],
		tips: '',
		durasi: '2 jam',
	});
	const [uploadFile, setUploadFile] = useState(null);
	const [lampiranAwal, setLampiranAwal] = useState([]);
	const [quizData, setQuizData] = useState({
		id: null,
		judul: 'Quiz Pertemuan',
		durasi_menit: 0,
		passing_score: 75,
		soal: [],
	});

	// ── Preview accordion state ──
	const [expandedId, setExpandedId] = useState(null);
	const [previewQuiz, setPreviewQuiz] = useState({});
	const [previewLoading, setPreviewLoading] = useState({});

	// ── Load modul on mount ──
	const loadModul = useCallback(async () => {
		setModulLoading(true);
		const { data } = await getSemuaModul();
		if (data) {
			setModulList(data);
			if (!selectedModul && data.length > 0) setSelectedModul(data[0]);
		}
		setModulLoading(false);
	}, []);

	useEffect(() => {
		loadModul();
	}, [loadModul]);

	// ── Load materi when modul changes ──
	const loadMateri = useCallback(async (modulId) => {
		if (!modulId) return;
		setMateriLoading(true);
		const { data } = await getMateriByModul(modulId);
		if (data) setMateriList(data);
		setMateriLoading(false);
	}, []);

	useEffect(() => {
		if (selectedModul) loadMateri(selectedModul.id);
	}, [selectedModul, loadMateri]);

	// ── Modul CRUD ──
	const handleModulSaved = async () => {
		setModulModalOpen(false);
		setEditingModul(null);
		await loadModul();
	};

	const handleDeleteModul = async (modul) => {
		const result = await Swal.fire({
			title: 'Hapus Modul?',
			text: `Hapus modul "${modul.nama}"? Semua materi di modul ini akan ikut terhapus!`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#000000',
			confirmButtonText: 'Ya, Hapus!',
		});
		if (!result.isConfirmed) return;

		await deleteModul(modul.id);
		if (selectedModul?.id === modul.id) setSelectedModul(null);
		await loadModul();
		Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Modul telah dihapus.', timer: 1500, showConfirmButton: false });
	};

	// ── Preview toggle ──
	const handleTogglePreview = async (materi) => {
		const isOpen = expandedId === materi.id;
		setExpandedId(isOpen ? null : materi.id);

		if (!isOpen && materi.tipe_konten !== 'materi_saja' && !previewQuiz[materi.id]) {
			setPreviewLoading((prev) => ({ ...prev, [materi.id]: true }));
			const { data: qData } = await getQuizByMateri(materi.id);
			setPreviewQuiz((prev) => ({ ...prev, [materi.id]: qData ?? null }));
			setPreviewLoading((prev) => ({ ...prev, [materi.id]: false }));
		}
	};

	// ── Drag & Drop ──
	const onDragEnd = async (result) => {
		if (!result.destination) return;

		const items = Array.from(modulList);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setModulList(items);

		const updatedList = items.map((item, index) => ({
			id: item.id,
			urutan: index
		}));

		await updateUrutanModul(updatedList);
	};

	// ── Materi handlers ──
	const handleAdd = () => {
		if (!selectedModul) return;
		const nextPertemuan = materiList.length > 0 ? Math.max(...materiList.map((m) => m.pertemuan || 0)) + 1 : 1;
		setEditData({
			id: null,
			modul_id: selectedModul.id,
			pertemuan: nextPertemuan,
			judul: '',
			deskripsi: '',
			tipe_konten: 'materi_quiz',
			topik: [],
			tips: '',
			durasi: '2 jam',
		});
		setLampiranAwal([]);
		setQuizData({ id: null, judul: `Quiz Pertemuan ${materiList.length + 1}`, durasi_menit: 0, passing_score: 75, soal: [] });
		setActiveTab('konten');
		setIsModalOpen(true);
	};

	const handleEdit = async (materi) => {
		setEditData({
			id: materi.id,
			modul_id: materi.modul_id,
			pertemuan: materi.pertemuan,
			judul: materi.judul,
			deskripsi: materi.deskripsi || '',
			tipe_konten: materi.tipe_konten || 'materi_quiz',
			topik: Array.isArray(materi.topik) ? materi.topik : JSON.parse(materi.topik || '[]'),
			tips: materi.tips || '',
			durasi: materi.durasi || '2 jam',
		});
		setLampiranAwal(materi.lampiran || []);
		if (materi.tipe_konten !== 'materi_saja') {
			const { data: qData } = await getQuizByMateri(materi.id);
			setQuizData(qData ?? { id: null, judul: `Quiz ${materi.judul}`, durasi_menit: 0, passing_score: 75, soal: [] });
		}
		setActiveTab('konten');
		setIsModalOpen(true);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const materiPayload = {
				modul_id: editData.modul_id,
				pertemuan: editData.pertemuan,
				judul: editData.judul,
				deskripsi: editData.deskripsi,
				topik: editData.topik,
				tips: editData.tips,
				tipe_konten: editData.tipe_konten,
				durasi: editData.durasi,
			};
			if (editData.id) materiPayload.id = editData.id;

			const { data: savedMateri, error } = await upsertMateri(materiPayload);
			if (error) throw error;
			if (!savedMateri) throw new Error('Data materi gagal disimpan atau dikembalikan kosong oleh server.');
			const materiId = savedMateri.id;

			if (uploadFile) {
				const res = await uploadPDF(uploadFile, editData.modul_id, uploadFile.name);
				if (res.url) {
					await upsertLampiran({
						materi_id: materiId,
						nama_file: uploadFile.name,
						storage_path: res.path,
						url_publik: res.url,
						ukuran_mb: +(uploadFile.size / (1024 * 1024)).toFixed(2),
					});
				}
			}

			if (editData.tipe_konten !== 'materi_saja') {
				const quizPayload = {
					materi_id: materiId,
					judul: quizData.judul,
					durasi_menit: quizData.durasi_menit,
					passing_score: quizData.passing_score,
				};
				if (quizData.id) quizPayload.id = quizData.id;

				const { data: savedQuiz, error: quizError } = await upsertQuiz(quizPayload);
				if (quizError) throw quizError;
				if (!savedQuiz) throw new Error('Data quiz gagal disimpan atau dikembalikan kosong oleh server.');
				if (savedQuiz && quizData.soal.length > 0) {
					await saveSoalPilihan(savedQuiz.id, quizData.soal);
				}
			}

			setIsModalOpen(false);
			setUploadFile(null);
			loadMateri(selectedModul.id);
		} catch (err) {
			console.error('Save failed:', err);
			const errMsg = err?.message || err?.details || (typeof err === 'string' ? err : JSON.stringify(err));
			Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan materi: ' + errMsg });
		}
		setIsSaving(false);
	};

	const handleDelete = async (id) => {
		const result = await Swal.fire({
			title: 'Hapus Materi?',
			text: 'Hapus materi ini? Semua data terkait (quiz, PDF) akan terhapus.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#000000',
			confirmButtonText: 'Ya, Hapus!',
		});
		if (!result.isConfirmed) return;

		await deleteMateri(id);
		await loadMateri(selectedModul.id);
		Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Materi telah dihapus.', timer: 1500, showConfirmButton: false });
	};

	return (
		<div className='flex flex-col h-full space-y-6'>
			{/* Page Header Banner */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000] shrink-0'>
				<div>
					<div className='flex items-center gap-2 mb-1'>
						<span className='font-mono text-xs font-bold px-2 py-0.5 bg-amber-300 border border-black text-black'>
							[SYS_CURRICULUM // MODULE_ARCH]
						</span>
						<span className='font-mono text-xs text-slate-500 font-bold'>
							FORMAT: MULTI-MEETING WITH QUIZ & PDF
						</span>
					</div>
					<h1 className='text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-black'>
						Kelola Modul, Materi &amp; Quiz
					</h1>
					<p className='text-xs sm:text-sm font-mono text-slate-600 mt-0.5'>
						Konfigurasi cartridge kurikulum pembelajaran, konten teks, lampiran PDF modul, dan soal ujian interaktif.
					</p>
				</div>
				<button
					onClick={() => {
						setEditingModul(null);
						setModulModalOpen(true);
					}}
					className='lg:hidden flex items-center gap-1.5 px-3 py-2 bg-orange-500 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000]'>
					<Plus className='w-4 h-4' /> Modul
				</button>
			</div>

			{/* Mobile Dropdown Selector */}
			<div className='lg:hidden shrink-0'>
				<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>Pilih Modul Kursus</label>
				<select
					className='w-full border-2 border-black bg-white px-3 py-2 font-mono font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-yellow-50 focus:outline-none text-xs uppercase cursor-pointer'
					value={selectedModul?.id || ''}
					onChange={(e) => setSelectedModul(modulList.find((m) => m.id === e.target.value) || null)}>
					<option value='' disabled>
						PILIH MODUL...
					</option>
					{modulList.map((m) => (
						<option key={m.id} value={m.id}>
							{m.icon} {m.nama}
						</option>
					))}
				</select>
			</div>

			{/* Desktop: 2-panel side by side | Mobile: full panel */}
			<div className='flex flex-1 min-h-0 gap-6'>
				{/* ── LEFT: Modul Sidebar — DESKTOP ONLY ── */}
				<div className='hidden lg:flex w-64 xl:w-72 shrink-0 flex-col bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden'>
					{/* Window Titlebar */}
					<div className='flex items-center justify-between px-3 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0'>
						<div className='flex items-center gap-2'>
							<div className='flex gap-1.5'>
								<span className='w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block'></span>
								<span className='w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block'></span>
								<span className='w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block'></span>
							</div>
							<span>modules.rom</span>
						</div>
						<button
							onClick={() => {
								setEditingModul(null);
								setModulModalOpen(true);
							}}
							title='Tambah modul baru'
							className='p-1 bg-orange-500 hover:bg-orange-400 text-black border border-black transition-colors'>
							<Plus className='w-3.5 h-3.5' />
						</button>
					</div>

					<div className='px-4 py-2.5 bg-yellow-50 border-b-2 border-black flex items-center justify-between shrink-0'>
						<span className='font-heading font-black text-xs uppercase text-black'>Daftar Modul</span>
						<span className='font-mono text-[10px] text-slate-500 font-bold'>DRAG TO REORDER</span>
					</div>

					<DragDropContext onDragEnd={onDragEnd}>
						<Droppable droppableId="modul-list">
							{(provided) => (
								<div 
									className='flex-1 overflow-y-auto p-2.5 space-y-2 bg-[#FFFDF5]'
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{modulLoading ? (
										<div className='flex flex-col justify-center items-center pt-8 gap-2'>
											<Loader2 className='w-6 h-6 animate-spin text-orange-500' />
											<span className='font-mono text-xs text-slate-500'>[LOADING_MODULES]</span>
										</div>
									) : modulList.length === 0 ? (
										<div className='text-center py-10 px-3 bg-white border-2 border-dashed border-slate-300'>
											<Package className='w-8 h-8 text-slate-400 mx-auto mb-2' />
											<p className='font-mono text-xs text-slate-500'>[EMPTY] Belum ada modul.</p>
										</div>
									) : (
										modulList.map((modul, index) => {
											const isSelected = selectedModul?.id === modul.id;
											return (
												<Draggable key={modul.id} draggableId={modul.id} index={index}>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															onClick={() => setSelectedModul(modul)}
															className={`group flex items-center gap-2.5 p-2.5 border-2 border-black cursor-pointer transition-all ${
																isSelected 
																	? 'bg-orange-500 text-black shadow-[3px_3px_0px_0px_#000] translate-x-1 font-bold' 
																	: 'bg-white text-black hover:bg-yellow-50 shadow-[2px_2px_0px_0px_#000]'
															} ${snapshot.isDragging ? 'shadow-xl ring-2 ring-black rotate-1' : ''}`}
														>
															<div 
																{...provided.dragHandleProps} 
																className={`p-1 -ml-0.5 rounded cursor-grab active:cursor-grabbing ${isSelected ? 'text-black' : 'text-slate-400 hover:text-black'}`}
															>
																<GripVertical className="w-4 h-4" />
															</div>
															<span className='text-xl leading-none shrink-0'>{modul.icon || '📚'}</span>
															<div className='flex-1 min-w-0'>
																<p className='font-heading font-black text-xs uppercase truncate'>{modul.nama}</p>
																<p className={`font-mono text-[10px] truncate ${isSelected ? 'text-black font-bold' : 'text-slate-600'}`}>{modul.total_pertemuan} pertemuan</p>
															</div>
															{isSelected && <ChevronRight className='w-4 h-4 shrink-0 text-black' />}
														</div>
													)}
												</Draggable>
											);
										})
									)}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>

					{!modulLoading && (
						<div className='px-4 py-2 border-t-2 border-black bg-yellow-100 shrink-0 font-mono text-[11px] font-bold text-center text-black'>
							TOTAL: {modulList.length} MODUL
						</div>
					)}
				</div>

				{/* ── RIGHT: Materi Panel ── */}
				<div className='flex-1 flex flex-col bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden min-w-0'>
					{/* Window Titlebar */}
					<div className='flex items-center justify-between px-4 py-2 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0'>
						<div className='flex items-center gap-2'>
							<div className='flex gap-1.5'>
								<span className='w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block'></span>
								<span className='w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block'></span>
								<span className='w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block'></span>
							</div>
							<span>curriculum_meeting_matrix.exe</span>
						</div>
						<span className='text-[10px] text-emerald-400 font-mono'>[LIVE_DATA]</span>
					</div>

					{/* Panel Header */}
					<div className='px-4 sm:px-5 py-3.5 border-b-2 border-black bg-yellow-50 flex items-center justify-between shrink-0'>
						{selectedModul ? (
							<div className='flex items-center gap-3 min-w-0'>
								<span className='text-3xl shrink-0 p-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'>{selectedModul.icon || '📚'}</span>
								<div className='min-w-0'>
									<div className='flex items-center gap-2 mb-0.5'>
										<h2 className='font-heading font-black text-black uppercase truncate text-sm sm:text-base'>{selectedModul.nama}</h2>
										<button
											onClick={() => {
												setEditingModul(selectedModul);
												setModulModalOpen(true);
											}}
											className='p-1 bg-yellow-300 hover:bg-yellow-200 text-black border border-black shadow-[1px_1px_0px_0px_#000] transition-colors'
											title='Edit Modul'>
											<Edit2 className='w-3 h-3' />
										</button>
										<button
											onClick={() => handleDeleteModul(selectedModul)}
											className='p-1 bg-rose-400 hover:bg-rose-300 text-black border border-black shadow-[1px_1px_0px_0px_#000] transition-colors'
											title='Hapus Modul'>
											<Trash2 className='w-3 h-3' />
										</button>
									</div>
									<p className='font-mono text-xs text-slate-700 truncate font-bold'>
										{materiList.length} DARI {selectedModul.total_pertemuan} PERTEMUAN TERSEDIA
									</p>
								</div>
							</div>
						) : (
							<p className='font-mono text-xs text-slate-500'>← Pilih modul di panel kiri</p>
						)}

						<div className='flex items-center gap-2 shrink-0'>
							{selectedModul && (
								<button
									onClick={handleAdd}
									className='inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
									<Plus className='w-3.5 h-3.5' /> <span className='hidden sm:inline'>Tambah Pertemuan</span>
									<span className='sm:hidden'>Tambah</span>
								</button>
							)}
						</div>
					</div>

					{/* Pertemuan List */}
					<div className='flex-1 overflow-y-auto p-3 sm:p-5 bg-[#FFFDF5]'>
						{!selectedModul ? (
							<div className='flex flex-col items-center justify-center h-full text-center py-20'>
								<Layers className='w-12 h-12 text-slate-300 mb-3' />
								<p className='font-heading font-black text-black uppercase'>Belum Ada Modul Dipilih</p>
								<p className='font-mono text-xs text-slate-500 mt-1'>Pilih modul di panel kiri atau tambah modul baru.</p>
							</div>
						) : materiLoading ? (
							<div className='flex flex-col justify-center items-center py-20 gap-2'>
								<Loader2 className='w-8 h-8 animate-spin text-orange-500' />
								<span className='font-mono text-xs text-slate-500'>[LOADING_LESSONS]</span>
							</div>
						) : materiList.length === 0 ? (
							<div className='flex flex-col items-center justify-center h-full text-center py-16 bg-white border-2 border-dashed border-black p-6'>
								<BookOpen className='w-12 h-12 text-slate-300 mb-3' />
								<p className='font-heading font-black text-base uppercase text-black'>Belum Ada Pertemuan</p>
								<p className='font-mono text-xs text-slate-600 mt-1 mb-5'>Klik tombol di bawah untuk mulai mengisi materi pertemuan dan kuis.</p>
								<button
									onClick={handleAdd}
									className='inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
									<Plus className='w-4 h-4' /> Tambah Pertemuan Pertama
								</button>
							</div>
						) : (
							<div className='space-y-3'>
								{materiList.map((materi) => {
									const isExpanded = expandedId === materi.id;
									const qPreview = previewQuiz[materi.id];
									const qLoading = previewLoading[materi.id];
									const topikArr = Array.isArray(materi.topik)
										? materi.topik
										: (() => {
												try {
													return JSON.parse(materi.topik || '[]');
												} catch {
													return [];
												}
											})();

									return (
										<div
											key={materi.id}
											className={`bg-white border-2 border-black transition-all duration-150 overflow-hidden ${isExpanded ? 'shadow-[4px_4px_0px_0px_#000]' : 'shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-50/50'}`}>
											{/* ── Row Header ── */}
											<div
												className='flex items-center gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer select-none'
												onClick={() => handleTogglePreview(materi)}>
												<div
													className={`w-11 h-11 sm:w-12 sm:h-12 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex flex-col items-center justify-center shrink-0 transition-colors ${
														isExpanded ? 'bg-orange-500 text-black' : 'bg-cyan-300 text-black'
													}`}>
													<span className='text-[9px] font-mono font-bold leading-none uppercase'>PRTM</span>
													<span className='text-lg font-heading font-black leading-tight'>{materi.pertemuan}</span>
												</div>

												<div className='flex-1 min-w-0'>
													<h3 className='font-heading font-black text-black uppercase truncate text-sm sm:text-base'>{materi.judul || <span className='text-slate-400 italic'>Tanpa judul</span>}</h3>
													<div className='flex items-center gap-2 mt-1 flex-wrap font-mono text-xs'>
														<span
															className={`inline-flex items-center px-2 py-0.5 border border-black font-bold uppercase ${
																materi.tipe_konten === 'materi_saja' ? 'bg-cyan-200 text-black' : materi.tipe_konten === 'quiz_saja' ? 'bg-purple-200 text-black' : 'bg-emerald-200 text-black'
															}`}>
															{materi.tipe_konten === 'materi_saja' ? '📖 Materi' : materi.tipe_konten === 'quiz_saja' ? '🧠 Quiz' : '📖🧠 Materi & Quiz'}
														</span>
														{materi.durasi && <span className='text-slate-600 font-bold'>⏱ {materi.durasi}</span>}
														{materi.lampiran?.length > 0 && (
															<span className='inline-flex items-center text-slate-800 font-bold gap-1 bg-yellow-100 px-1.5 border border-black'>
																<FileText className='w-3 h-3' /> {materi.lampiran.length} PDF
															</span>
														)}
													</div>
												</div>

												<div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleEdit(materi);
														}}
														className='px-2.5 py-1.5 bg-yellow-300 hover:bg-yellow-200 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-xs font-mono font-bold uppercase transition-all cursor-pointer'>
														<Edit2 className='w-3.5 h-3.5 sm:hidden' />
														<span className='hidden sm:inline'>Edit</span>
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(materi.id);
														}}
														className='p-1.5 bg-rose-400 hover:bg-rose-300 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
														<Trash2 className='w-3.5 h-3.5' />
													</button>
													<div className={`p-1 border border-black transition-transform duration-200 ${isExpanded ? 'bg-black text-white rotate-180' : 'bg-white text-black'}`}>
														<ChevronRight className='w-4 h-4 rotate-90' />
													</div>
												</div>
											</div>

											{/* ── Preview Panel (accordion) ── */}
											{isExpanded && (
												<div className='border-t-2 border-black bg-yellow-50/50 px-4 sm:px-5 py-4'>
													<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
														{materi.deskripsi && (
															<div className='md:col-span-2 bg-white border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]'>
																<p className='font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1'>[DESKRIPSI_MATERI]</p>
																<p className='text-sm text-slate-800 leading-relaxed font-medium'>{materi.deskripsi}</p>
															</div>
														)}
														{topikArr.length > 0 && (
															<div className='bg-white border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]'>
																<p className='font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2'>[TOPIK_BAHASAN]</p>
																<ul className='space-y-1.5'>
																	{topikArr.map((t, i) => (
																		<li
																			key={i}
																			className='flex items-start gap-2 text-xs font-mono font-bold text-slate-800'>
																			<span className='mt-1 w-1.5 h-1.5 bg-orange-500 border border-black shrink-0' />
																			{t}
																		</li>
																	))}
																</ul>
															</div>
														)}
														{materi.tips && (
															<div className='bg-yellow-100 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]'>
																<p className='font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1'>💡 [TIPS_&_TRICKS]</p>
																<p className='text-xs font-mono text-slate-800 leading-relaxed font-medium'>{materi.tips}</p>
															</div>
														)}
														{materi.lampiran?.length > 0 && (
															<div className='bg-white border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]'>
																<p className='font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2'>📎 [LAMPIRAN_PDF]</p>
																<div className='space-y-1.5'>
																	{materi.lampiran.map((lamp) => (
																		<a
																			key={lamp.id}
																			href={lamp.url_publik}
																			target='_blank'
																			rel='noreferrer'
																			className='flex items-center gap-2 text-xs font-mono font-bold text-black bg-cyan-100 hover:bg-cyan-200 border border-black px-2.5 py-1.5 shadow-[1px_1px_0px_0px_#000] transition-colors'>
																			<FileText className='w-3.5 h-3.5 shrink-0' />
																			<span className='truncate'>{lamp.nama_file}</span>
																		</a>
																	))}
																</div>
															</div>
														)}
														{materi.tipe_konten !== 'materi_saja' && (
															<div className='bg-white border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]'>
																<p className='font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2'>🧠 [INFO_QUIZ]</p>
																{qLoading ? (
																	<div className='flex items-center gap-2 text-xs font-mono text-slate-500'>
																		<Loader2 className='w-3.5 h-3.5 animate-spin text-orange-500' /> Memuat quiz data...
																	</div>
																) : qPreview ? (
																	<div className='bg-purple-50 border border-black p-2.5 space-y-1 font-mono text-xs'>
																		<p className='font-bold text-black'>{qPreview.judul}</p>
																		<div className='flex gap-3 text-[11px] text-slate-700 flex-wrap font-bold'>
																			<span>📝 {qPreview.soal?.length ?? 0} soal</span>
																			<span>🎯 Pass score: {qPreview.passing_score}</span>
																			{qPreview.durasi_menit > 0 && <span>⏱ {qPreview.durasi_menit} mnt</span>}
																		</div>
																	</div>
																) : (
																	<p className='font-mono text-xs text-slate-400 italic'>Belum ada quiz dibuat</p>
																)}
															</div>
														)}
														{!materi.deskripsi && topikArr.length === 0 && !materi.tips && !materi.lampiran?.length && materi.tipe_konten === 'materi_saja' && (
															<div className='md:col-span-2 text-center py-4 font-mono text-slate-400 text-xs italic'>Konten belum diisi. Klik Edit untuk mulai mengisi materi.</div>
														)}
													</div>
													<div className='mt-4 pt-3 border-t-2 border-black flex justify-end'>
														<button
															onClick={() => handleEdit(materi)}
															className='inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
															<Edit2 className='w-3.5 h-3.5' /> Edit Pertemuan Ini
														</button>
													</div>
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ── Modul Modal ── */}
			{modulModalOpen && (
				<ModulModal
					modul={editingModul}
					onClose={() => {
						setModulModalOpen(false);
						setEditingModul(null);
					}}
					onSaved={handleModulSaved}
				/>
			)}

			{/* ── Materi Edit/Tambah Modal ── */}
			{isModalOpen && (
				<ClientPortal>
					<div
						className='fixed inset-0 z-[60] flex items-center justify-center p-4'
						role='dialog'
						aria-modal='true'>
						<div className='fixed inset-0 bg-black/70 backdrop-blur-xs' onClick={() => setIsModalOpen(false)} />
						<div
							className='relative bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000] w-full flex flex-col max-h-[90vh] overflow-hidden'
							style={{ maxWidth: '650px' }}>
							
							{/* Window Titlebar */}
							<div className='flex items-center justify-between px-4 py-2.5 bg-black text-white font-mono text-xs font-bold border-b-2 border-black select-none shrink-0'>
								<div className='flex items-center gap-2'>
									<div className='flex gap-1.5'>
										<span className='w-2.5 h-2.5 rounded-full bg-rose-500 border border-black inline-block'></span>
										<span className='w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block'></span>
										<span className='w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black inline-block'></span>
									</div>
									<span>meeting_content_editor.exe</span>
								</div>
								<button
									onClick={() => setIsModalOpen(false)}
									className='px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px]'>
									ESC [X]
								</button>
							</div>

							<div className='px-5 py-3 bg-yellow-100 border-b-2 border-black shrink-0 flex justify-between items-center'>
								<div>
									<h3 className='font-heading font-black text-base uppercase text-black'>{editData.id ? 'Edit Konten Pertemuan' : 'Tambah Konten Pertemuan'}</h3>
									<p className='font-mono text-xs text-slate-700 mt-0.5'>Modul: <strong>{selectedModul?.nama}</strong></p>
								</div>
							</div>

							{/* Tabs Navigation */}
							<div className='flex border-b-2 border-black shrink-0 bg-yellow-50 p-1.5 gap-1.5 overflow-x-auto'>
								{[
									{ key: 'konten', label: '[01] KONTEN TEKS', icon: <BookOpen className='w-3.5 h-3.5 mr-1' /> },
									{ key: 'pdf', label: '[02] PDF MATERI', icon: <FileText className='w-3.5 h-3.5 mr-1' /> },
									{ key: 'quiz', label: '[03] QUIZ SOAL', icon: <Brain className='w-3.5 h-3.5 mr-1' /> },
								].map((tab) => (
									<button
										key={tab.key}
										onClick={() => setActiveTab(tab.key)}
										className={`flex-1 flex items-center justify-center px-3 py-2 font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
											activeTab === tab.key 
												? 'bg-orange-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black' 
												: 'bg-white text-slate-700 border-2 border-transparent hover:border-black'
										}`}>
										{tab.icon} {tab.label}
									</button>
								))}
							</div>

							{/* Tab Content */}
							<div className='p-5 overflow-y-auto flex-1 bg-[#FFFDF5] space-y-4'>
								{/* ─ Konten ─ */}
								{activeTab === 'konten' && (
									<div className='space-y-4'>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>[PRTM] Pertemuan Ke-</label>
												<input
													type='number'
													value={editData.pertemuan}
													onChange={(e) => setEditData({ ...editData, pertemuan: parseInt(e.target.value) })}
													className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-mono font-bold bg-white focus:bg-yellow-50 focus:outline-none'
												/>
											</div>
											<div>
												<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>[TIME] Estimasi Durasi</label>
												<input
													type='text'
													value={editData.durasi}
													onChange={(e) => setEditData({ ...editData, durasi: e.target.value })}
													placeholder='cth: 2 jam'
													className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-mono font-bold bg-white focus:bg-yellow-50 focus:outline-none'
												/>
											</div>
										</div>

										<div>
											<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>[TYPE] Tipe Konten</label>
											<select
												value={editData.tipe_konten}
												onChange={(e) => setEditData({ ...editData, tipe_konten: e.target.value })}
												className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-mono font-bold bg-white focus:bg-cyan-50 focus:outline-none cursor-pointer'>
												<option value='materi_quiz'>📖🧠 Materi &amp; Quiz</option>
												<option value='materi_saja'>📖 Materi Saja</option>
												<option value='quiz_saja'>🧠 Quiz Saja</option>
											</select>
										</div>

										<div>
											<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>[TITLE] Judul Pertemuan</label>
											<input
												type='text'
												value={editData.judul}
												onChange={(e) => setEditData({ ...editData, judul: e.target.value })}
												placeholder='Contoh: Pengenalan MS Word & Format Dokumen'
												className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm font-medium bg-white focus:bg-yellow-50 focus:outline-none'
											/>
										</div>

										<div>
											<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>[DESC] Deskripsi Singkat</label>
											<textarea
												value={editData.deskripsi}
												onChange={(e) => setEditData({ ...editData, deskripsi: e.target.value })}
												rows={3}
												className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm bg-white focus:bg-yellow-50 focus:outline-none font-medium'
											/>
										</div>

										<div>
											<div className='flex justify-between items-center mb-1'>
												<label className='font-mono text-xs font-bold uppercase text-black'>[TOPICS] Topik / Sub-Materi</label>
												<button
													type='button'
													onClick={() => setEditData({ ...editData, topik: [...editData.topik, ''] })}
													className='px-2 py-0.5 bg-yellow-300 hover:bg-yellow-200 text-black font-mono text-[10px] font-bold uppercase border border-black shadow-[1px_1px_0px_0px_#000]'>
													+ Tambah Item
												</button>
											</div>
											{editData.topik.map((t, i) => (
												<div
													key={i}
													className='flex gap-2 mb-2'>
													<input
														type='text'
														value={t}
														onChange={(e) => {
															const nt = [...editData.topik];
															nt[i] = e.target.value;
															setEditData({ ...editData, topik: nt });
														}}
														placeholder={`Topik bahasan #${i + 1}`}
														className='flex-1 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] px-3 py-1.5 text-xs font-mono font-bold bg-white focus:bg-yellow-50 focus:outline-none'
													/>
													<button
														onClick={() => setEditData({ ...editData, topik: editData.topik.filter((_, idx) => idx !== i) })}
														className='p-1.5 bg-rose-400 hover:bg-rose-300 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] transition-colors'>
														<X className='w-3.5 h-3.5' />
													</button>
												</div>
											))}
										</div>

										<div>
											<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>💡 [TIPS] Tips &amp; Trik Tambahan</label>
											<textarea
												value={editData.tips}
												onChange={(e) => setEditData({ ...editData, tips: e.target.value })}
												rows={2}
												placeholder='Shortcut keyboard penting, tips efisiensi kerja...'
												className='w-full border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-2 text-sm bg-white focus:bg-yellow-50 focus:outline-none font-mono text-xs'
											/>
										</div>
									</div>
								)}

								{/* ─ PDF ─ */}
								{activeTab === 'pdf' && (
									<div className='space-y-4'>
										<div className='p-3 bg-cyan-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] font-mono text-xs text-black'>
											[SYS_INFO] Unggah berkas modul tutorial atau panduan PDF untuk diunduh siswa pada pertemuan ini.
										</div>

										{lampiranAwal.length > 0 && (
											<div className='bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] p-4'>
												<p className='font-mono text-xs font-bold text-black uppercase mb-2'>[ATTACHED] PDF Modul Tersimpan:</p>
												{lampiranAwal.map((lamp) => (
													<div
														key={lamp.id}
														className='flex justify-between items-center bg-yellow-50 p-2.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000] mb-2'>
														<span className='font-mono text-xs font-bold truncate text-black flex items-center gap-1.5'>
															<FileText className='w-4 h-4 text-orange-600' /> {lamp.nama_file}
														</span>
														<button
															onClick={async () => {
																const result = await Swal.fire({
																	title: 'Hapus Lampiran?',
																	text: 'Lampiran ini akan dihapus permanen.',
																	icon: 'warning',
																	showCancelButton: true,
																	confirmButtonColor: '#d33',
																	cancelButtonColor: '#000000',
																	confirmButtonText: 'Hapus',
																});
																if (result.isConfirmed) {
																	await deleteLampiran(lamp.id);
																	setLampiranAwal(lampiranAwal.filter((l) => l.id !== lamp.id));
																	Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1000, showConfirmButton: false });
																}
															}}
															className='p-1 bg-rose-400 hover:bg-rose-300 text-black border border-black ml-2'>
															<Trash2 className='w-3.5 h-3.5' />
														</button>
													</div>
												))}
											</div>
										)}

										<label className='flex flex-col items-center justify-center border-2 border-dashed border-black bg-white hover:bg-yellow-50 p-8 text-center cursor-pointer transition-colors shadow-[2px_2px_0px_0px_#000]'>
											<Upload className='w-8 h-8 text-black mb-2' />
											<p className='font-heading font-black text-sm uppercase text-black mb-0.5'>
												{uploadFile ? <span className='text-emerald-600'>✓ FILE: {uploadFile.name}</span> : 'Pilih Berkas Modul PDF'}
											</p>
											<p className='font-mono text-[10px] text-slate-500'>Maksimal ukuran file 10MB (.pdf)</p>
											<input
												type='file'
												accept='.pdf'
												className='hidden'
												onChange={(e) => {
													if (e.target.files[0]) setUploadFile(e.target.files[0]);
												}}
											/>
										</label>
									</div>
								)}

								{/* ─ Quiz ─ */}
								{activeTab === 'quiz' && (
									<div className='space-y-4'>
										{editData.tipe_konten === 'materi_saja' ? (
											<div className='text-center py-10 bg-white border-2 border-dashed border-black p-6 font-mono text-xs text-slate-500'>
												<Brain className='w-10 h-10 mx-auto mb-2 text-slate-400' />
												<p className='font-bold uppercase text-black'>Tipe Konten: "Materi Saja"</p>
												<p className='mt-1'>Ubah tipe di tab Konten menjadi "Materi & Quiz" jika ingin membuat kuis.</p>
											</div>
										) : (
											<>
												<div className='grid grid-cols-2 gap-4 pb-4 border-b-2 border-black bg-white p-3.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]'>
													<div>
														<label className='block font-mono text-xs font-bold uppercase text-black mb-1'>Passing Score (Min)</label>
														<input
															type='number'
															value={quizData.passing_score}
															onChange={(e) => setQuizData({ ...quizData, passing_score: parseInt(e.target.value) })}
															className='w-full border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] px-3 py-1.5 text-xs font-mono font-bold bg-white focus:bg-yellow-50 focus:outline-none'
														/>
													</div>
													<div className='flex flex-col justify-end items-end'>
														<p className='font-mono text-xs font-bold text-black'>{quizData.soal.length} SOAL TERDAFTAR</p>
														<button
															type='button'
															onClick={() =>
																setQuizData({
																	...quizData,
																	soal: [
																		...quizData.soal,
																		{
																			pertanyaan: '',
																			penjelasan: '',
																			pilihan: [
																				{ teks: '', adalah_benar: true },
																				{ teks: '', adalah_benar: false },
																				{ teks: '', adalah_benar: false },
																				{ teks: '', adalah_benar: false },
																			],
																		},
																	],
																})
															}
															className='mt-1 px-3 py-1 bg-emerald-400 hover:bg-emerald-300 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
															<Plus className='w-3.5 h-3.5 inline mr-1' /> Tambah Soal
														</button>
													</div>
												</div>

												<div className='space-y-4'>
													{quizData.soal.map((s, sIdx) => (
														<div
															key={sIdx}
															className='bg-white p-4 border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-3'>
															<div className='flex justify-between items-center border-b border-black pb-2'>
																<span className='font-mono font-bold text-xs uppercase text-black bg-yellow-200 px-2 py-0.5 border border-black'>
																	SOAL #{sIdx + 1}
																</span>
																<button
																	onClick={() => setQuizData({ ...quizData, soal: quizData.soal.filter((_, i) => i !== sIdx) })}
																	className='p-1 bg-rose-400 hover:bg-rose-300 text-black border border-black'>
																	<Trash2 className='w-3.5 h-3.5' />
																</button>
															</div>
															<textarea
																value={s.pertanyaan}
																onChange={(e) => {
																	const ns = [...quizData.soal];
																	ns[sIdx] = { ...ns[sIdx], pertanyaan: e.target.value };
																	setQuizData({ ...quizData, soal: ns });
																}}
																placeholder='Tuliskan teks pertanyaan soal...'
																rows={2}
																className='w-full border-2 border-black px-3 py-2 text-xs font-medium bg-yellow-50/50 focus:bg-yellow-50 focus:outline-none'
															/>

															<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3 border-l-2 border-black'>
																{s.pilihan?.map((pil, pIdx) => (
																	<div
																		key={pIdx}
																		className={`flex items-center gap-2 p-1.5 border border-black ${pil.adalah_benar ? 'bg-emerald-100' : 'bg-slate-50'}`}>
																		<input
																			type='radio'
																			name={`benar_${sIdx}`}
																			checked={pil.adalah_benar}
																			onChange={() => {
																				const ns = [...quizData.soal];
																				ns[sIdx].pilihan.forEach((p, i) => (p.adalah_benar = i === pIdx));
																				setQuizData({ ...quizData, soal: ns });
																			}}
																			className='accent-black cursor-pointer'
																		/>
																		<input
																			type='text'
																			value={pil.teks}
																			onChange={(e) => {
																				const ns = [...quizData.soal];
																				ns[sIdx].pilihan[pIdx].teks = e.target.value;
																				setQuizData({ ...quizData, soal: ns });
																			}}
																			placeholder={`Pilihan ${['A', 'B', 'C', 'D'][pIdx] || pIdx + 1}`}
																			className='flex-1 border border-black px-2 py-1 text-xs font-mono font-bold bg-white focus:outline-none'
																		/>
																	</div>
																))}
															</div>

															<input
																type='text'
																value={s.penjelasan || ''}
																onChange={(e) => {
																	const ns = [...quizData.soal];
																	ns[sIdx] = { ...ns[sIdx], penjelasan: e.target.value };
																	setQuizData({ ...quizData, soal: ns });
																}}
																placeholder='💡 Penjelasan kunci jawaban benar...'
																className='w-full border-2 border-black bg-cyan-50 px-3 py-1.5 text-xs font-mono font-bold text-black focus:outline-none'
															/>
														</div>
													))}
												</div>
											</>
										)}
									</div>
								)}
							</div>

							{/* Modal Footer */}
							<div className='bg-white px-5 py-3 border-t-2 border-black flex justify-end gap-3 shrink-0'>
								<button
									onClick={() => setIsModalOpen(false)}
									className='px-4 py-2 border-2 border-black text-black font-mono font-bold uppercase text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer'>
									Batal
								</button>
								<button
									onClick={handleSave}
									disabled={isSaving}
									className='inline-flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-heading font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all cursor-pointer'>
									{isSaving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
									Simpan Pertemuan
								</button>
							</div>
						</div>
					</div>
				</ClientPortal>
			)}
		</div>
	);
}
