import { useEffect, useState } from 'react';
import { useThreadChallanDetailsByUUID } from '@/state/Thread';
import { Navigate, useParams } from 'react-router-dom';

import Pdf from '@/components/Pdf/ThreadChallan';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { uuid } = useParams();

	const { data, isLoading } = useThreadChallanDetailsByUUID(uuid);

	useEffect(() => {
		document.title = `Challan: ${uuid}`;
	}, [uuid]);

	// ! FOR TESTING
	const [data2, setData] = useState('');

	useEffect(() => {
		if (data && data?.challan_entry) {
			Pdf(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [data]);
	// ! FOR TESTING

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Information challan={data} />
			<Table challan={data?.batch_entry} />
		</div>
	);
}
