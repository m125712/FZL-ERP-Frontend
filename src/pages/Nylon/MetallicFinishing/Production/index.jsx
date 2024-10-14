import { lazy, useMemo, useState } from 'react';
import { useNylonMFProduction } from '@/state/Nylon';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { LinkWithCopy, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const { data, url, isLoading } = useNylonMFProduction();
	const info = new PageInfo(
		'Metallic Finishing Production',
		url,
		'nylon__metallic_finishing_production'
	);
	const haveAccess = useAccess('nylon__metallic_finishing_production');

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
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'size',
				header: 'size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'order_quantity',
				header: (
					<span>
						Ordered QTY
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'tape_transferred',
				header: 'Tape Stock (KG)',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},

			{
				accessorKey: 'slider_finishing_stock',
				header: 'Slider Stock (PCS)',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'balance_quantity',
				header: (
					<span>
						Balance
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'actions_add_production',
				header: 'Add Production',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				cell: (info) => (
					<Transfer
						onClick={() => handelProduction(info.row.index)}
					/>
				),
			},
			{
				accessorKey: 'finishing_prod',
				header: 'Production',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			// {
			// 	accessorKey: 'actions_add_transaction',
			// 	header: 'Trx Transaction',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !haveAccess.includes('click_transaction'),
			// 	cell: (info) => (
			// 		<Transfer
			// 			onClick={() => handelTransaction(info.row.index)}
			// 		/>
			// 	),
			// },
			{
				accessorKey: 'warehouse',
				header: 'Warehouse',
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
		[data]
	);

	const [updateMFProd, setUpdateMFProd] = useState({
		sfg_uuid: null,
		section: null,
		coloring_prod: null,
		balance_quantity: null,
		nylon_metallic_finishing: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		wastage: null,
		remarks: null,
	});
	const handelProduction = (idx) => {
		const val = data[idx];
		setUpdateMFProd((prev) => ({
			...prev,
			...val,
		}));

		window['MFProdModal'].showModal();
	};

	const [updateMFTRX, setUpdateMFTRX] = useState({
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity_in: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
		finishing_prod: null,
	});
	const handelTransaction = (idx) => {
		const val = data[idx];
		setUpdateMFTRX((prev) => ({
			...prev,
			...val,
		}));

		window['MFTrxModal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<Production
					modalId='MFProdModal'
					{...{
						updateMFProd,
						setUpdateMFProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='MFTrxModal'
					{...{
						updateMFTRX,
						setUpdateMFTRX,
					}}
				/>
			</Suspense>
		</div>
	);
}
