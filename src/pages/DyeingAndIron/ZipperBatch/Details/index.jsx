import { useEffect, useState } from 'react';
import { useDyeingBatchDetailsByUUID } from '@/state/Dyeing';
import { useParams } from 'react-router-dom';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/ZipperTravelCard';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { batch_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { data: batch, loading } = useDyeingBatchDetailsByUUID(batch_uuid);

	useEffect(() => {
		document.title = 'Planning Batch Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	const [data, setData] = useState('');

	useEffect(() => {
		if (batch && batch?.dyeing_batch_entry) {
			Pdf(batch)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [batch]);
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<iframe
				src={data}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Information batch={batch} />
			<Table {...batch} />
		</div>
	);
}
