import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { useCommonTapeSFG } from '@/state/Common';

import { Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const TrxToCoil = lazy(() => import('./TrxToCoil'));
const TrxToDying = lazy(() => import('./TrxToDying'));
const Production = lazy(() => import('./Production'));
const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url } = useCommonTapeSFG();
	const info = new PageInfo('Common/Tape/SFG', url, 'common__tape_sfg');
	const haveAccess = useAccess(info.getTab());

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'zipper_number',
				header: 'Zipper Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'To Coil',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_coil'),
				width: 'w-24',
				cell: (info) =>
					info.row.original.type.toLowerCase() === 'nylon' && (
						<Transfer
							onClick={() => handleTrxToCoil(info.row.index)}
						/>
					),
			},
			{
				accessorKey: 'action',
				header: 'To Dying',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_dyeing'),
				width: 'w-24',
				cell: (info) =>
					info.row.original.type.toLowerCase() !== 'nylon' && (
						<Transfer
							onClick={() => handleTrxToDying(info.row.index)}
						/>
					),
			},
		],
		[data]
	);

	// Fetching data from server

	// Update
	const [updateTapeProd, setUpdateTapeProd] = useState({
		uuid: null,
		name: null,
		type: null,
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
			item_name: selectedProd.type,
			tape_or_coil_stock_id: selectedProd?.uuid,
			type_of_zipper:
				selectedProd.type + ' ' + selectedProd.zipper_number,
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
				selectedProd.type + ' ' + selectedProd.zipper_number,
			quantity: selectedProd.quantity,
		}));
		window['trx_to_coil_modal'].showModal();
	};
	const handleTrxToDying = (idx) => {
		const selectedProd = data[idx];
		setUpdateTapeProd((prev) => ({
			...prev,
			...selectedProd,
			item_name: selectedProd.type,
			tape_or_coil_stock_id: selectedProd.uuid,
			type_of_zipper:
				selectedProd.type + ' ' + selectedProd.zipper_number,
		}));
		window['trx_to_dying_modal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('click_production')}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<Production
					modalId={'TapeProdModal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<TrxToCoil
					modalId={'trx_to_coil_modal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<TrxToDying
					modalId={'trx_to_dying_modal'}
					{...{
						updateTapeProd,
						setUpdateTapeProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
