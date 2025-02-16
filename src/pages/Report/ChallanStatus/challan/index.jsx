import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useChallanStatusReport } from '@/state/Report';
import { useAccess } from '@/hooks';

import ChallanStatusSheetPdf from '@/components/Pdf/ChallanStatusReport';

import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__challan_status');
	const { user } = useAuth();

	const [order, setOrder] = useState('');

	const { data, isLoading } = useChallanStatusReport(order);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-8'>
			<Header
				{...{
					order,
					setOrder,
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => ChallanStatusSheetPdf(data)?.open()}
					className='btn btn-primary flex-1'
				>
					PDF
				</button>
			</div>
		</div>
	);
}
