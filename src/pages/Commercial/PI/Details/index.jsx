import { useEffect, useState } from 'react';
import { useCommercialPIDetailsByPiId } from '@/state/Commercial';
import { useParams } from 'react-router';

import PiPdfSheet from '@/components/Pdf/ProformaInvoice';
import PiPdfSheetWithDzn from '@/components/Pdf/ProformaInvoiceOnlyDzn';
import PiPdfSheetWihPCS from '@/components/Pdf/ProformaInvoiceOnlyPCS';

import Information from './Information';
import ThreadTable from './Table/ThreadTable';
import ZipperTable from './Table/ZipperTable';

export default function Index() {
	const { pi_id } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialPIDetailsByPiId(pi_id);

	useEffect(() => {
		invalidateQuery();
		document.title = `PI: ${pi_id}`;
	}, [pi_id]);
	// ! FOR TESTING
	const [data2, setData] = useState('');
	const [data3, setData3] = useState('');
	const [data4, setData4] = useState('');

	useEffect(() => {
		if (data && data?.pi_cash_entry) {
			PiPdfSheet(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
			PiPdfSheetWithDzn(data)?.getDataUrl((dataUrl) => {
				setData3(dataUrl);
			});
			PiPdfSheetWihPCS(data)?.getDataUrl((dataUrl) => {
				setData4(dataUrl);
			});
		}
	}, [data]);

	// ! FOR TESTING

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-4'>
			<div className='flex gap-2'>
				<iframe
					src={data2}
					className='h-[40rem] w-full rounded-md border-none'
				/>
			</div>
			<div className='flex gap-2'>
				<iframe
					src={data3}
					className='h-[40rem] w-full rounded-md border-none'
				/>
				<iframe
					src={data4}
					className='h-[40rem] w-full rounded-md border-none'
				/>
			</div>

			<Information pi={data} />

			{data?.pi_cash_entry.length > 0 && (
				<ZipperTable pi={data?.pi_cash_entry} />
			)}

			{data?.pi_cash_entry_thread.length > 0 && (
				<ThreadTable
					pi_cash_entry_thread={data?.pi_cash_entry_thread}
				/>
			)}
		</div>
	);
}
