import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { LinkWithCopy, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const info = new PageInfo(
		'Teeth Coloring SFG Stock',
		'sfg/by/teeth_coloring_prod/by/metal',
		'metal__teeth_coloring_sfg'
	);
	const [teethColoringProd, setTeethColoringProd] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('metal__teeth_coloring_sfg');

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(
			info.getFetchUrl(),
			setTeethColoringProd,
			setLoading,
			setError
		);
	}, []);

	// o/n	style	color	size	pcs	  production	production_modal_button	trx	trx_modal_button

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_description',
				header: 'Style / Color / Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'teeth_coloring_stock',
				header: (
					<span>
						Stock
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: '',
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
				accessorKey: 'teeth_coloring_prod',
				header: (
					<span>
						Production
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_finishing'),
				width: 'w-24',
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelTransaction(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'total_trx_quantity',
				header: (
					<span>
						Total Transaction
						<br />
						(PCS)
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
		],
		[teethColoringProd]
	);

	const [updateTeethColoringProd, setUpdateTeethColoringProd] = useState({
		id: null,
		teeth_coloring_stock: null,
		teeth_coloring_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		order_number: '',
		order_description: '',
	});

	const handelProduction = (idx) => {
		setUpdateTeethColoringProd((prev) => ({
			...prev,
			id: teethColoringProd[idx].id,
			name: teethColoringProd[idx].item_description,
			teeth_coloring_stock: teethColoringProd[idx].teeth_coloring_stock,
			teeth_coloring_prod: teethColoringProd[idx].teeth_coloring_prod,
			order_entry_id: teethColoringProd[idx].order_entry_id,
			item_description: teethColoringProd[idx].item_description,
			total_trx_quantity: teethColoringProd[idx].total_trx_quantity,
			order_number: teethColoringProd[idx].order_number,
			order_description: teethColoringProd[idx].order_description,
		}));
		window['TeethColoringProdModal'].showModal();
	};

	const handelTransaction = (idx) => {
		setUpdateTeethColoringProd((prev) => ({
			...prev,
			id: teethColoringProd[idx].id,
			name: teethColoringProd[idx].item_description,
			teeth_coloring_stock: teethColoringProd[idx].teeth_coloring_stock,
			teeth_coloring_prod: teethColoringProd[idx].teeth_coloring_prod,
			order_entry_id: teethColoringProd[idx].order_entry_id,
			item_description: teethColoringProd[idx].item_description,
			total_trx_quantity: teethColoringProd[idx].total_trx_quantity,
			order_number: teethColoringProd[idx].order_number,
			order_description: teethColoringProd[idx].order_description,
		}));
		window['TeethColoringTrxModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={teethColoringProd}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<Production
					modalId='TeethColoringProdModal'
					{...{
						setTeethColoringProd,
						updateTeethColoringProd,
						setUpdateTeethColoringProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='TeethColoringTrxModal'
					{...{
						setTeethColoringProd,
						updateTeethColoringProd,
						setUpdateTeethColoringProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
