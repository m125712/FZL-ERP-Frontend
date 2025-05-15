import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/ProductionStatement';

import { api } from '@lib/api';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [priceFor, setPriceFor] = useState('company');
	const [party, setParty] = useState('');
	const [order, setOrder] = useState('');
	const [reportFor, setReportFor] = useState('');
	// const { data, isLoading } = useProductionStatementReport(
	// 	format(from, 'yyyy-MM-dd'),
	// 	format(to, 'yyyy-MM-dd'),
	// 	party,
	// 	marketing,
	// 	type,
	// 	order,
	// 	reportFor,
	// 	priceFor,
	// 	getPath(haveAccess, user?.uuid),
	// 	{
	// 		isEnabled: !!user?.uuid,
	// 	}
	// );

	const handlePdf = async (btnType) => {
		setIsLoading(true);
		try {
			const path = getPath(haveAccess, user?.uuid);

			const response = await api.get(
				`/report/delivery-statement-report?from_date=${format(from, 'yyyy-MM-dd')}&to_date=${format(to, 'yyyy-MM-dd')}&party=${party}&marketing=${marketing}&order_info_uuid=${order}&type=${type}&report_for=${reportFor}&price_for=${priceFor}&${path}`
			);

			const data = response?.data?.data || [];

			if (btnType == 'pdf') {
				const pdf = Pdf(data, from, to); // should return pdfDoc from pdfmake.createPdf()

				// Wait for PDF to be ready before opening
				pdf.getBlob((blob) => {
					const url = URL.createObjectURL(blob);
					window.open(url); // or use a new tab/window
				});
			} else {
				Excel(data, from, to, priceFor);
			}
		} catch (error) {
			console.error('Failed to generate PDF:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// if (isLoading)
	// 	return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-8'>
			<Header
				{...{
					from,
					setFrom,
					to,
					setTo,
					party,
					setParty,
					marketing,
					setMarketing,
					type,
					setType,
					order,
					setOrder,
					reportFor,
					setReportFor,
					priceFor,
					setPriceFor,
					isLoading,
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => handlePdf('pdf')}
					className='btn btn-primary flex-1'
					disabled={isLoading}
				>
					{isLoading && <LoaderCircle className='animate-spin' />}
					PDF
				</button>
				<button
					type='button'
					onClick={() => handlePdf('excel')}
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
