import { lazy, useMemo, useState } from 'react';
import { useVislonTMP } from '@/state/Vislon';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, LinkWithCopy, StatusButton, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const { data, isLoading } = useVislonTMP();
	const info = new PageInfo(
		'Teeth Molding Production',
		'sfg/by/teeth_molding_prod/by/vislon',
		'vislon__teeth_molding_production'
	);

	const haveAccess = useAccess('vislon__teeth_molding_production');

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
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'tape',
				header: 'Tape',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'slider',
			// 	header: 'Slider',
			// 	enableColumnFilter: false,
			// 	width: 'w-32',
			// 	cell: (info) => info.getValue(),
			// },
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
				enableColumnFilter: false,
				width: 'w-32',
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
				accessorKey: 'color_ref',
				header: 'Color Ref',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				accessorKey: 'tape_stock',
				header: 'Tape (KG)',
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
					const { tape_stock } = info.row.original;
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
							disabled={tape_stock <= 0 ? true : false}
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
				accessorKey: 'action_add_transaction',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_transaction'),
				width: 'w-8',
				cell: (info) => {
					const { teeth_molding_prod } = info.row.original;
					return (
						<Transfer
							onClick={() => handelTransaction(info.row.index)}
							disabled={teeth_molding_prod <= 0 ? true : false}
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
		],
		[data]
	);

	const [updateTeethMoldingProd, setUpdateTeethMoldingProd] = useState({
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		vislon_teeth_molding: null,
		wastage: null,
		remarks: '',
	});

	const handelProduction = (idx) => {
		const val = data[idx];

		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			...val,
		}));

		window['TeethMoldingProdModal'].showModal();
	};

	const [updateTeethMoldingTRX, setUpdateTeethMoldingTRX] = useState({
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_from: null,
		trx_to: null,
		remarks: '',
	});

	const handelTransaction = (idx) => {
		const val = data[idx];

		setUpdateTeethMoldingTRX((prev) => ({
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
						updateTeethMoldingProd,
						setUpdateTeethMoldingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='TeethMoldingTrxModal'
					{...{
						updateTeethMoldingTRX,
						setUpdateTeethMoldingTRX,
					}}
				/>
			</Suspense>
		</div>
	);
}
