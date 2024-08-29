import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc, useFetch } from '@/hooks';
import { useMetalTMProduction } from '@/state/Metal';

import { LinkWithCopy, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const { data, isLoading } = useMetalTMProduction();
	const info = new PageInfo(
		'Teeth Molding Production',
		'sfg/by/teeth_molding_prod/by/metal',
		'metal__teeth_molding_production'
	);
	const haveAccess = useAccess('metal__teeth_molding_production');

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
				accessorKey: 'style_color_size',
				header: 'Style / Color / Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'order_quantity',
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
				accessorKey: 'balance_quantity',
				header: (
					<span>
						Balance
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: 'Add Production',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelProduction(info.row.original)}
						/>
					);
				},
			},
			{
				accessorKey: 'teeth_molding_prod',
				header: (
					<span>
						Total Production
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Add Transaction',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),

				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelTransaction(info.row.original)}
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
		],
		[data]
	);

	const [updateTeethMoldingProd, setUpdateTeethMoldingProd] = useState({
		uuid: null,
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
			sfg_uuid: idx.sfg_uuid,
		}));

		window['TeethMoldingProdModal'].showModal();
	};

	const [transactionData, setTransactionData] = useState({
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	});
	const handelTransaction = (idx) => {
		setTransactionData((prev) => ({
			...prev,
			sfg_uuid: idx.sfg_uuid,
		}));

		window['TeethMoldingTrxModal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<Production
					modalId='TeethMoldingProdModal'
					{...{
						updateTeethMoldingProd,
						setUpdateTeethMoldingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='TeethMoldingTrxModal'
					{...{
						updateTeethMoldingProd,
						setUpdateTeethMoldingProd,

						transactionData,
						setTransactionData,
					}}
				/>
			</Suspense>
		</div>
	);
}
