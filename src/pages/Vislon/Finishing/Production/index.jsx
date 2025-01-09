import { lazy, useMemo, useState } from 'react';
import { useVislonFinishingProd } from '@/state/Vislon';
import { BookOpen } from 'lucide-react';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, LinkWithCopy, StatusButton, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));
const PolyTransfer = lazy(() => import('./PolyTransfer'));
export default function Index() {
	const { data, isLoading } = useVislonFinishingProd();
	const info = new PageInfo(
		'Finishing Production',
		'/vislon/finishing/production',
		'vislon__finishing_production'
	);
	const haveAccess = useAccess('vislon__finishing_production');

	// * columns
	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/planning/finishing-batch/${info.row.original.finishing_batch_uuid}`}
						showCopyButton={false}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						showCopyButton={false}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						showCopyButton={false}
						openInNewTab={true}
					/>
				),
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
				header: <span>Batch QTY</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'finishing_stock',
				header: 'Tape (KG)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_finishing_stock',
				header: <span>Slider (PCS)</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: <span>Balance (PCS)</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_add_production',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-8',
				cell: (info) => {
					const {
						balance_quantity,
						slider_finishing_stock,
						order_type,
					} = info.row.original;

					const access =
						order_type === 'tape'
							? Number(balance_quantity) <= 0
							: Math.min(
									Number(balance_quantity),
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
			// 	accessorKey: 'action_add_transaction',
			// 	header: '',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !haveAccess.includes('click_transaction'),
			// 	width: 'w-8',
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
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		wastage: null,
		remarks: '',
	});

	const handelProduction = (idx) => {
		const val = data[idx];

		setUpdateFinishingProd((prev) => ({
			...prev,
			...val,
		}));

		window['TeethMoldingProdModal'].showModal();
	};

	const [updateFinishingTRX, setUpdateFinishingTRX] = useState({
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity: null,
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

		window['TeethMoldingTrxModal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<Production
					modalId='TeethMoldingProdModal'
					{...{
						updateFinishingProd,
						setUpdateFinishingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='TeethMoldingTrxModal'
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
