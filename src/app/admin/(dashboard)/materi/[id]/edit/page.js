'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditMateriPage() {
	const router = useRouter();

	useEffect(() => {
		router.replace('/admin/materi');
	}, [router]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
			<Loader2 className="w-8 h-8 animate-spin text-primary" />
			<p className="text-sm font-medium">Mengalihkan ke Kelola Materi...</p>
		</div>
	);
}
