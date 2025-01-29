import { useState } from 'react';
import { useProductionStatementReport } from '@/state/Report';
import { format } from 'date-fns';

import Pdf from '@/components/Pdf/ProductionStatement';

import Excel from './Excel';
import Header from './Header';

export default function index() {
	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [marketing, setMarketing] = useState();
	const [type, setType] = useState();
	const [party, setParty] = useState();
	const [order, setOrder] = useState('');
	const [reportFor, setReportFor] = useState('');
	const { data, isLoading } = useProductionStatementReport(
		from,
		to,
		party,
		marketing,
		type,
		order,
		reportFor
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

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
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => Pdf(data, from, to)?.open()}
					className='btn btn-primary flex-1'>
					PDF
				</button>
				<button
					type='button'
					onClick={() => Excel(data, from, to)}
					className='btn btn-secondary flex-1'>
					Excel
				</button>
			</div>
		</div>
	);
}
