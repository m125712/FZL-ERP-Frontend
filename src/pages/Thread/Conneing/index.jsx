import { lazy, useEffect, useMemo, useState } from 'react';
import { useOtherMachines } from '@/state/Other';
import { useDyeingCone } from '@/state/Thread';
import { BookOpen } from 'lucide-react';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { BatchType, DateTime, LinkOnly, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));
const PolyTransfer = lazy(() => import('./PolyTransfer'));

export default function Index() {
	const { data, url, isLoading } = useDyeingCone();
	const info = new PageInfo('Coning', url, 'thread__coning_details');
	const { data: machine } = useOtherMachines();
	const haveAccess = useAccess('thread__coning_details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch ID',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => (
					<LinkOnly
						title={info.getValue()}
						id={info.row.original.batch_uuid}
						uri='/dyeing-and-iron/thread-batch'
					/>
				),
			},

			{
				accessorKey: 'order_number',
				header: 'ID',
				width: 'w-36',
				cell: (info) => {
					const { order_info_uuid } = info.row.original;
					return (
						<LinkOnly
							uri='/thread/order-info'
							id={order_info_uuid}
							title={info.getValue()}
						/>
					);
				},
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => <BatchType value={info.getValue()} />,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'count_length',
				header: 'Count Length',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_quantity',
				header: (
					<span>
						Batch
						<br />
						QTY
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
						QTY
					</span>
				),
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
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'coning_production_quantity',
				header: (
					<span>
						Production
						<br />
						QTY
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'coning_carton_quantity',
			// 	header: (
			// 		<span>
			// 			Carton
			// 			<br />
			// 			QTY
			// 		</span>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'action_add_transaction',
			// 	header: '',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: true, //!haveAccess.includes('click_transaction'),
			// 	width: 'w-8',
			// 	cell: (info) => {
			// 		return (
			// 			<Transfer
			// 				onClick={() => handelTransaction(info.row.index)}
			// 			/>
			// 		);
			// 	},
			// },
			// {
			// 	accessorKey: 'transfer_quantity',
			// 	header: 'Warehouse',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'transfer_carton_quantity',
			// 	header: (
			// 		<span>
			// 			Warehouse
			// 			<br />
			// 			Carton
			// 		</span>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			////
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
							onClick={() => handleUpdate(info.row.index)}>
							<BookOpen />
						</button>
					);
				},
			},
			// * created_at
			{
				accessorKey: 'created_at',
				header: 'Created at',
				width: 'w-40',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// * updated_at
			{
				accessorKey: 'updated_at',
				header: 'Updated at',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			// * remarks
			{
				accessorKey: 'batch_remarks',
				header: 'Remarks',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * actions
			// {
			// 	accessorKey: 'actions',
			// 	header: 'Actions',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !haveAccess.includes('update'),
			// 	width: 'w-24',
			// 	cell: (info) => (
			// 		<EditDelete
			// 			idx={info.row.index}
			// 			handelUpdate={handelUpdate}
			// 			showEdit={haveAccess.includes('update')}
			// 			showDelete={false}
			// 		/>
			// 	),
			// },
		],
		[data, machine]
	);

	// Update
	// const handelUpdate = (idx) => {
	// 	const { uuid } = data[idx];
	// 	navigate(`/thread/coning/${uuid}/update`);
	// };
	const [update, setUpdate] = useState({
		uuid: null,
		quantity: null,
	});
	const handleUpdate = (idx) => {
		const val = data[idx];

		setUpdate((prev) => ({
			...prev,
			...val,
		}));

		window['polyModal'].showModal();
	};

	const [coningProd, setConingProd] = useState({
		uuid: null,
		batch_entry_uuid: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		wastage: null,
		remarks: null,
	});

	const handelProduction = (idx) => {
		const val = data[idx];

		setConingProd((prev) => ({
			...prev,
			...val,
		}));

		window['ConingProdModal'].showModal();
	};

	const [coningTrx, setConingTrx] = useState({
		uuid: null,
		batch_entry_uuid: null,
		trx_quantity: null,
		remarks: null,
	});

	const handelTransaction = (idx) => {
		const val = data[idx];

		setConingTrx((prev) => ({
			...prev,
			...val,
		}));

		window['ConingTrxModal'].showModal();
	};

	// get tabname
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				// handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				// accessor={haveAccess.includes('create')}
				extraClass='py-2'
			/>
			<Suspense>
				<Production
					modalId='ConingProdModal'
					{...{
						coningProd,
						setConingProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='ConingTrxModal'
					{...{
						coningTrx,
						setConingTrx,
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
