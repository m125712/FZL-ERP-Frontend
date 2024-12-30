import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useCommonMultiColorDashboard } from '@/state/Common';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { EditDelete, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Order = lazy(() => import('./Order'));
const TapeReceived = lazy(() => import('./TapeReceived'));

export default function Index() {
	const { data, isLoading, url, updateData } = useCommonMultiColorDashboard();
	const info = new PageInfo(
		'Dashboard',
		url,
		'common__multi_color_dashboard'
	);

	const haveAccess = useAccess('common__multi_color_dashboard');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actual_tape_quantity',
				header: 'Total (KG)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'expected_tape_quantity',
				header: 'Expected (KG)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'tape_received_add',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_receive'),
				width: 'w-8',
				cell: (info) => {
					const {
						tape_quantity,
						coil_quantity,
						thread_quantity,
						thread_uuid,
						coil_uuid,
						tape_coil_uuid,
						expected_tape_quantity,
					} = info.row.original;
					return (
						<Transfer
							onClick={() => handelTapeReceived(info.row.index)}
							disabled={
								expected_tape_quantity > 0 &&
								tape_quantity > 0 &&
								coil_quantity > 0 &&
								thread_quantity > 0 &&
								thread_uuid &&
								coil_uuid &&
								tape_coil_uuid
									? false
									: true
							}
						/>
					);
				},
			},
			{
				// accessorKey: 'tape_received',
				accessorKey: 'multi_color_tape_received',
				header: 'Received (KG)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_swatch_approved',
				header: 'Lab Dip',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<SwitchToggle
							disabled={!haveAccess.includes('click_approve_swatch')}
							onChange={() =>
								handelSwitch(info.row.index, 'labdip')
							}
							checked={info.getValue() === 1}
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					if (!row.tape_name) return '-';
					return row.tape_name + ' ' + row.tape_quantity;
				},
				id: 'tape',
				header: 'Tape',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { tape_name, tape_quantity } = row.original;
					if (!tape_name) return '-';
					return (
						<div className='flex flex-col'>
							<span className='capitalize'>{tape_name}</span>
							<span>{tape_quantity}</span>
						</div>
					);
				},
			},
			{
				accessorFn: (row) => {
					if (!row.coil_name) return '-';
					return row.coil_name + ' ' + row.coil_quantity;
				},
				id: 'coil',
				header: 'Coil',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { coil_name, coil_quantity } = row.original;
					if (!coil_name) return '-';
					return (
						<div className='flex flex-col'>
							<span className='capitalize'>{coil_name}</span>
							<span>{coil_quantity}</span>
						</div>
					);
				},
			},

			{
				accessorFn: (row) => {
					if (!row.thread_name) return '-';
					return row.thread_name + '-' + row.thread_quantity;
				},
				id: 'thread',
				header: 'Sewing Thread',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { thread_name, thread_quantity } = row.original;
					if (!thread_name) return '-';
					return (
						<div className='flex flex-col'>
							<span className='capitalize'>{thread_name}</span>
							<span>{thread_quantity}</span>
						</div>
					);
				},
			},

			{
				accessorKey: 'sewing_section',
				header: (
					<div>
						<div className='border-b-2 border-primary'>
							Sewing Section
						</div>
						<div className='flex justify-between'>
							<span>Coil</span>
							<span>Thread</span>
						</div>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const {
						is_coil_received_sewing,
						is_thread_received_sewing,
					} = info.row.original;
					return (
						<div className='flex gap-4'>
							<SwitchToggle
								disabled={!haveAccess.includes('click_approve_coil')}
								onChange={() =>
									handelSwitch(info.row.index, 'coil')
								}
								checked={is_coil_received_sewing === 1}
							/>
							<SwitchToggle
								disabled={!haveAccess.includes('click_approve_thread')}
								onChange={() =>
									handelSwitch(info.row.index, 'thread')
								}
								checked={is_thread_received_sewing === 1}
							/>
						</div>
					);
				},
			},

			{
				accessorKey: 'action_add_production',
				header: 'Action',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-8',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelProduction}
						showDelete={false}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
		],
		[data]
	);

	const [order, setOrder] = useState({
		uuid: null,
	});

	const handelProduction = (idx) => {
		const val = data[idx];

		setOrder((prev) => ({
			...prev,
			...val,
		}));

		window['Order'].showModal();
	};

	const [tapeReceived, setTapeReceived] = useState({
		uuid: null,
	});

	const handelTapeReceived = (idx) => {
		const val = data[idx];

		setTapeReceived((prev) => ({
			...prev,
			...val,
		}));

		window['TapeReceived'].showModal();
	};

	const handelSwitch = async (idx, type) => {
		const val = data[idx];

		if (type === 'labdip') {
			await updateData.mutateAsync({
				url: `/zipper/multi-color-dashboard/${val?.uuid}`,
				updatedData: {
					is_swatch_approved: val.is_swatch_approved ? 0 : 1,
				},
			});
		} else if (type === 'coil') {
			await updateData.mutateAsync({
				url: `/zipper/multi-color-dashboard/${val?.uuid}`,
				updatedData: {
					is_coil_received_sewing: val.is_coil_received_sewing
						? 0
						: 1,
				},
			});
		} else if (type === 'thread') {
			await updateData.mutateAsync({
				url: `/zipper/multi-color-dashboard/${val?.uuid}`,
				updatedData: {
					is_thread_received_sewing: val.is_thread_received_sewing
						? 0
						: 1,
				},
			});
		}
	};

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
			<Suspense>
				<Order
					modalId='Order'
					{...{
						order,
						setOrder,
					}}
				/>
			</Suspense>

			<Suspense>
				<TapeReceived
					modalId='TapeReceived'
					{...{
						tapeReceived,
						setTapeReceived,
					}}
				/>
			</Suspense>
		</>
	);
}
