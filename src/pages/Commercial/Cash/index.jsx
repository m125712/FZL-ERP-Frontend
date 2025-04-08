import { lazy, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useCommercialPIByQuery } from '@/state/Commercial';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { CustomLink, DateTime, EditDelete, StatusSelect, Transfer } from '@/ui';

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
	const [status, setStatus] = useState('pending');
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
	];

	const navigate = useNavigate();
	const haveAccess = useAccess('commercial__pi-cash');
	const { user } = useAuth();

	const { data, isLoading, url, updateData } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid) + `&type=${status}`,
		{
			enabled: !!user?.uuid,
		}
	);

	const info = new PageInfo('Cash Invoice', url, 'commercial__pi-cash');
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const handelCompleteStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/commercial/pi-cash-update-is-completed/${data[idx]?.uuid}`,
			updatedData: {
				is_completed: data[idx]?.is_completed === true ? false : true,
			},
			isOnCloseNeeded: false,
		});
	};

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.id,
				id: 'cash_invoice_id',
				header: 'C/I',
				enableColumnFilter: true,
				width: 'w-36',
				cell: ({ row }) => (
					<CustomLink
						label={row.original.id}
						url={`/commercial/pi-cash/${row.original.id}`}
					/>
				),
			},
			{
				accessorKey: 'total_amount',
				header: (
					<>
						Total Value <br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toLocaleString(),
			},
			{
				accessorKey: 'actions1',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_receive_amount'),
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
				header: (
					<>
						Received <br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toLocaleString(),
			},
			{
				accessorFn: (row) => {
					const { order_numbers, thread_order_numbers } = row;
					const zipper =
						order_numbers
							.map((order) => order.order_number)
							.join(', ') || '';
					const thread =
						thread_order_numbers
							.map((order) => order.thread_order_number)
							.join(', ') || '';

					if (zipper.length > 0 && thread.length > 0)
						return `${zipper}, ${thread}`;

					if (zipper.length > 0) return zipper;

					if (thread.length > 0) return thread;

					return '--';
				},
				id: 'order_numbers',
				header: 'O/N',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { order_numbers, thread_order_numbers } =
						row.original;

					let links = [];

					order_numbers
						.filter((order) => order.order_info_uuid)
						.forEach((order) => {
							links.push({
								label: order.order_number,
								url: `/order/details/${order.order_number}`,
							});
						});

					thread_order_numbers
						.filter((order) => order.thread_order_info_uuid)
						.forEach((order) => {
							links.push({
								label: order.thread_order_number,
								url: `/thread/order-info/${order.thread_order_info_uuid}`,
							});
						});

					return links.map((link, index) => (
						<CustomLink
							key={index}
							label={link.label}
							url={link.url}
						/>
					));
				},
			},
			{
				accessorFn: (row) => row.order_type.join(', ') || '--',
				id: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'is_completed',
				header: 'Completed',
				enableColumnFilter: false,
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_complete'
					);

					return (
						<SwitchToggle
							disabled={!permission}
							onChange={() => {
								handelCompleteStatus(info.row.index);
							}}
							checked={info.getValue() === true}
						/>
					);
				},
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
				extraButton={
					<StatusSelect
						options={options}
						status={status}
						setStatus={setStatus}
					/>
				}
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
