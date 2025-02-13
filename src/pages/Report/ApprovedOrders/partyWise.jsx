import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useApprovedOrdersPartyWise } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, Status, StatusButton } from '@/ui';

import { cn } from '@/lib/utils';

export default function Index() {
	const haveAccess = useAccess('report__zipper_production');
	const { user } = useAuth();

	const [status, setStatus] = useState('pending');
	const { data, isLoading } = useApprovedOrdersPartyWise();

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
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'approved',
				header: 'Approved',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data, status]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	let rowStyle = 'border border-gray-300 px-2 py-1';
	return (
		<ReactTable
			title={'Party Wise'}
			accessor={false}
			data={data}
			columns={columns}
		/>
	);
}
