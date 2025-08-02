import { Download, Eye, FileText, LoaderCircle } from 'lucide-react';

const PdfGeneratorButton = ({
	handleGenerateClick,
	isFetching,
	isGenerating,
	pdfUrl,
	status,
	progress,
	generateButton = true,
	download = false,
	iframe = false,
	viewPdf = false,
	pdf_name = 'generate-pdf',
	error,
	className = '', // Add className prop with default empty string
}) => {
	return (
		<div className={className}>
			<div className={`flex flex-col gap-3`}>
				{generateButton && (
					<button
						type='button'
						onClick={handleGenerateClick}
						disabled={isFetching || isGenerating}
						className='btn btn-primary flex items-center gap-2'
					>
						{(isFetching || isGenerating) && (
							<>
								<LoaderCircle
									className='animate-spin'
									size={16}
								/>
								<span>
									{isFetching
										? 'Fetching data…'
										: `Generating PDF… ${progress}%`}
								</span>
							</>
						)}
						{!isFetching && !isGenerating && (
							<>
								<FileText size={16} />
								<span>
									{pdfUrl ? 'Regenerate PDF' : 'Generate PDF'}
								</span>
							</>
						)}
					</button>
				)}

				{(isFetching || isGenerating) && (
					<div className='px-2 text-sm text-gray-600'>
						{isFetching ? 'Fetching report data…' : status}
					</div>
				)}

				{isGenerating && (
					<div className='h-2 w-full overflow-hidden rounded-full bg-gray-200'>
						<div
							className='h-2 rounded-full bg-blue-600 transition-all'
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}

				{pdfUrl && download && (
					<a
						href={pdfUrl}
						download={`${pdf_name}.pdf`}
						className='btn btn-success flex items-center gap-2'
					>
						<Download size={16} /> Download PDF
					</a>
				)}

				{pdfUrl && viewPdf && (
					<button
						type='button'
						onClick={() => window.open(pdfUrl, '_blank')}
						className='btn btn-info flex items-center gap-2'
					>
						<Eye size={16} /> View PDF
					</button>
				)}
				{pdfUrl && iframe && (
					<iframe
						id='iframeContainer'
						src={pdfUrl}
						className='h-[40rem] w-full rounded-md border-none'
					/>
				)}

				{error && (
					<div className='rounded bg-red-50 px-2 py-1 text-sm text-red-500'>
						<span className='font-medium'>Error:</span> {error}
					</div>
				)}
			</div>
		</div>
	);
};

export default PdfGeneratorButton;
