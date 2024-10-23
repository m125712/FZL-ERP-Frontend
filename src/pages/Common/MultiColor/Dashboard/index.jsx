import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useCommonMultiColorDashboard } from '@/state/Common';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, StatusButton, Transfer } from '@/ui';

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
				accessorKey: 'expected_tape_quantity',
				header: 'Expected Total KG',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'tape_received_add',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				// hidden: !haveAccess.includes('click_production'),
				width: 'w-8',
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelTapeReceived(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'tape_received',
				header: 'Received',
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
							disabled={false}
							onChange={() =>
								handelSwitch(info.row.index, 'labdip')
							}
							checked={info.getValue() === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'tape_name',
				header: 'Tape',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'tape_quantity',
				header: 'Tape QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'coil_name',
				header: 'Coil',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coil_quantity',
				header: 'Coil QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'thread_name',
				header: 'Sewing Thread',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'thread_quantity',
				header: 'Thread QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'sewing_section',
				header: (
					<div>
						<div className='border-b-2 border-gray-300'>
							Sewing Section
						</div>
						<div className='flex justify-between'>
							<div>Coil</div>
							<div>Thread</div>
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
								disabled={false}
								onChange={() =>
									handelSwitch(info.row.index, 'coil')
								}
								checked={is_coil_received_sewing === 1}
							/>
							<SwitchToggle
								disabled={false}
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
				accessorKey: 'actual_tape_quantity',
				header: 'Actual Received KG',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_add_production',
				header: 'Action',
				enableColumnFilter: false,
				enableSorting: false,
				// hidden: !haveAccess.includes('click_production'),
				width: 'w-8',
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
						/>
					);
				},
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
