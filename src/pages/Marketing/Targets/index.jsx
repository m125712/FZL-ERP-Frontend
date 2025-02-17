import { Suspense, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useMarketingTargets } from '@/state/Marketing';
import { useAccess } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddUpdate from './AddUpdate';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('marketing__targets');
	const { user } = useAuth();
	const { data, isLoading, url, deleteData } = useMarketingTargets(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo('Marketing Targets', url, 'marketing__targets');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'year',
				header: 'Year',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'month',
				header: 'Month',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_amount',
				header: 'Zipper Amount',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'thread_amount',
				header: 'Thread Amount',
				enableColumnFilter: true,
				width: 'w-36',
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

	// Add
	const handelAdd = () => window[info.getAddOrUpdateModalId()].showModal();

	// Update
	const [addUpdate, setAddUpdate] = useState({
		uuid: null,
		marketing_uuid: null,
		year: null,
		month: null,
		amount: null,
		remarks: null,
	});

	const handelUpdate = (idx) => {
		setAddUpdate((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));

		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({});

	const handelDelete = (idx) => {
		setDeleteItem(() => ({
			itemId: data[idx].uuid,
			itemName: data[idx].marketing_name,
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
				<AddUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						addUpdate,
						setAddUpdate,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/public/marketing-team-member-target',
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
