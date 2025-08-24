import { useEffect } from 'react';
import { useParams } from 'react-router';

import { useVoucherByUUID } from '../config/query';
import Information from './Information';
import { default as Table, default as VoucherDetailsTable } from './Table';

export default function Index() {
	const { uuid } = useParams();

	const { data, isLoading } = useVoucherByUUID(uuid);

	useEffect(() => {
		document.title = 'Voucher Details';
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className={'space-y-8'}>
			<Information voucher={data} />
			<VoucherDetailsTable data={data} />
		</div>
	);
}
