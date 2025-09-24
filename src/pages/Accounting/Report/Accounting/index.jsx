import { generateDetailedBalanceSheetPDF } from '@/components/Pdf/BalanceSheet';

import { useAccReport } from '../config/query';

export default function index() {
	const { data } = useAccReport();

	const handleGeneratePDF = async () => {
		try {
			await data;

			// Generate PDF when button is clicked, not during render
			const balanceSheetPDF = await generateDetailedBalanceSheetPDF(
				data,
				'Gunze United Limited',
				'01-Jan-2024',
				'31-Dec-2024',
				'2024'
			);
			balanceSheetPDF.open();
			// Open the PDF
		} catch (error) {
			console.error('Error generating PDF:', error);
		}
	};

	return (
		<div>
			<button
				className='btn items-center justify-center bg-black text-cyan-100'
				onClick={handleGeneratePDF} // Call function in onClick handler
				disabled={!data} // Disable if no data
			>
				{data ? 'Generate' : 'Loading...'}
			</button>
		</div>
	);
}
