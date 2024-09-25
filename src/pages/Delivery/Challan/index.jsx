import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useDeliveryChallan, useDeliveryPackingList } from '@/state/Delivery';
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
	const { data, isLoading, url, deleteData, updateData } =
		useDeliveryChallan();
	const info = new PageInfo('Challan', url, 'delivery__challan');
	const haveAccess = useAccess('delivery__challan');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'uuid',
				header: 'ID',
				cell: (info) => {
					const { challan_number } = info.row.original;
					return (
						<LinkWithCopy
							title={challan_number}
							id={info.getValue()}
							uri='/delivery/challan'
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
				accessorKey: 'assign_to_name',
				header: 'Assign To',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_status',
				header: 'Receive Status',
				enableColumnFilter: false,
				cell: (info) => (
					<SwitchToggle
						onChange={() => handelReceiveStatus(info.row.index)}
						checked={Number(info.getValue()) === 1}
					/>
				),
			},
			{
				accessorKey: 'gate_pass',
				header: 'Gate Pass',
				enableColumnFilter: false,
				cell: (info) => (
					<SwitchToggle
						onChange={() => handelGatePass(info.row.index)}
						checked={Number(info.getValue()) === 1}
					/>
				),
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
		const status = challan?.receive_status == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await updateData.mutateAsync({
			url: `/delivery/challan/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: { receive_status: status, updated_at },
			isOnCloseNeeded: false,
		});
	};

	// Gate Pass
	const handelGatePass = async (idx) => {
		const challan = data[idx];
		const status = challan?.gate_pass == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await updateData.mutateAsync({
			url: `/delivery/challan/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: { gate_pass: status, updated_at },
			isOnCloseNeeded: false,
		});
	};

	const handelAdd = () => navigate('/delivery/challan/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/delivery/challan/${uuid}/update`);
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
