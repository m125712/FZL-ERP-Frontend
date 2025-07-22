import { useEffect, useState } from 'react';
import { useDailyOrderStatus } from '@/state/Report';
import { format } from 'date-fns';

import Pdf from '@/components/Pdf/DailyOrderStatus';

import PageInfo from '@/util/PageInfo';

import Header from './Header';

export default function index() {
	const info = new PageInfo(
		'Daily Order Status',
		'report/daily-order-status',
		'report__daily_order_status'
	);

	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const { data, isLoading } = useDailyOrderStatus(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd')
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<div className='flex flex-col gap-8'>
				<Header {...{ from, setFrom, to, setTo }} />
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={() => {
							Pdf(data, from, to)?.print(
								{},
								window.open('', '_blank')
							);
						}}
						className='btn btn-primary flex-1'
					>
						PDF
					</button>
				</div>
			</div>
		</>
	);
}
