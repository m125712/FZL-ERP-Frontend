import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useThreadChallan } from '@/state/Thread';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, LinkWithCopy, StatusButton } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData, updateData } = useThreadChallan();
	const info = new PageInfo('Challan', url, 'thread__challan');
	const haveAccess = useAccess('thread__challan');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'is_hand_delivery',
				header: (
					<span>
						Hand
						<br />
						Delivery
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'challan_id',
				header: 'ID',
				cell: (info) => {
					const { challan_id, uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={challan_id}
							id={uuid}
							uri='/thread/challan'
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				width: 'w-40',
				cell: (info) => {
					const { order_info_uuid } = info.row.original;
					return (
						<LinkWithCopy
							uri='/thread/order-info'
							id={order_info_uuid}
							title={info.getValue()}
						/>
					);
				},
			},
			{
				accessorKey: 'carton_quantity',
				header: 'Carton QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'vehicle_name',
				header: 'Assign To',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivery_cost',
				header: 'Delivery Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'gate_pass',
				header: 'Gate Pass',
				enableColumnFilter: false,
				cell: (info) => {
					const { gate_pass, received } = info.row.original;
					const access = haveAccess.includes('click_gate_pass');
					const overrideAccess = haveAccess.includes(
						'click_gate_pass_override'
					);
					return (
						<SwitchToggle
							disabled={
								overrideAccess
									? false
									: access
										? gate_pass === 1 || received === 1
										: true
							}
							onChange={() => handelGatePass(info.row.index)}
							checked={Number(info.getValue()) === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'received',
				header: 'Receive Status',
				enableColumnFilter: false,
				cell: (info) => {
					const { gate_pass, received } = info.row.original;

					const access = haveAccess.includes('click_receive_status');
					const overrideAccess = haveAccess.includes(
						'click_receive_status_override'
					);
					return (
						<SwitchToggle
							disabled={
								overrideAccess
									? false
									: access
										? gate_pass === 0 || received === 1
										: true
							}
							onChange={() => handelReceiveStatus(info.row.index)}
							checked={Number(info.getValue()) === 1}
						/>
					);
				},
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
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showDelete={haveAccess.includes('delete')}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
		],
		[data]
	);

	// Receive Status
	const handelReceiveStatus = async (idx) => {
		const challan = data[idx];
		const status = challan?.received == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await updateData.mutateAsync({
			url: `/thread/challan/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: { received: status, updated_at },
			isOnCloseNeeded: false,
		});
	};

	// Gate Pass
	const handelGatePass = async (idx) => {
		const challan = data[idx];
		const status = challan?.gate_pass == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await updateData.mutateAsync({
			url: `/thread/challan/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: { gate_pass: status, updated_at },
			isOnCloseNeeded: false,
		});
	};
	const handelAdd = () => navigate('/thread/challan/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/thread/challan/${uuid}/update`);
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
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
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
