import { lazy, useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';

import { Suspense } from '@/components/Feedback';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy } from '@/ui';

const PolyTransfer = lazy(() => import('./PolyTransfer'));

export default function Index({ packing_list_entry, data }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_info_uuid',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={order_number}
							id={order_number}
							uri='/order/details'
						/>
					);
				},
			},

			{
				accessorKey: 'item_description',
				header: () =>
					data?.item_for === 'thread' ||
					data?.item_for === 'sample_thread'
						? 'Count'
						: 'Item Description',
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
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header:
					data?.item_for === 'thread' ||
					data?.item_for === 'sample_thread'
						? 'Length'
						: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_inch',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) =>
					data?.item_for === 'thread' ||
					data?.item_for === 'sample_thread' ||
					data?.item_for === 'tape'
						? 'Meter'
						: info.getValue() === 1
							? 'Inch'
							: 'Cm',
			},
			// {
			// 	accessorKey: 'order_quantity',
			// 	header: 'Order Qty',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'balance_quantity',
			// 	header: 'Balance Qty',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: 'finishing_prod',
			// 	header: 'Production Qty',
			// 	enableColumnFilter: false,
			// 	hidden:
			// 		data?.item_for === 'sample_thread' ||
			// 		data?.item_for === 'sample_zipper',
			// 	cell: (info) =>
			// 		data?.item_for === 'thread' || data?.item_for === 'zipper'
			// 			? info.getValue()
			// 			: '-',
			// },
			{
				accessorKey: 'quantity',
				header:
					data?.item_for === 'thread' ||
					data?.item_for === 'sample_thread'
						? 'Qty(cone)'
						: data?.item_for === 'tape'
							? 'Qty(cm)'
							: 'Qty(pcs)',
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
			{
				accessorKey: 'poli_quantity',
				header: 'Poly Qty',
				hidden:
					data?.item_for === 'sample_thread' ||
					data?.item_for === 'thread',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[packing_list_entry]
	);

	// const totalQty = packing_list_entry.reduce(
	// 	(a, b) => a + Number(b.order_quantity),
	// 	0
	// );
	const totalQuantity = packing_list_entry.reduce(
		(a, b) => a + Number(b.quantity),
		0
	);
	const [update, setUpdate] = useState({
		uuid: null,
		quantity: null,
	});
	const handleUpdate = (idx) => {
		const val = packing_list_entry[idx];

		setUpdate((prev) => ({
			...prev,
			...val,
			item_for: data?.item_for,
			challan_number: data.challan_number,
			packing_list_wise_rank: data.packing_list_wise_rank,
			packing_number: data.packing_number,
			buyer_name: data.buyer_name,
			created_at: data.created_at,
			factory_name: data.factory_name,
			party_name: data.party_name,
		}));

		window['polyModal'].showModal();
	};
	return (
		<>
			<ReactTableTitleOnly
				title='Details'
				data={packing_list_entry}
				columns={columns}>
				<tr className='text-sm'>
					<td colSpan='6' className='py-2 text-right'>
						Total QTY
					</td>
					{/* <td className='pl-3 text-left font-semibold'>{totalQty}</td>
					<td className='py-2 text-right'>Total QTY</td> */}
					<td className='pl-3 text-left font-semibold'>
						{Number(totalQuantity).toLocaleString()}
					</td>
				</tr>
			</ReactTableTitleOnly>
			<Suspense>
				<PolyTransfer
					modalId={'polyModal'}
					{...{
						update,
						setUpdate,
					}}
				/>
			</Suspense>
		</>
	);
}
