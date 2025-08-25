import { useEffect, useState } from 'react';
import { useCommercialManualPIDetails } from '@/state/Commercial';
import { useParams } from 'react-router';

import PiPdfSheet from '@/components/Pdf/ManualProformaInvoice';
import PiPdfSheetStyleWise from '@/components/Pdf/ManualProformaInvoiceStyleWise';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { manual_pi_uuid } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialManualPIDetails(manual_pi_uuid);

	useEffect(() => {
		invalidateQuery();
		document.title = `MPI: ${manual_pi_uuid}`;
	}, [manual_pi_uuid]);

	// ! FOR TESTING
	const [data2, setData] = useState('');
	const [data3, setData3] = useState('');

	useEffect(() => {
		if (
			data &&
			(data?.manual_zipper_pi_entry || data?.manual_thread_pi_entry)
		) {
			PiPdfSheet(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
			PiPdfSheetStyleWise(data)?.getDataUrl((dataUrl) => {
				setData3(dataUrl);
			});
		}
	}, [data]);
	// ! FOR TESTING

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-6'>
			<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
				<iframe
					src={data2}
					className='h-[40rem] w-full rounded-md border-none'
				/>
				<iframe
					src={data3}
					className='h-[40rem] w-full rounded-md border-none'
				/>
			</div>
			<Information data={data} />
			<Table
				entries={data?.manual_zipper_pi_entry}
				title='Zipper Details'
			/>
			<Table
				entries={data?.manual_thread_pi_entry}
				title='Thread Details'
			/>
		</div>
	);
}
