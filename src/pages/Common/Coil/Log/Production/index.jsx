import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useCommonCoilProduction, useCommonCoilSFG } from '@/state/Common';
import { DateTime, EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import React, { useMemo, useState } from 'react';
import AddOrUpdate from './AddOrUpdate';

export default function ProductionLog() {
	const info = new PageInfo(
		'Coil Productions',
		'tape-or-coil-prod-section/coil'
	);

	const { data, isLoading, url, deleteData } = useCommonCoilProduction();
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	const haveAccess = useAccess('common__coil_log');
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
				cell: (info) => Number(info.getValue()),
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
					!haveAccess.includes('click_update_coil_production') &&
					!haveAccess.includes('click_delete_coil_production'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'click_delete_coil_production'
							)}
							showUpdate={haveAccess.includes(
								'click_update_coil_production'
							)}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateCoilLog, setUpdateCoilLog] = useState({
		uuid: null,
		tape_type: null,
		tape_or_coil_stock_id: null,
		production_quantity: null,
		tape_prod: null,
		trx_quantity_in_coil: null,
		wastage: null,
		issued_by_name: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];

		setUpdateCoilLog((prev) => ({
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
	// invalidateCommonCoilSFG();

	// if (error) return <h1>Error:{error}</h1>;

	// Fetching data from server

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateCoilLog,
						setUpdateCoilLog,
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
