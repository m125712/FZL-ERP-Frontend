import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { useOrderStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { useAccess } from '@/hooks';

import OrderSheetPdf from '@/components/Pdf/OrderStatement';

import { api } from '@lib/api';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [party, setParty] = useState('');
	const { data: garments } = useOtherOrderPropertiesByGarmentsWash();
	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement();
	// const { data, isLoading } = useOrderStatementReport(
	// 	from,
	// 	to,
	// 	party,
	// 	marketing,
	// 	type,
	// 	getPath(haveAccess, user?.uuid),
	// 	{
	// 		isEnabled: !!user?.uuid && get,
	// 	}
	// );

	// useEffect(() => {
	// 	if (get && data && !isLoading) {
	// 		OrderSheetPdf(data, garments, sr, from, to)?.open();
	// 		setGet(false);
	// 	}
	// }, [get, data, isLoading]);

	const handlePdf = async (type) => {
		setIsLoading(true);
		try {
			const path = getPath(haveAccess, user?.uuid);

			const response = await api.get(
				`/report/order-sheet-pdf-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&type=${type}&${path}`
			);

			const data = response?.data?.data || [];

			if (type == 'pdf') {
				const pdf = OrderSheetPdf(data, garments, sr, from, to); // should return pdfDoc from pdfmake.createPdf()

				// Wait for PDF to be ready before opening
				pdf.getBlob((blob) => {
					const url = URL.createObjectURL(blob);
					window.open(url); // or use a new tab/window
				});
			} else {
				Excel(data, from, to);
			}
		} catch (error) {
			console.error('Failed to generate PDF:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// if (isLoading)
	// 	return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-8'>
			<Header
				{...{
					from,
					setFrom,
					to,
					setTo,
					marketing,
					setMarketing,
					type,
					setType,
					party,
					setParty,
					isLoading,
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => {
						handlePdf('pdf');
					}}
					className='btn btn-primary flex-1'
					disabled={isLoading}
				>
					{isLoading && <LoaderCircle className='animate-spin' />}
					PDF
				</button>
				{/* <button
					type='button'
					onClick={() => Excel(data, from, to)}
					className='btn btn-secondary flex-1'>
					Excel
				</button> */}
			</div>
		</div>
	);
}
