import { useEffect, useState } from 'react';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { useOrderStatementReport } from '@/state/Report';
import { format } from 'date-fns';

import OrderSheetPdf from '@/components/Pdf/OrderStatement';
import Pdf from '@/components/Pdf/ProductionStatement';

import PageInfo from '@/util/PageInfo';

import Excel from './Excel';
import Header from './Header';

export default function index() {
	const info = new PageInfo(
		'Order Statement',
		'/report/order-statement',
		'report__order_statement'
	);

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [party, setParty] = useState('');

	const { data, isLoading } = useOrderStatementReport(from, to, party, marketing, type);
	const { data: garments } = useOtherOrderPropertiesByGarmentsWash();
	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement();

	useEffect(() => {
		document.title = info.getTabName();
	}, []);
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
					marketing,
					setMarketing,
					type,
					setType,
					party,
					setParty,
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() =>
						OrderSheetPdf(data, garments, sr, from, to)?.open()
					}
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
