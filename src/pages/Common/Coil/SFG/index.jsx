import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useCommonCoilSFG } from '@/state/Common';

import { DateTime, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrxToDying = lazy(() => import('./TrxToDyeing'));
const Production = lazy(() => import('./Production'));

export default function Index() {
	const { data, isLoading, url } = useCommonCoilSFG();
	const info = new PageInfo('Common/Coil/SFG', url, 'common__coil_sfg');
	const haveAccess = useAccess(info.getTab());
	const navigate = useNavigate();
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
				cell: (info) => {
					return Number(info.getValue()) === 1
						? ' Reverse'
						: 'Forward';
				},
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
				header: (
					<span>
						Stock
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'actions1',
				header: 'Production Action',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-24',
				cell: (info) => (
					<Transfer
						onClick={() => handelProduction(info.row.index)}
					/>
				),
			},
			{
				accessorKey: 'quantity_in_coil',

				header: (
					<span>
						Production
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},

			{
				accessorKey: 'action',
				header: 'To Dying',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_dyeing'),
				width: 'w-24',
				cell: (info) => (
					<Transfer
						onClick={() => handleTrxToDying(info.row.index)}
					/>
				),
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
		],
		[data]
	);

	// Fetching data from server

	// Update
	const [updateCoilProd, setUpdateCoilProd] = useState({
		uuid: null,
		name: null,
		quantity: null,
		item_name: null,
		zipper_number: null,
	});

	const handelProduction = (idx) => {
		const selectedProd = data[idx];
		setUpdateCoilProd((prev) => ({
			...prev,
			...selectedProd,
			item_name: selectedProd.item_name,
			tape_or_coil_stock_id: selectedProd?.uuid,
			type_of_zipper:
				selectedProd.item_name + ' ' + selectedProd.zipper_number_name,
			quantity: selectedProd.trx_quantity_in_coil,
		}));
		window['CoilProdModal'].showModal();
	};

	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const handleTrxToDying = (idx) => {
		// const selectedProd = data[idx];
		// setUpdateCoilProd((prev) => ({
		// 	...prev,
		// 	...selectedProd,
		// 	item_name: selectedProd.type,
		// 	tape_or_coil_stock_id: selectedProd.uuid,
		// 	type_of_zipper:
		// 		selectedProd.type + ' ' + selectedProd.zipper_number,
		// }));
		// window['trx_to_dying_modal'].showModal();
		navigate(`/common/coil/sfg/entry-to-dyeing/${data[idx].uuid}`);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				//accessor={haveAccess.includes('click_production')}
				data={data}
				columns={columns}
			/>
			<Suspense>
				<Production
					modalId={'CoilProdModal'}
					{...{
						updateCoilProd,
						setUpdateCoilProd,
					}}
				/>
			</Suspense>

			<Suspense>
				<TrxToDying
					modalId={'trx_to_dying_modal'}
					{...{
						updateCoilProd,
						setUpdateCoilProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
