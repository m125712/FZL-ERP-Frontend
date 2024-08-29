import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';

import { useVislonFinishingRM, useVislonFinishingRMLog } from '@/state/Vislon';
import { DateTime, EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { useEffect, useMemo, useState } from 'react';
import RMAddOrUpdate from './RMAddOrUpdate';

export default function Index() {
	const { data, isLoading, url, deleteData } = useVislonFinishingRMLog();
	const info = new PageInfo(
		'Finishing RM Used Log',
		url,
		'vislon__finishing_log'
	);
	const haveAccess = useAccess(info.getTab());
	const { invalidateQuery: invalidateFinishingRM } = useVislonFinishingRM();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'section',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>
							{info.getValue()?.replace(/_|n_/g, ' ')}
						</span>
					);
				},
			},
			{
				accessorKey: 'used_quantity',
				header: 'Used QTY',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'wastage',
				header: 'Wastage',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_update_rm'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('click_delete_rm')}
						/>
					);
				},
			},
		],
		[data]
	);
	// { label: 'Vislon Gapping', value: 'v_gapping' },
	// { label: 'Vislon Teeth Cleaning', value: 'v_teeth_cleaning' },
	// { label: 'Vislon Sealing', value: 'v_sealing' },
	// 	{ label: 'Vislon Stopper', value: 'v_stopper' },
	//{ label: 'Vislon T Cutting', value: 'v_t_cutting' }
	// Update
	const [updateFinishingRMLog, setUpdateFinishingRMLog] = useState({
		uuid: null,
		section: null,
		material_name: null,
		v_teeth_cleaning: null,
		v_gapping: null,
		v_sealing: null,
		v_t_cutting: null,
		v_stopper: null,
		used_quantity: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateFinishingRMLog((prev) => ({
			...prev,
			...selected,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
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
			itemName: data[idx].material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
		}));

		window[info.getDeleteModalId()].showModal();
	};
	invalidateFinishingRM();

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<RMAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateFinishingRMLog,
						setUpdateFinishingRMLog,
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
						url: `/material/used`,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
