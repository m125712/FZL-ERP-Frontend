import React, { useMemo, useState } from 'react';
import { useCommonTapeSFG, useCommonTapeToCoil } from '@/state/Common';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddOrUpdate from './AddOrUpdate';

export default function TapeToCoil() {
	const { data, isLoading, url, deleteData } = useCommonTapeToCoil();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const info = new PageInfo('Tape -> Stock/Coil', 'tape-to-coil-trx');
	const haveAccess = useAccess('common__tape_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},

			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'to_section',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'trx_quantity',
				header: (
					<span>
						Quantity
						<br />
						(KG)
					</span>
				),
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
					!haveAccess.includes('click_update_tape_to_coil') &&
					!haveAccess.includes('click_delete_tape_to_coil'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'click_delete_tape_to_coil'
							)}
							showUpdate={haveAccess.includes(
								'click_update_tape_to_coil'
							)}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateTapeLog, setUpdateTapeLog] = useState({
		uuid: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		quantity: null,
		tape_prod: null,
		coil_stock: null,
		trx_quantity: null,
		trx_quantity_in_dying: null,
		to_section: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateTapeLog((prev) => ({
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
			itemName: data[idx].type_of_zipper,
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
				extraClass='py-2'
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateTapeLog,
						setUpdateTapeLog,
					}}
				/>
			</Suspense>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					invalidateQuery={invalidateCommonTapeSFG}
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
