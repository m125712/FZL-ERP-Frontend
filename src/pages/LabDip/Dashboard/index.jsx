import { useEffect, useMemo } from 'react';
import { useLabDipDashboard } from '@/state/LabDip';
import { usePIRegister } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, LinkWithCopy, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useLabDipDashboard();
	const info = new PageInfo('DashBoard', url, 'lab_dip__dashboard');

	const haveAccess = useAccess('lab_dip__dashboard');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'Order ID',
				width: 'w-32',
				cell: (info) => {
					const { order_number } = info.row.original;
					const { is_zipper_order } = info.row.original;
					const { order_info_uuid } = info.row.original;
					if (is_zipper_order) {
						return (
							<LinkWithCopy
								title={info.getValue()}
								id={order_number}
								uri='/order/details'
							/>
						);
					} else {
						return (
							<LinkWithCopy
								uri='/thread/order-info'
								id={order_info_uuid}
								title={info.getValue()}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'info_name',
				header: 'Card',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					const { approved } = row;
					if (approved === 1) {
						return 'Approved';
					}
					if (approved === 0) {
						return 'Not Approved';
					}
				},
				id: 'approved',
				header: 'Approved Status',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						className={'btn-xs'}
						value={info.row.original.approved}
					/>
				),
			},
			{
				accessorFn: (row) => {
					if (row.approved_date === null) {
						return '--';
					} else {
						return format(row.approved_date, 'dd/MM/yy');
					}
				},
				id: 'approved_date',
				header: 'Approved Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.row.original.approved_date} />
				),
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
