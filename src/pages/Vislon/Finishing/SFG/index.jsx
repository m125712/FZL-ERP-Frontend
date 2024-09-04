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
		'Finishing SFG Stock',
		'sfg/by/finishing_prod/by/vislon',
		'vislon__finishing_sfg'
	);
	const [finishingProd, setFinishingProd] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('vislon__finishing_sfg');

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(
			info.getFetchUrl(),
			setFinishingProd,
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
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'coloring_prod',
				header: (
					<span>
						Slider
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'finishing_stock',
				header: (
					<span>
						Finished Tape
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
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
				accessorKey: 'finishing_prod',
				header: (
					<span>
						Zipper
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'actions',
				header: (
					<span>
						Trx to
						<br />
						Warehouse
					</span>
				),
				enableColumnFilter: false,
				enableSorting: false,
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
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[finishingProd]
	);

	const [updateFinishingProd, setUpdateFinishingProd] = useState({
		id: null,
		finishing_stock: null,
		finishing_prod: null,
		coloring_prod: null,
		order_entry_id: null,
		item_description: null,
		total_trx_quantity: null,
		end_type_name: '',
		order_number: '',
		order_description: '',
	});

	const handelProduction = (idx) => {
		const selectedProd = finishingProd[idx];
		setUpdateFinishingProd((prev) => ({
			...prev,
			...selectedProd,
		}));
		window['FinishingProdModal'].showModal();
	};

	const handelTransaction = (idx) => {
		const selectedProd = finishingProd[idx];
		setUpdateFinishingProd((prev) => ({
			...prev,
			...selectedProd,
		}));
		window['FinishingTrxModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				// handelAdd={handelAdd}
				accessor={haveAccess.includes('click_production')}
				data={finishingProd}
				columns={columns}
			/>
			<Suspense>
				<Production
					modalId='FinishingProdModal'
					{...{
						setFinishingProd,
						updateFinishingProd,
						setUpdateFinishingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='FinishingTrxModal'
					{...{
						setFinishingProd,
						updateFinishingProd,
						setUpdateFinishingProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
