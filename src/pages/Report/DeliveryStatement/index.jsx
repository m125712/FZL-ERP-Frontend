import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useDeliveryStatement } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__delivery_statement');
	const { user } = useAuth();

	const { data, isLoading, url } = useDeliveryStatement(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo(
		'Delivery Statement',
		url,
		'report__delivery_statement'
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
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: true,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}/${order_description_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			,
			{
				accessorKey: 'size',
				header: 'Size (cm)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_close_end_quantity',
				header: 'C/E',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_open_end_quantity',
				header: 'O/E',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity_dzn',
				header: 'Total (Dzn)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_price_dzn',
				header: 'Unit Price Dzn',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_price_pcs',
				header: 'Unit Price Pcs',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_value',
				header: 'Total Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
