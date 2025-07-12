import { useEffect, useState } from 'react';
import { useDeliveryPackingListDetailsByUUID } from '@/state/Delivery';
import { useParams } from 'react-router';

import Pdf2 from '@/components/Pdf/PackingListSticker';
import Pdf from '@/components/Pdf/ThreadPackeListSticker';
import PdfV2 from '@/components/Pdf/ThreadPackeListStickerV2';

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
	const [data3, setData3] = useState('');
	const [data4, setData4] = useState('');

	useEffect(() => {
		if (data && data?.packing_list_entry) {
			if (
				data?.item_for === 'thread' ||
				data?.item_for === 'sample_thread'
			) {
				Pdf(data)?.getDataUrl((dataUrl) => {
					setData3(dataUrl);
				});
				PdfV2(data)?.getDataUrl((dataUrl) => {
					setData4(dataUrl);
				});
			} else {
				Pdf2(data)?.getDataUrl((dataUrl) => {
					setData3(dataUrl);
				});
			}
		}
	}, [data]);
	// ! FOR TESTING

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<div className='flex flex-col-reverse gap-2 md:flex-row'>
				<Information packing_list={data} className='md:w-2/5' />
				<div className='md:w-3/5'>
					{data?.item_for === 'thread' ||
					data?.item_for === 'sample_thread' ? (
						<iframe
							src={`${data4}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
							className='h-[20rem] w-full rounded-md border-none'
							title='Packing List PDF'
							allow='fullscreen'
							sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
						/>
					) : (
						<iframe
							src={`${data3}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
							className='h-[20rem] w-full rounded-md border-none'
							title='Packing List PDF'
							allow='fullscreen'
							sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
						/>
					)}
				</div>
			</div>
			<Table packing_list_entry={data?.packing_list_entry} data={data} />
		</div>
	);
}
