import { useEffect, useState } from 'react';
import { useDeliveryChallanDetailsByUUID } from '@/state/Delivery';
import { useParams } from 'react-router';

import ThreadPdf from '@/components/Pdf/ThreadChallan';
import ThreadPdfV2 from '@/components/Pdf/ThreadChallanV2';
import Pdf from '@/components/Pdf/ZipperChallan';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { uuid } = useParams();

	const { data, isLoading, invalidateQuery } =
		useDeliveryChallanDetailsByUUID(uuid);

	useEffect(() => {
		invalidateQuery();
		document.title = `Challan: ${uuid}`;
	}, [uuid]);
	const [data2, setData] = useState('');
	const [data3, setData3] = useState('');

	useEffect(() => {
		const hasData = data && data?.challan_entry;
		const isThread =
			data?.item_for === 'thread' || data?.item_for === 'sample_thread';
		if (hasData && !isThread) {
			Pdf(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		} else if (hasData && isThread) {
			ThreadPdf(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
			ThreadPdfV2(data)?.getDataUrl((dataUrl) => {
				setData3(dataUrl);
			});
		}
	}, [data]);
	// ! FOR TESTING

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<div className='flex gap-2'>
				<iframe
					src={data2}
					className='h-[40rem] w-full rounded-md border-none'
				/>
				{/* <iframe
					src={data3}
					className='h-[40rem] w-1/2 rounded-md border-none'
				/> */}
			</div>
			<Information challan={data} />
			<Table challan={data?.challan_entry} item_for={data?.item_for} />
		</div>
	);
}
