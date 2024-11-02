import { useEffect, useState } from 'react';
import { useDeliveryPackingListDetailsByUUID } from '@/state/Delivery';
import { useParams } from 'react-router-dom';

import Pdf from '@/components/Pdf/PackingList';
import Pdf2 from '@/components/Pdf/PackingListSticker';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { uuid } = useParams();
	const { data, isLoading, invalidateQuery } =
		useDeliveryPackingListDetailsByUUID(uuid, {
			params: 'is_update=false',
		});

	useEffect(() => {
		invalidateQuery();
		document.title = `Packing List: ${uuid}`;
	}, [uuid]);

	// ! FOR TESTING
	// const [data2, setData] = useState('');

	// useEffect(() => {
	// 	if (data && data?.packing_list_entry) {
	// 		Pdf(data)?.getDataUrl((dataUrl) => {
	// 			setData(dataUrl);
	// 		});
	// 	}
	// }, [data]);
	// ! FOR TESTING
	// ! FOR TESTING
	const [data3, setData2] = useState('');

	useEffect(() => {
		if (data && data?.packing_list_entry) {
			Pdf2(data)?.getDataUrl((dataUrl) => {
				setData2(dataUrl);
			});
		}
	}, [data]);
	// ! FOR TESTING

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			{/* <iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/> */}
			<iframe
				src={data3}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Information packing_list={data} />
			<Table packing_list_entry={data?.packing_list_entry} data={data} />
		</div>
	);
}
