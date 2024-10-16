import { useEffect, useMemo } from 'react';
import { useProductionReport } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useProductionReport();
	const info = new PageInfo(
		'Production Report',
		url,
		'report__production_report'
	);
	const haveAccess = useAccess('report__production_report');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'item_name',
				header: 'Batch',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'parties',
				header: 'Parties',
				enableColumnFilter: false,
				cell: (info) => {
					const { parties } = info.row.original;
					return parties.map((party) => {
						return (
							<div className='border'>{party?.party_name}</div>
						);
					});
				},
			},
			{
				accessorKey: 'orders',
				header: 'Orders',
				enableColumnFilter: false,
				cell: (info) => {
					const { parties } = info.row.original;
					return parties.map((party) => {
						return party?.orders.map((order) => {
							return (
								<div className='border'>
									{order?.order_number}
								</div>
							);
						});
					});
				},
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
