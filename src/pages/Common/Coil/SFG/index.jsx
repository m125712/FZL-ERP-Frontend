import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { useCommonCoilSFG } from '@/state/Common';

import { Transfer } from '@/ui';
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
				header: (
					<span>
						Stock
						<br />
						(KG)
					</span>
				),
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
		],
		[data]
	);

	// Fetching data from server

	// Update
	const [updateCoilProd, setUpdateCoilProd] = useState({
		uuid: null,
		name: null,
		type: null,
		quantity: null,
		item_name: null,
		zipper_number: null,
	});

	const handelProduction = (idx) => {
		const selectedProd = data[idx];
		setUpdateCoilProd((prev) => ({
			...prev,
			...selectedProd,
			item_name: selectedProd.type,
			tape_or_coil_stock_id: selectedProd?.uuid,
			type_of_zipper:
				selectedProd.type + ' ' + selectedProd.zipper_number,
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
	console.log(data);

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
				extraClass='py-2'
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
