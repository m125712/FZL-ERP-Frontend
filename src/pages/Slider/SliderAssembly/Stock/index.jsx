import { lazy, useEffect, useMemo, useState } from 'react';
import { useSliderAssemblyStock } from '@/state/Slider';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));
const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useSliderAssemblyStock();
	const info = new PageInfo('Stock', url, 'slider__assembly_stock');
	const haveAccess = useAccess('slider__assembly_stock');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_body_name',
				header: 'Body',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_body_quantity',
				header: 'Body QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_cap_name',
				header: 'Cap',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_cap_quantity',
				header: 'Cap QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_link_name',
				header: 'Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_link_quantity',
				header: 'Link QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_puller_name',
				header: 'Puller',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_puller_quantity',
				header: 'Puller QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_add_production',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				// hidden: !haveAccess.includes('click_production'),
				width: 'w-8',
				cell: (info) => {
					const { min_quantity_with_link, min_quantity_no_link } =
						info.row.original;
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
							disabled={
								min_quantity_with_link <= 0 &&
								min_quantity_no_link <= 0
									? true
									: false
							}
						/>
					);
				},
			},
			{
				accessorKey: 'quantity',
				header: 'Total Prod (PCS)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'weight',
				header: 'Total Weight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_add_transaction',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				// hidden: !haveAccess.includes('click_transaction'),
				width: 'w-8',
				cell: (info) => {
					const { quantity, weight } = info.row.original;
					return (
						<Transfer
							onClick={() => handelTransaction(info.row.index)}
							disabled={
								quantity <= 0 || weight <= 0 ? true : false
							}
						/>
					);
				},
			},
			{
				accessorKey: 'total_transaction_quantity',
				header: 'Total Trx',
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
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// production
	const [updateSliderProd, setUpdateSliderProd] = useState({
		uuid: null,
		stock_uuid: null,
		production_quantity: null,
		section: null,
		wastage: null,
		remarks: '',
	});

	const handelProduction = (idx) => {
		const val = data[idx];

		setUpdateSliderProd((prev) => ({
			...prev,
			...val,
		}));

		window['AssemblyProdModal'].showModal();
	};

	// transaction
	const [updateSliderTrx, setUpdateSliderTrx] = useState({
		uuid: null,
		stock_uuid: null,
		from_section: null,
		to_section: null,
		trx_quantity: null,
		remarks: '',
	});

	const handelTransaction = (idx) => {
		const val = data[idx];

		setUpdateSliderTrx((prev) => ({
			...prev,
			...val,
		}));

		window['AssemblyTrxModal'].showModal();
	};

	// Update
	const [updateStock, setUpdateStock] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateStock((prev) => ({
			...prev,
			uuid: data[idx].uuid,
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
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	<button>go</button>;
	return (
		<>
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
					{...{
						updateStock,
						setUpdateStock,
					}}
				/>
			</Suspense>
			<Suspense>
				<Production
					modalId='AssemblyProdModal'
					{...{
						updateSliderProd,
						setUpdateSliderProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='AssemblyTrxModal'
					{...{
						updateSliderTrx,
						setUpdateSliderTrx,
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
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</>
	);
}
