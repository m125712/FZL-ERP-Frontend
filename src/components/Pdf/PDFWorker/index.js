// pdfWorker.js - Updated worker using the modular page numbering system
import pdfMake from 'pdfmake/build/pdfmake';

import { vfs } from '../vfs_fonts';
import {
	enhanceDocumentWithPageNumbers,
	validateAndSanitizeOptions,
} from './PageNumbering';

pdfMake.vfs = vfs;

pdfMake.fonts = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Bold.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-BoldItalic.ttf',
	},
};

const STATUS_MESSAGES = {
	INITIALIZING: 'Initializing PDF generation...',
	VALIDATING_DATA: 'Validating input data...',
	PROCESSING_DOCUMENT: 'Processing document definition...',
	ADDING_PAGE_NUMBERS: 'Adding automatic page numbering...',
	CREATING_PAGES: 'Creating pages...',
	RENDERING_CONTENT: 'Rendering content...',
	APPLYING_STYLES: 'Applying styles and formatting...',
	GENERATING_FINAL: 'Generating final PDF...',
	FINALIZING: 'Finalizing document...',
	COMPLETED: 'PDF generation completed!',
};

const handleError = (error, startTime, context = 'PDF generation') => {
	const errorTime = performance.now();
	const errorMessage =
		error?.message || error?.toString() || 'Unknown error occurred';

	console.error(`Error in ${context}:`, error);

	self.postMessage({
		type: 'pdfError',
		error: errorMessage,
		status: `Error occurred during ${context}`,
		startTime: startTime,
		elapsedTime: errorTime - startTime,
		context: context,
	});
};

self.onmessage = async (event) => {
	let startTime = performance.now();

	try {
		if (!event || !event.data) {
			throw new Error('Invalid event data received');
		}

		const { type, data } = event.data;

		if (type === 'generatePdf') {
			if (!data) {
				throw new Error('No data provided for PDF generation');
			}

			const safeData = data || {};
			const documentDefinition = safeData.documentDefinition || {};
			const rawOptions = safeData.options || {};
			if (
				!documentDefinition ||
				Object.keys(documentDefinition).length === 0
			) {
				throw new Error(
					'Document definition is required for PDF generation'
				);
			}

			const sanitizedOptions = validateAndSanitizeOptions(rawOptions);
			const { pageNumbering } = sanitizedOptions;

			// Send status updates
			self.postMessage({
				type: 'pdfStatus',
				status: STATUS_MESSAGES.INITIALIZING,
				progress: 0,
				startTime: startTime,
				elapsedTime: 0,
			});

			await new Promise((resolve) => setTimeout(resolve, 50));
			self.postMessage({
				type: 'pdfStatus',
				status: STATUS_MESSAGES.VALIDATING_DATA,
				progress: 3,
				startTime: startTime,
				elapsedTime: performance.now() - startTime,
			});

			await new Promise((resolve) => setTimeout(resolve, 50));
			self.postMessage({
				type: 'pdfStatus',
				status: STATUS_MESSAGES.PROCESSING_DOCUMENT,
				progress: 5,
				startTime: startTime,
				elapsedTime: performance.now() - startTime,
			});

			let enhancedDocumentDefinition = { ...documentDefinition };

			if (pageNumbering.enabled) {
				await new Promise((resolve) => setTimeout(resolve, 50));
				self.postMessage({
					type: 'pdfStatus',
					status: STATUS_MESSAGES.ADDING_PAGE_NUMBERS,
					progress: 10,
					startTime: startTime,
					elapsedTime: performance.now() - startTime,
				});

				try {
					// Use the modular page numbering system
					enhancedDocumentDefinition = enhanceDocumentWithPageNumbers(
						enhancedDocumentDefinition,
						pageNumbering
					);
				} catch (pageNumberError) {
					console.warn(
						'Error adding page numbers, continuing without them:',
						pageNumberError
					);
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 100));
			self.postMessage({
				type: 'pdfStatus',
				status: STATUS_MESSAGES.CREATING_PAGES,
				progress: 20,
				startTime: startTime,
				elapsedTime: performance.now() - startTime,
			});

			const pdfDocGenerator = pdfMake.createPdf(
				enhancedDocumentDefinition
			);

			const progressCallback = (progress) => {
				try {
					const percentage = Math.round(progress * 100);
					const currentTime = performance.now();
					const elapsedTime = currentTime - startTime;

					let statusMessage = STATUS_MESSAGES.RENDERING_CONTENT;
					if (percentage < 30) {
						statusMessage = STATUS_MESSAGES.CREATING_PAGES;
					} else if (percentage < 60) {
						statusMessage = STATUS_MESSAGES.RENDERING_CONTENT;
					} else if (percentage < 90) {
						statusMessage = STATUS_MESSAGES.APPLYING_STYLES;
					} else {
						statusMessage = STATUS_MESSAGES.GENERATING_FINAL;
					}

					self.postMessage({
						type: 'pdfProgress',
						progress: percentage,
						status: statusMessage,
						startTime: startTime,
						elapsedTime: elapsedTime,
					});
				} catch (progressError) {
					console.error('Error in progress callback:', progressError);
				}
			};

			pdfDocGenerator.getBlob(
				(blob) => {
					try {
						const finalTime = performance.now();
						const totalElapsedTime = finalTime - startTime;

						self.postMessage({
							type: 'pdfStatus',
							status: STATUS_MESSAGES.FINALIZING,
							progress: 95,
							startTime: startTime,
							elapsedTime: totalElapsedTime,
						});

						setTimeout(() => {
							self.postMessage({
								type: 'pdfGenerated',
								blob: blob,
								progress: 100,
								status: STATUS_MESSAGES.COMPLETED,
								startTime: startTime,
								elapsedTime: totalElapsedTime,
								totalTime: totalElapsedTime,
							});
						}, 200);
					} catch (completionError) {
						handleError(
							completionError,
							startTime,
							'PDF completion'
						);
					}
				},
				{ progressCallback: progressCallback }
			);
		} else {
			throw new Error(`Unknown message type: ${type}`);
		}
	} catch (error) {
		handleError(error, startTime, 'message handling');
	}
};

self.onerror = (error) => {
	console.error('Global worker error:', error);
	self.postMessage({
		type: 'pdfError',
		error: error.message || 'Unknown worker error',
		status: 'Worker error occurred',
		startTime: performance.now(),
		elapsedTime: 0,
	});
};

self.onunhandledrejection = (event) => {
	console.error('Unhandled promise rejection in worker:', event.reason);
	self.postMessage({
		type: 'pdfError',
		error: event.reason?.message || 'Unhandled promise rejection',
		status: 'Promise rejection in worker',
		startTime: performance.now(),
		elapsedTime: 0,
	});
};

console.log('PDF Web Worker with modular page numbering initialized.');
