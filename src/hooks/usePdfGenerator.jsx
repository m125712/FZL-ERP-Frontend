// usePdfGenerator.js
import { useCallback, useEffect, useRef, useState } from 'react';

import PdfWorker from '@/components/Pdf/pdfWorker.js?worker';

export function usePdfGenerator() {
	const workerRef = useRef(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [pdfUrl, setPdfUrl] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		workerRef.current = new PdfWorker();
		workerRef.current.onmessage = (e) => {
			const { type, blob, error: err } = e.data;
			if (type === 'pdfGenerated') {
				const url = URL.createObjectURL(blob);
				setPdfUrl(url);
				setIsGenerating(false);
				setError(null);
			} else if (type === 'pdfError') {
				setError(err);
				setIsGenerating(false);
			}
		};
		workerRef.current.onerror = () => {
			setError('PDF worker error');
			setIsGenerating(false);
		};
		return () => {
			if (workerRef.current) workerRef.current.terminate();
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
		};
	}, [pdfUrl]);

	const generatePdf = useCallback((docDefinition) => {
		setIsGenerating(true);
		setPdfUrl(null);
		setError(null);
		if (workerRef.current) {
			console.log('Generating PDF...');
			workerRef.current.postMessage({
				type: 'generatePdf',
				data: { documentDefinition: docDefinition },
			});
		} else {
			setError('PDF worker not initialized');
			setIsGenerating(false);
		}
	}, []);

	return { isGenerating, pdfUrl, error, generatePdf };
}
