import { TransferIn } from '@/assets/icons';
import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const TrxToDyeing = lazy(() => import('./TrxToDyeing'));
const Production = lazy(() => import('./Production'));

export default function Index() {
	const { data, isLoading, url } = useCommonTapeSFG();
	const info = new PageInfo('Common/Coil/SFG', url, 'common__coil_sfg');
	const haveAccess = useAccess(info.getTab());

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// type	zipper_number	quantity	trx_quantity_in_coil	quantity_in_coil

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
				accessorKey: 'trx_quantity_in_coil',
				header: 'Stock (KG)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handelAdd(info.row.index)} />
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
				header: 'To Dyeing',
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
		],
		[coilProd]
	);

	// Update
	const [updateCoilProd, setUpdateCoilProd] = useState({
		id: null,
		type: null,
		zipper_number: null,
		trx_quantity_in_coil: null,
		quantity_in_coil: null,
	});

	const handleTrxToDying = (idx) => {
		const selectedProd = coilProd[idx];
		setUpdateCoilProd((prev) => ({
			...prev,
			...selectedProd,
			tape_or_coil_stock_id: coilProd[idx].id,
			type_of_zipper:
				coilProd[idx].type + ' ' + coilProd[idx].zipper_number,
		}));
		window['add_or_update_coil_stock_modal'].showModal();
	};

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setCoilProd, setLoading, setError);
	}, []);

	const handelAdd = (idx) => {
		const selectedProd = coilProd[idx];
		setUpdateCoilProd((prev) => ({
			...prev,
			...selectedProd,
			tape_or_coil_stock_id: coilProd[idx].id,
			type_of_zipper:
				coilProd[idx].type + ' ' + coilProd[idx].zipper_number,
		}));
		window['CoilProdModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			
			<ReactTable
				title={info.getTitle()}
				
				data={coilProd}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<Production
					modalId={'CoilProdModal'}
					{...{
						setCoilProd,
						updateCoilProd,
						setUpdateCoilProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<TrxToDyeing
					modalId='add_or_update_coil_stock_modal'
					{...{
						setCoilProd,
						updateCoilProd,
						setUpdateCoilProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
