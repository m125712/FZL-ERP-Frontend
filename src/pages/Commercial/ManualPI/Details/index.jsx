import { useEffect, useState } from 'react';
import { useCommercialManualPIDetails } from '@/state/Commercial';
import { useParams } from 'react-router-dom';

// import PiPdfSheet from '@/components/Pdf/ManualProformaInvoice';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { manual_pi_uuid } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialManualPIDetails(manual_pi_uuid);

	useEffect(() => {
		invalidateQuery();
		document.title = `LC: ${manual_pi_uuid}`;
	}, [manual_pi_uuid]);

	// // ! FOR TESTING
	// const [data2, setData] = useState('');

	// useEffect(() => {
	// 	if (data && data?.manual_pi_entry) {
	// 		PiPdfSheet(data)?.getDataUrl((dataUrl) => {
	// 			setData(dataUrl);
	// 		});
	// 	}
	// }, [data]);
	// // ! FOR TESTING

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-6'>
			{/* <iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/> */}
			<Information data={data} />
			<Table entries={data?.manual_pi_entry} />
		</div>
	);
}
