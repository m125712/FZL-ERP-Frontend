import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { useCommonTapeProduction, useCommonTapeSFG } from '@/state/Common';
import { EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import React, { useEffect, useMemo, useState } from 'react';
import AddOrUpdate from './AddOrUpdate';

export default function ProductionLog() {
	const info = new PageInfo(
		'Tape Production Log',
		'tape-or-coil-prod-section/tape'
	);
	const { data, isLoading, url, deleteData } = useCommonTapeProduction();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const haveAccess = useAccess('common__tape_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'type_of_zipper',
				header: 'Type of Zipper',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'production_quantity',
				header: (
					<span>
						Quantity
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'wastage',
				header: (
					<span>
						Wastage
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
				hidden: !haveAccess.includes('click_update_tape_production'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'click_delete_tape_production'
							)}
						/>
					);
				},
			},
		],
		[data]
	);
	//const deleteUrl = '/zipper/tape-coil-production';

	// Update
	const [updateTapeLog, setUpdateTapeLog] = useState({
		uuid: null,
		tape_type: null,
		tape_or_coil_stock_id: null,
		production_quantity: null,
		tape_prod: null,
		coil_stock: null,
		wastage: null,
		issued_by_name: null,
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
	invalidateCommonTapeSFG();

	// if (error) return <h1>Error:{error}</h1>;

	// Fetching data from server

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
					{...{
						deleteItem,
						setDeleteItem,
						url: `/zipper/tape-coil-production`,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
