import { useEffect, useState } from 'react';
import { useOrderStatementReport } from '@/state/Report';
import { format } from 'date-fns';

import Pdf from '@/components/Pdf/ProductionStatement';

import PageInfo from '@/util/PageInfo';

import Excel from './Excel';
import Header from './Header';
import OrderSheetPdf from '@/components/Pdf/OrderSheet';

export default function index() {
	const info = new PageInfo(
		'Order Statement',
		'/report/order-statement',
		'report__order_statement'
	);

	const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
	const { data, isLoading } = useOrderStatementReport(date);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-8'>
			<Header
				{...{
					date,
					setDate,
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => OrderSheetPdf(data?.[0])?.open()}
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
