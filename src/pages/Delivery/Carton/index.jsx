import { lazy, useEffect, useMemo, useState } from 'react';
import { useDeliveryCarton } from '@/state/Delivery';
import { useThreadDyesCategory } from '@/state/Thread';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData, updateData } =
		useDeliveryCarton();

	const info = new PageInfo('Delivery Carton', url, 'delivery__carton');
	const haveAccess = useAccess('delivery__carton');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'active',
				header: 'Active',
				enableColumnFilter: false,
				cell: (info) => {
					const access = haveAccess.includes('click_active');
					const overrideAccess = haveAccess.includes(
						'click_active_override'
					);
					return (
						<SwitchToggle
							disabled={
								!overrideAccess &&
								(!access || Number(info.getValue()) !== 1)
							}
							onChange={() =>
								handleActiveStatusChange(info.row.index)
							}
							checked={Number(info.getValue()) === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'size',
				header: 'Size',
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
				accessorKey: 'used_for',
				header: 'Used For',
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
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handleUpdate}
							handelDelete={handleDelete}
							showUpdate={haveAccess.includes('update')}
							showDelete={haveAccess.includes('delete')}
						/>
					);
				},
			},
		],
		[data]
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const [update, setUpdate] = useState({
		uuid: null,
	});

	const handleUpdate = (idx) => {
		setUpdate((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleDelete = (idx) => {
		setDeleteItem((prev) => ({
			itemId: data[idx].uuid,
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};
	const handleActiveStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				active: data[idx]?.active === 1 ? 0 : 1,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					update={update}
					setUpdate={setUpdate}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					url={url}
					deleteData={deleteData}
				/>
			</Suspense>
		</div>
	);
}
