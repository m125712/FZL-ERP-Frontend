import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/ProductionStatement';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}
	return '';
};

export default function ProductionStatementReport() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();

	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [priceFor, setPriceFor] = useState('company');
	const [party, setParty] = useState('');
	const [order, setOrder] = useState('');
	const [reportFor, setReportFor] = useState('');

	const { data, isLoading } = useProductionStatementReport(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		party,
		marketing,
		type,
		order,
		reportFor,
		priceFor,
		getPath(haveAccess, user?.uuid),
		{ isEnabled: !!user?.uuid }
	);
	console.log(data);

	const { isGenerating, pdfUrl, error, generatePdf } = usePdfGenerator();

	const handlePdfClick = useCallback(() => {
		if (data && !isGenerating) {
			generatePdf(Pdf(data, from, to));
		}
	}, [data, isGenerating, generatePdf]);

	const handleExcelClick = useCallback(() => {
		Excel(data);
	}, [data]);

	return (
		<div className='flex flex-col gap-8'>
			<Header
				from={from}
				setFrom={setFrom}
				to={to}
				setTo={setTo}
				party={party}
				setParty={setParty}
				marketing={marketing}
				setMarketing={setMarketing}
				type={type}
				setType={setType}
				order={order}
				setOrder={setOrder}
				reportFor={reportFor}
				setReportFor={setReportFor}
				priceFor={priceFor}
				setPriceFor={setPriceFor}
				isLoading={isLoading}
			/>

			<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={handlePdfClick}
						className='btn btn-primary flex-1'
						disabled={isLoading || isGenerating}
					>
						{isGenerating && (
							<LoaderCircle className='animate-spin' />
						)}
						{pdfUrl ? 'Regenerate PDF' : 'Generate PDF'}
					</button>

					{error && <p style={{ color: 'red' }}>{error}</p>}

					{pdfUrl && (
						<a
							className='btn btn-primary flex-1'
							href={pdfUrl}
							download='production_statement.pdf'
						>
							Download PDF
						</a>
					)}
				</div>

				<button
					type='button'
					onClick={handleExcelClick}
					className='btn btn-secondary flex-1'
					disabled={isLoading}
				>
					{isLoading && <LoaderCircle className='animate-spin' />}
					Excel
				</button>
			</div>
		</div>
	);
}
