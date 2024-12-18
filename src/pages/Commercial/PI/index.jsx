import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useCommercialPIByQuery } from '@/state/Commercial';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?is_cash=false`;
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?is_cash=false&own_uuid=${userUUID}`;
	}

	return `?is_cash=false`;
};

export default function Index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('commercial__pi');
	const { user } = useAuth();

	const { data, isLoading, url } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const info = new PageInfo('PI', url, 'commercial__pi');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'PI ID',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri={`/commercial/pi`}
					/>
				),
			},
			{
				accessorKey: 'lc_number',
				header: 'LC Number',
				enableColumnFilter: false,
				cell: (info) => {
					const { lc_uuid } = info.row.original;

					if (!info.getValue()) {
						return '-/-';
					}

					if (info.getValue() === '-') {
						return info.getValue();
					} else {
						return (
							<LinkWithCopy
								title={info.getValue()}
								id={lc_uuid}
								uri={`/commercial/lc/details`}
							/>
						);
					}
				},
			},
			{
				accessorFn: (row) => {
					const { order_numbers, thread_order_numbers } = row;
					return [...order_numbers, ...thread_order_numbers];
				},
				id: 'order_numbers',
				header: 'O/N',
				width: 'w-40',
				enableColumnFilter: false,
				cell: (info) => {
					const orderNumbers = info.getValue();
					return orderNumbers?.map((orderNumber) => {
						if (
							orderNumber.thread_order_info_uuid === null ||
							orderNumber.order_info_uuid === null
						)
							return;
						const isThreadOrder =
							orderNumber.thread_order_number?.includes('STS');
						const number = isThreadOrder
							? orderNumber.thread_order_number
							: orderNumber.order_number;
						const uuid = isThreadOrder
							? orderNumber.thread_order_info_uuid
							: orderNumber.order_info_uuid;
						return (
							<LinkWithCopy
								key={number}
								title={number}
								id={isThreadOrder ? uuid : number}
								uri={
									isThreadOrder
										? '/thread/order-info'
										: '/order/details'
								}
							/>
						);
					});
				},
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue()?.join(', '),
			},
			{
				accessorKey: 'total_amount',
				header: 'Total Value(USD)',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().toLocaleString(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bank_name',
				header: 'Bank',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showDelete={false}
					/>
				),
			},
		],
		[data]
	);

	const handelAdd = () => navigate('/commercial/pi/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/commercial/pi/${uuid}/update`);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
				handelAdd={handelAdd}
			/>
		</div>
	);
}
