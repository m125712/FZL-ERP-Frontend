import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { useCommonTapeSFG } from '@/state/Common';

import { DateTime, EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrxToCoil = lazy(() => import('./TrxToCoil'));
const TrxToDying = lazy(() => import('./TrxToDying'));
const Production = lazy(() => import('./Production'));
const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useCommonTapeSFG();
	const info = new PageInfo('Common/Tape/SFG', url, 'common__tape_sfg');
	const haveAccess = useAccess(info.getTab());
	const navigate = useNavigate();
	console.log(data);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

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
				width: 'w-30',

				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_import',
				header: 'Is Imported',
				enableColumnFilter: false,
				cell: (info) => {
					return Number(info.getValue()) === 1 ? ' Import' : 'Local';
				},
			},
			{
				accessorKey: 'is_reverse',
				header: 'Is Reverse',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'top',
				header: 'Top',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bottom',
				header: 'Bottom',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'raw_per_kg_meter',
				header: 'Raw Tape (Meter/Kg)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'dyed_per_kg_meter',
				header: 'Dyed Tape (Meter/Kg)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'trx_quantity_in_coil',
				header: 'Trx Quantity In Coil',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity_in_coil',
				header: 'Quantity In Coil',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions1',
				header: 'Production Action',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-34',
				cell: (info) => (
					<Transfer
						onClick={() => handelProduction(info.row.index)}
					/>
				),
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
				accessorKey: 'coil_action',
				header: 'To Coil',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_coil'),
				width: 'w-24',
				cell: (info) => {
					const itemName =
						info.row.original?.item_name?.toLowerCase();

					if (
						itemName == 'nylon plastic' ||
						itemName == 'nylon metallic'
					) {
						return (
							<Transfer
								onClick={() => handleTrxToCoil(info.row.index)}
							/>
						);
					}
				},
			},
			{
				accessorKey: 'action',
				header: 'To Dying',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_dyeing'),
				width: 'w-24',
				cell: (info) => {
					const itemName =
						info.row.original?.item_name?.toLowerCase();

					if (
						itemName !== 'nylon plastic' &&
						itemName !== 'nylon metallic'
					) {
						return (
							<Transfer
								onClick={() => handleTrxToDying(info.row.index)}
							/>
						);
					}
				},
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
		[data]
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
			itemName:
				data[idx].order_number + ' - ' + data[idx].item_description,
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
		</div>
	);
}
