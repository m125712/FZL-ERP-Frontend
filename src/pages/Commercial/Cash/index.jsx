import { lazy, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useCommercialPIByQuery,
	useCommercialPICash,
} from '@/state/Commercial';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const ReceiveAmount = lazy(() => import('./ReceiveAmount'));

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?is_cash=true`;
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?is_cash=true&own_uuid=${userUUID}`;
	}

	return `?is_cash=true`;
};

export default function Index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('commercial__pi-cash');
	const { user } = useAuth();

	const { data, isLoading, url } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const info = new PageInfo('Cash Invoice', url, 'commercial__pi-cash');
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
						uri={`/commercial/pi-cash`}
					/>
				),
			},
			{
				accessorKey: 'total_amount',
				header: 'Total Value(BDT)',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().toLocaleString(),
			},
			{
				accessorFn: (row) => {
					const { order_numbers, thread_order_numbers } = row;
					return [...order_numbers, ...thread_order_numbers];
				},
				id: 'order_numbers',
				header: 'O/N',
				width: 'w-28',
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
							orderNumber.thread_order_number?.includes('TO');
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
				width: 'w-32',
				cell: (info) => info.getValue()?.join(', '),
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
				accessorKey: 'actions1',
				header: 'Add Receive Amount',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_receive_amount'),
				width: 'w-30',
				cell: (info) => (
					<Transfer
						onClick={() =>
							handleUpdateReceiveAmount(info.row.index)
						}
					/>
				),
			},
			{
				accessorKey: 'receive_amount',
				header: 'Receive Amount',
				enableColumnFilter: false,
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
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
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

	const handelAdd = () => navigate('/commercial/pi-cash/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/commercial/pi-cash/${uuid}/update`);
	};

	const [updateReceiveAmount, setUpdateReceiveAmount] = useState({
		uuid: '',
		max_amount: 0,
		pi_uuid: '',
		PI_ID: '',
	});
	const handleUpdateReceiveAmount = (idx) => {
		const selected = data[idx];
		setUpdateReceiveAmount((prev) => ({
			...prev,
			...selected,
			pi_uuid: selected.uuid,
			max_amount: selected.total_amount - selected.receive_amount,
			PI_ID: selected.id,
		}));
		window['add_receive_amount_modal'].showModal();
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
			<Suspense>
				<ReceiveAmount
					modalId={'add_receive_amount_modal'}
					{...{
						updateReceiveAmount,
						setUpdateReceiveAmount,
					}}
				/>
			</Suspense>
		</div>
	);
}
