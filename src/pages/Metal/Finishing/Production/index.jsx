import { lazy, useMemo, useState } from 'react';
import { useMetalFProduction } from '@/state/Metal';
import { BookOpen } from 'lucide-react';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { LinkWithCopy, StatusButton, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));
const PolyTransfer = lazy(() => import('./PolyTransfer'));
export default function Index() {
	const { data, url, isLoading } = useMetalFProduction();
	const info = new PageInfo(
		'Finishing Production',
		url,
		'metal__finishing_production'
	);
	const haveAccess = useAccess('metal__finishing_production');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => {
					const { finishing_batch_uuid } = info.row.original;

					return (
						<LinkWithCopy
							title={info.getValue()}
							id={finishing_batch_uuid}
							uri={`/dyeing-and-iron/finishing-batch`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
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
				enableColumnFilter: true,
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
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_waterproof',
				header: 'Waterproof',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-32',
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
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'batch_quantity',
				header: (
					<span>
						Batch QTY
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'finishing_stock',
				header: 'Finishing Stock',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_finishing_stock',
				header: (
					<span>
						Slider Finishing Stock
						<br />
						(PCS)
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
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions_add_production',
				header: 'Add Production',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				cell: (info) => {
					const {
						balance_quantity,
						finishing_stock,
						slider_finishing_stock,
						order_type,
					} = info.row.original;

					const access =
						order_type === 'tape'
							? Math.min(
									Number(balance_quantity),
									Number(finishing_stock)
								) <= 0
							: Math.min(
									Number(balance_quantity),
									Number(finishing_stock),
									Number(slider_finishing_stock)
								) <= 0;
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
							disabled={access}
						/>
					);
				},
			},
			{
				accessorKey: 'finishing_prod',
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
				header: (
					<span>
						Warehouse
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: 'Sticker',
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-8',
				cell: (info) => {
					return (
						<button
							type='button'
							className='btn btn-accent btn-sm font-semibold text-white shadow-md'
							onClick={() => handleUpdateSticker(info.row.index)}>
							<BookOpen />
						</button>
					);
				},
			},
		],
		[data]
	);
	const [update, setUpdate] = useState({
		uuid: null,
		quantity: null,
	});
	const handleUpdateSticker = (idx) => {
		const val = data[idx];

		setUpdate((prev) => ({
			...prev,
			...val,
		}));

		window['polyModal'].showModal();
	};
	const [updateFinishingProd, setUpdateFinishingProd] = useState({
		sfg_uuid: null,
		order_number: null,
		item_description: null,
		style_color_size: null,
		order_quantity: null,
		balance_quantity: null,
		teeth_coloring_prod: null,
		teeth_coloring_stock: null,
		total_trx_quantity: null,
		metal_teeth_coloring: null,
	});
	const handelProduction = (idx) => {
		const val = data[idx];
		setUpdateFinishingProd((prev) => ({
			...prev,
			...val,
		}));

		window['FinishingProdModal'].showModal();
	};

	const [updateFinishingTRX, setUpdateFinishingTRX] = useState({
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity_in: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	});
	const handelTransaction = (idx) => {
		const val = data[idx];
		setUpdateFinishingTRX((prev) => ({
			...prev,
			...val,
		}));

		window['FinishingTrxModal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<Production
					modalId='FinishingProdModal'
					{...{
						updateFinishingProd,
						setUpdateFinishingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='FinishingTrxModal'
					{...{
						updateFinishingTRX,
						setUpdateFinishingTRX,
					}}
				/>
			</Suspense>
			<Suspense>
				<PolyTransfer
					modalId={'polyModal'}
					{...{
						update,
						setUpdate,
					}}
				/>
			</Suspense>
		</div>
	);
}
