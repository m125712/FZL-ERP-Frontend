import { useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { usePIToBeSubmittedByMarketing } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink } from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__pi_to_be_submitted');
	const { user } = useAuth();

	const { data, isLoading } = usePIToBeSubmittedByMarketing(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'marketing_name',
				header: 'Marketing.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					return row.order_object
						.map((order) => order.label)
						.join(' -- ');
				},
				id: 'order_object',
				header: 'O/N',
				width: 'w-40',
				enableColumnFilter: false,
				cell: (info) => {
					const orderNumbers = info.row.original.order_object;
					return orderNumbers?.map((orderNumber) => {
						if (orderNumber === null) return;
						const isThreadOrder = orderNumber.label?.includes('ST');
						const number = orderNumber.label;
						const uuid = orderNumber.value;
						return (
							<CustomLink
								label={number}
								url={
									isThreadOrder
										? `/thread/order-info/${uuid}`
										: `/order/details/${number}`
								}
								openInNewTab={true}
							/>
						);
					});
				},
			},
			{
				accessorKey: 'total_quantity',
				header: 'Order  QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'total_quantity_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivered',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivered_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_pi',
				header: 'PI Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_pi_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_non_pi',
				header: 'Non PI Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'total_non_pi_value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={'PI To Be Submit (Marketing Wise)'}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
