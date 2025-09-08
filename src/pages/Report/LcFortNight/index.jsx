import { useEffect, useState } from 'react';
import { useLcFortNight } from '@/state/Report';

import Pdf from '@/components/Pdf/LcFortNight';

import PageInfo from '@/util/PageInfo';

import Header from './Header';

export default function Index() {
	const [type, setType] = useState('');

	const { data, isLoading } = useLcFortNight(type);

	const info = new PageInfo(
		'LC Fort Night',
		'/report/lc-fort-night',
		'report__lc_fortnight'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<Header type={type} setType={setType} />
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => {
						Pdf(data, type)?.print({}, window.open('', '_blank'));
					}}
					className='btn btn-primary flex-1'
				>
					PDF
				</button>
			</div>
		</>
	);
}
