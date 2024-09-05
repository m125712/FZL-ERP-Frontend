import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useFetchFunc } from '@/hooks';

import { LinkWithCopy, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const info = new PageInfo(
		'Die Casting SFG Stock',
		'sfg/by/die_casting_prod',
		'slider__die_casting_sfg'
	);
	const [dieCastingProd, setDieCastingProd] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const haveAccess = useAccess('slider__die_casting_sfg');

	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setDieCastingProd,
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
				accessorKey: 'action',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.include('update'),
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
				accessorKey: 'die_casting_prod',
				header: 'Production',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Trx To Slider Assembly',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.include('update'),
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
				header: 'Transaction',
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
		[dieCastingProd]
	);

	const [updateDieCastingProd, setUpdateDieCastingProd] = useState({
		id: null,
		die_casting_stock: null,
		die_casting_prod: null,
		order_entry_id: null,
		total_trx_quantity: null,
		quantity: null,
		order_number: null,
		item_description: '',
		order_description: '',
	});

	const handelProduction = (idx) => {
		setUpdateDieCastingProd((prev) => ({
			...prev,
			id: dieCastingProd[idx].id,
			name: dieCastingProd[idx].item_description,
			die_casting_stock: dieCastingProd[idx].die_casting_stock,
			die_casting_prod: dieCastingProd[idx].die_casting_prod,
			order_entry_id: dieCastingProd[idx].order_entry_id,
			total_trx_quantity: dieCastingProd[idx].total_trx_quantity,
			quantity: dieCastingProd[idx].quantity,
			order_number: dieCastingProd[idx].order_number,
			item_description: dieCastingProd[idx].item_description,
			order_description: dieCastingProd[idx].order_description,
		}));
		window['DieCastingProdModal'].showModal();
	};

	const handelTransaction = (idx) => {
		setUpdateDieCastingProd((prev) => ({
			...prev,
			id: dieCastingProd[idx].id,
			name: dieCastingProd[idx].item_description,
			die_casting_stock: dieCastingProd[idx].die_casting_stock,
			die_casting_prod: dieCastingProd[idx].die_casting_prod,
			order_entry_id: dieCastingProd[idx].order_entry_id,
			total_trx_quantity: dieCastingProd[idx].total_trx_quantity,
			quantity: dieCastingProd[idx].quantity,
			order_number: dieCastingProd[idx].order_number,
			item_description: dieCastingProd[idx].item_description,
			order_description: dieCastingProd[idx].order_description,
		}));
		window['DieCastingTrxModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={dieCastingProd}
				columns={columns}
			/>
			<Suspense>
				<Production
					modalId='DieCastingProdModal'
					{...{
						setDieCastingProd,
						updateDieCastingProd,
						setUpdateDieCastingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='DieCastingTrxModal'
					{...{
						setDieCastingProd,
						updateDieCastingProd,
						setUpdateDieCastingProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
