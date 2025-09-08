import { useEffect, useState } from 'react';
import { useLcPayment } from '@/state/Report';
import { format } from 'date-fns';

import Pdf from '@/components/Pdf/LcPayment';

import PageInfo from '@/util/PageInfo';

import Header from './Header';

export default function Index() {
	const [date, setDate] = useState(() => new Date());
	const [type, setType] = useState('');

	const { data, isLoading } = useLcPayment(format(date, 'yyyy-MM-dd'), type);

	const info = new PageInfo(
		'LC Payment',
		'/report/lc-payment',
		'report__lc_payment'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<Header
				date={date}
				setDate={setDate}
				type={type}
				setType={setType}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => {
						Pdf(data, date, type)?.print(
							{},
							window.open('', '_blank')
						);
					}}
					className='btn btn-primary flex-1'
				>
					PDF
				</button>
			</div>
		</>
	);
}
