import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionReport } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `own_uuid=${userUUID}&approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return 'all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=false`;
};

export default function Index() {
	const haveAccess = useAccess('report__production_report_sm');
	const { user } = useAuth();

	const { data, isLoading, url } = useProductionReport(
		`sales-marketing?${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo(
		'Production Report S&M (Zipper)',
		url,
		'report__production_report_sm'
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'item_name',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
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
