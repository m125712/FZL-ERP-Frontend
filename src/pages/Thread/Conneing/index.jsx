import { lazy, useEffect, useMemo, useState } from 'react';
import { useDyeingCone } from '@/state/Thread';
import { BookOpen } from 'lucide-react';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { BatchType, CustomLink, DateTime, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));
const PolyTransfer = lazy(() => import('./PolyTransfer'));

export default function Index() {
	const { data, url, isLoading } = useDyeingCone();
	const info = new PageInfo('Coning', url, 'thread__coning_details');
	const haveAccess = useAccess('thread__coning_details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch ID',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/dyeing-and-iron/thread-batch/${info.row.original.batch_uuid}`}
					/>
				),
			},

			{
				accessorKey: 'order_number',
				header: 'ID',
				width: 'w-36',
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/thread/order-info/${info.row.original.order_info_uuid}`}
					/>
				),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-36',
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
				width: 'w-36',
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
						Batch <br />
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
						Balance <br />
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
		],
		[data]
	);

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

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

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
