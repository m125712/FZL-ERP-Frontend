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
		'Coloring SFG Stock',
		'sfg/by/coloring_prod',
		'slider__coloring_sfg'
	);
	const [coloringProd, setColoringProd] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const haveAccess = useAccess('slider__coloring_sfg');

	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setColoringProd, setLoading, setError);
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
				accessorKey: 'coloring_stock',
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
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'coloring_prod',
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
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: "actions",
			// 	header: "Trx To",
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !haveAccess.includes("click_to_coloring"),
			// 	width: "w-24",
			// 	cell: (info) => {
			// 		return (
			// 			<Transfer
			// 				onClick={() => handelTransaction(info.row.index)}
			// 			/>
			// 		);
			// 	},
			// },
			// {
			// 	accessorKey: "total_trx_quantity",
			// 	header: "Transaction",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
		],
		[coloringProd]
	);

	const [updateColoringProd, setUpdateColoringProd] = useState({
		id: null,
		coloring_stock: null,
		coloring_prod: null,
		order_entry_id: null,
		order_entry_info: null,
		total_trx_quantity: null,
		order_number: null,
		item_description: '',
		order_description: '',
		quantity: null,
	});

	const handelProduction = (idx) => {
		setUpdateColoringProd((prev) => ({
			...prev,
			id: coloringProd[idx].id,
			name: coloringProd[idx].item_description,
			coloring_stock: coloringProd[idx].coloring_stock,
			coloring_prod: coloringProd[idx].coloring_prod,
			order_entry_id: coloringProd[idx].order_entry_id,
			total_trx_quantity: coloringProd[idx].total_trx_quantity,
			order_number: coloringProd[idx].order_number,
			item_description: coloringProd[idx].item_description,
			order_description: coloringProd[idx].order_description,
			quantity: coloringProd[idx].quantity,
		}));
		window['ColoringProdModal'].showModal();
	};

	const handelTransaction = (idx) => {
		setUpdateColoringProd((prev) => ({
			...prev,
			id: coloringProd[idx].id,
			name: coloringProd[idx].item_description,
			coloring_stock: coloringProd[idx].coloring_stock,
			coloring_prod: coloringProd[idx].coloring_prod,
			order_entry_id: coloringProd[idx].order_entry_id,
			total_trx_quantity: coloringProd[idx].total_trx_quantity,
			order_number: coloringProd[idx].order_number,
			item_description: coloringProd[idx].item_description,
			order_description: coloringProd[idx].order_description,
		}));
		window['ColoringTrxModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={coloringProd}
				columns={columns}
			/>
			<Suspense>
				<Production
					modalId='ColoringProdModal'
					{...{
						setColoringProd,
						updateColoringProd,
						setUpdateColoringProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='ColoringTrxModal'
					{...{
						setColoringProd,
						updateColoringProd,
						setUpdateColoringProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
