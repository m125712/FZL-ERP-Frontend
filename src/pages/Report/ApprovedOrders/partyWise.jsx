import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useApprovedOrdersPartyWise } from '@/state/Report';
import numeral from 'numeral';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__approved_orders');
	const { user } = useAuth();

	const [status, setStatus] = useState('pending');
	const { data, isLoading } = useApprovedOrdersPartyWise(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'not_approved',
				header: 'Not Approved',
				enableColumnFilter: false,
				cell: (info) => numeral(info.getValue()).format('0.0a'),
			},
			{
				accessorKey: 'approved',
				header: 'Approved',
				enableColumnFilter: false,
				cell: (info) => numeral(info.getValue()).format('0.0a'),
			},
		],
		[data, status]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={'Party Wise'}
			accessor={false}
			data={data}
			columns={columns}
		/>
	);
}
