import { lazy, useEffect, useMemo, useState } from 'react';
import { useCommonCoilSFG, useCommonTapeSFG } from '@/state/Common';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, ReactSelect, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const TrxToCoil = lazy(() => import('./TrxToCoil'));
const TrxToDying = lazy(() => import('./TrxToDying'));
const Production = lazy(() => import('./Production'));
const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DyeingAgainstStock = lazy(() => import('./DyeingAgainstStock'));
const TrxToStock = lazy(() => import('./ToStock'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useCommonTapeSFG();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonCoilSFG();
	const info = new PageInfo('Common/Tape/SFG', url, 'common__tape_sfg');
	const haveAccess = useAccess(info.getTab());
	const navigate = useNavigate();
	const [stock, setStock] = useState(null);
	const stockState = [
		{ label: 'Yes', value: true },
		{ label: 'No', value: false },
	];

	// * Set initial stock values
	useEffect(() => {
		if (data) {
			setStock(
				data.map(() => {
					return {
						value: false,
					};
				})
			);
		}
	}, [data]);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-40',
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
				header: (
					<div>
						Zipper
						<br />
						Number
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_import',
				header: 'Imported?',
				enableColumnFilter: false,
				cell: (info) => {
					return Number(info.getValue()) === 1 ? ' Import' : 'Local';
				},
			},
			{
				accessorKey: 'is_reverse',
				header: 'Reverse?',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},

			// {
			// 	accessorKey: 'quantity_in_coil',
			// 	header: 'Quantity In Coil',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'actions1',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-34',
				cell: (info) => {
					if (info.row.original?.material_name === null) {
						return (
							<Transfer
								onClick={() => handelProduction(info.row.index)}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'quantity',
				header: (
					<span>
						Production
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'stock',
				header: 'Stock',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<ReactSelect
						placeholder='Select state'
						options={stockState}
						value={stockState?.filter(
							(item) => item.value == stock[info.row.index]?.value
						)}
						onChange={(e) => {
							console.log(info.row.index);
							// console.log(stock);
							setStock(
								stock.map((item, index) => {
									if (index === info.row.index) {
										return {
											...item,
											value: e.value,
										};
									}
									return item;
								})
							);
							// console.log(stock?.[info.row.index]);
						}}
						// isDisabled={order_info_id !== undefined}
					/>
				),
			},

			{
				accessorKey: 'coil_action',
				header: 'To Coil',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_coil'),
				width: 'w-24',
				cell: (info) => {
					if (
						info.row.original?.item_name?.toLowerCase() == 'nylon'
					) {
						return (
							<Transfer
								onClick={() => handleTrxToCoil(info.row.index)}
								disabled={
									stock[info.row.index]?.value ? true : false
								}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'trx_quantity_in_coil',
				header: <div>Trx Quantity</div>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: 'To Dying',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_dyeing'),
				width: 'w-24',
				cell: (info) => {
					if (
						info.row.original?.item_name?.toLowerCase() != 'nylon'
					) {
						return (
							<Transfer
								onClick={() => handleTrxToDying(info.row.index)}
								disabled={
									stock[info.row.index]?.value ? true : false
								}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'dyeing_against_stock_action',
				header: 'Dyeing Against Stock',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_dyeing_against_stock'),
				width: 'w-30',
				cell: (info) => {
					if (
						info.row.original?.item_name?.toLowerCase() != 'nylon'
					) {
						return (
							<Transfer
								onClick={() =>
									handleDyeingAgainstStock(info.row.index)
								}
								disabled={
									stock[info.row.index]?.value ? false : true
								}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'trx_quantity_in_dying',
				header: (
					<span>
						Trx Quantity in Dyeing
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'to_stock_action',
				header: 'To Stock',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_stock'),
				width: 'w-30',
				cell: (info) => {
					if (
						info.row.original?.item_name?.toLowerCase() != 'nylon'
					) {
						return (
							<Transfer
								onClick={() => handleTrxToStock(info.row.index)}
								disabled={
									stock[info.row.index]?.value ? false : true
								}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'stock_quantity',
				header: (
					<span>
						Stock Quantity
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'to_transfer_action',
				header: 'To Transfer',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_transfer'),
				width: 'w-24',
				cell: (info) => {
					if (
						info.row.original?.item_name?.toLowerCase() != 'nylon'
					) {
						return (
							<Transfer
								onClick={() => handleTransfer(info.row.index)}
								disabled={
									stock[info.row.index]?.value ? false : true
								}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'raw_per_kg_meter',
				header: (
					<span>
						Raw Tape
						<br />
						(Meter/Kg)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'dyed_per_kg_meter',
				header: (
					<span>
						Dyed Tape
						<br />
						(Meter/Kg)
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
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
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
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
						/>
					);
				},
			},
		],
		[data, stock]
	);

	// Update
	const [updateTapeProd, setUpdateTapeProd] = useState({
		uuid: null,
		name: null,
		quantity: null,
		item_name: null,
		zipper_number: null,
		trx_quantity: null,
	});

	const handelProduction = (idx) => {
		const selectedProd = data[idx];
		setUpdateTapeProd((prev) => ({
			...prev,
			...selectedProd,
			uuid: selectedProd?.uuid,
			item_name: selectedProd.item_name,
			tape_or_coil_stock_id: selectedProd?.uuid,
			type_of_zipper:
				selectedProd.item_name + ' ' + selectedProd.zipper_number_name,
		}));
		window['TapeProdModal'].showModal();
	};

	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const handleTrxToCoil = (idx) => {
		const selectedProd = data[idx];
		setUpdateTapeProd((prev) => ({
			...prev,
			...selectedProd,
			item_name: selectedProd.type,
			tape_or_coil_stock_id: selectedProd?.uuid,
			type_of_zipper:
				selectedProd.item_name + ' ' + selectedProd.zipper_number_name,
			quantity: selectedProd.quantity,
		}));
		window['trx_to_coil_modal'].showModal();
	};
	const handleDyeingAgainstStock = (idx) => {
		const selectedProd = data[idx];
		setUpdateTapeProd((prev) => ({
			...prev,
			...selectedProd,
			item_name: selectedProd.type,
			quantity: selectedProd.quantity,
		}));
		window['dyeing_against_stock_modal'].showModal();
	};
	const handleTrxToStock = (idx) => {
		const selectedProd = data[idx];
		setUpdateTapeProd((prev) => ({
			...prev,
			...selectedProd,
			item_name: selectedProd.type,
			quantity: selectedProd.trx_quantity_in_dying,
		}));
		window['trx_to_stock_modal'].showModal();
	};
	const handleTrxToDying = (idx) => {
		// const selectedProd = data[idx];
		// setUpdateTapeProd((prev) => ({
		// 	...prev,
		// 	...selectedProd,
		// 	item_name: selectedProd.type,
		// 	tape_or_coil_stock_id: selectedProd.uuid,
		// 	type_of_zipper:
		// 		selectedProd.type + ' ' + selectedProd.zipper_number,
		// }));
		// window['trx_to_dying_modal'].showModal();

		navigate(`/common/tape/sfg/entry-to-dyeing/${data[idx].uuid}`);
	};
	const handleTransfer = (idx) => {
		navigate(`/common/tape/sfg/entry-to-transfer/${data[idx].uuid}`);
	};

	const handelUpdate = (idx) => {
		const selectedProd = data[idx];
		setUpdateTapeProd((prev) => ({
			...prev,
			...selectedProd,
			uuid: data[idx]?.uuid,
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
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('click_production')}
				data={data}
				columns={columns}
			/>
			{/* //* Modals  */}
			<Suspense>
				<Production
					modalId={'TapeProdModal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>

				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>

				<TrxToCoil
					modalId={'trx_to_coil_modal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>

				<TrxToDying
					modalId={'trx_to_dying_modal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>
				<DyeingAgainstStock
					modalId={'dyeing_against_stock_modal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>
				<TrxToStock
					modalId={'trx_to_stock_modal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
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
