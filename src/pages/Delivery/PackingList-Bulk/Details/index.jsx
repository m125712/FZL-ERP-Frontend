import { useEffect, useState } from 'react';
import { useDeliveryPackingListDetailsByUUID } from '@/state/Delivery';
import { useParams } from 'react-router';

import Pdf2 from '@/components/Pdf/PackingListSticker';
import Pdf from '@/components/Pdf/ThreadPackeListSticker';
import PdfV2 from '@/components/Pdf/ThreadPackeListStickerV2';
import PDF from '@/ui/Others/PDF';

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
	const [data4, setData4] = useState('');

	useEffect(() => {
		if (data && data?.packing_list_entry) {
			if (
				data?.item_for === 'thread' ||
				data?.item_for === 'sample_thread'
			) {
				Pdf(data)?.getDataUrl((dataUrl) => {
					setData2(dataUrl);
				});
				PdfV2(data)?.getDataUrl((dataUrl) => {
					setData4(dataUrl);
				});
			} else {
				Pdf2(data)?.getDataUrl((dataUrl) => {
					setData2(dataUrl);
				});
			}
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
			<div className='flex'>
				<iframe
					src={data3}
					className='h-[40rem] w-full rounded-md border-none'
				/>
				{(data?.item_for === 'thread' ||
					data?.item_for === 'sample_thread') && (
					<iframe
						src={data4}
						className='h-[40rem] w-full rounded-md border-none'
					/>
				)}
			</div>
			<Information packing_list={data} />
			<Table packing_list_entry={data?.packing_list_entry} data={data} />
		</div>
	);
}
