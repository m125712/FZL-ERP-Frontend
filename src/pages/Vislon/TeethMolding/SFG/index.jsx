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
		'Teeth Molding SFG Stock',
		'sfg/by/teeth_molding_prod/by/vislon',
		'vislon__teeth_molding_sfg'
	);

	const [teethMoldingProd, setTeethMoldingProd] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('vislon__teeth_molding_sfg');

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(
			info.getFetchUrl(),
			setTeethMoldingProd,
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
				accessorKey: 'quantity',
				header: (
					<span>
						Ordered
						<br />
						QTY (PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_molding_stock',
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
				accessorKey: 'action',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-24',
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'teeth_molding_prod',
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
		[teethMoldingProd]
	);

	const [updateTeethMoldingProd, setUpdateTeethMoldingProd] = useState({
		id: null,
		teeth_molding_stock: null,
		teeth_molding_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		order_number: '',
		order_description: '',
		quantity: null,
	});

	const handelProduction = (idx) => {
		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			id: teethMoldingProd[idx].id,
			name: teethMoldingProd[idx].item_description,
			teeth_molding_stock: teethMoldingProd[idx].teeth_molding_stock,
			teeth_molding_prod: teethMoldingProd[idx].teeth_molding_prod,
			order_entry_id: teethMoldingProd[idx].order_entry_id,
			item_description: teethMoldingProd[idx].item_description,
			total_trx_quantity: teethMoldingProd[idx].total_trx_quantity,
			order_number: teethMoldingProd[idx].order_number,
			order_description: teethMoldingProd[idx].order_description,
			quantity: teethMoldingProd[idx].quantity,
		}));
		window['TeethMoldingProdModal'].showModal();
	};

	const handelTransaction = (idx) => {
		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			id: teethMoldingProd[idx].id,
			name: teethMoldingProd[idx].item_description,
			teeth_molding_stock: teethMoldingProd[idx].teeth_molding_stock,
			teeth_molding_prod: teethMoldingProd[idx].teeth_molding_prod,
			order_entry_id: teethMoldingProd[idx].order_entry_id,
			item_description: teethMoldingProd[idx].item_description,
			total_trx_quantity: teethMoldingProd[idx].total_trx_quantity,
			order_number: teethMoldingProd[idx].order_number,
			order_description: teethMoldingProd[idx].order_description,
			quantity: teethMoldingProd[idx].quantity,
		}));
		window['TeethMoldingTrxModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={teethMoldingProd}
				columns={columns}
			/>
			<Suspense>
				<Production
					modalId='TeethMoldingProdModal'
					{...{
						setTeethMoldingProd,
						updateTeethMoldingProd,
						setUpdateTeethMoldingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='TeethMoldingTrxModal'
					{...{
						setTeethMoldingProd,
						updateTeethMoldingProd,
						setUpdateTeethMoldingProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
