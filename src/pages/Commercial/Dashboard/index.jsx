import { useEffect, useMemo } from 'react';
import { useCommercialDashboard } from '@/state/Commercial';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useCommercialDashboard();
	// console.log(data);

	const info = new PageInfo('Dashboard', url, 'commercial__dashboard');
	const haveAccess = useAccess('commercial__dashboard');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Cash Invoice ID',
				cell: (info) => {
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/commercial/pi-cash'
						/>
					);
				},
			},

			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/order/details'
					/>
				),
			},
			{
				accessorKey: 'value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_amount',
				header: 'Receive amount',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return <ReactTable title={info.getTitle()} data={data} columns={columns} />;
}
