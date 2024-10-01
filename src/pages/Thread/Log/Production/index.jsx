import { useMemo, useState } from 'react';
import { useConningProdLog, useDyeingCone } from '@/state/Thread';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

import SFGAddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, isLoading, deleteData } = useConningProdLog();
	const { invalidateQuery } = useDyeingCone();
	const info = new PageInfo(
		'Production Log',
		'sfg/trx/by/teeth_molding_prod/by/vislon'
	);

	const haveAccess = useAccess('vislon__teeth_molding_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_number',
				header: 'Order No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'count_length',
				header: 'Count Length',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_quantity',
				header: 'Batch QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'production_quantity',
				header: 'Production QTY (PCS)',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'coning_carton_quantity',
				header: 'Carton',
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
				hidden: !haveAccess.includes('click_update_sfg'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('click_delete_sfg')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateConingProd, setUpdateConingProd] = useState({
		uuid: null,
		batch_entry_uuid: null,
		coning_carton_quantity: null,
		production_quantity: null,
		wastage: null,
		remarks: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateConingProd((prev) => ({
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
			itemName: data[idx].uuid,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				// handelAdd={handelAdd}
				// accessor={haveAccess.includes('click_update_sfg')}
				data={data}
				columns={columns}
			/>
			<Suspense>
				<SFGAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateConingProd,
						setUpdateConingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					deleteData={deleteData}
					invalidateQuery={invalidateQuery}
					url={`/thread/batch-entry-production`}
				/>
			</Suspense>
		</div>
	);
}
