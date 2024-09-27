import { lazy, useEffect, useMemo, useState } from 'react';
import { useDyeingCone } from '@/state/Thread';
import { useAccess, useFetch } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const { data, url, isLoading } = useDyeingCone();
	const info = new PageInfo('Coning', url, 'thread__coning_details');
	const { value: machine } = useFetch('/other/machine/value/label');
	const haveAccess = useAccess('thread__coning_details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_number',
				header: 'Order No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				header: 'Batch QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
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
				header: 'Production QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'coning_production_quantity_in_kg',
				header: 'Production QTY In Kg',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'action_add_transaction',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_transaction'),
				width: 'w-8',
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelTransaction(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'transfer_quantity',
				header: 'Warehouse',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},

			////

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
		</div>
	);
}
