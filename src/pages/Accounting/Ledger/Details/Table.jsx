import { useMemo } from 'react';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime } from '@/ui';

export default function Index({ associated_ledgers }) {
	const totals = useMemo(() => {
		const totalDr = (associated_ledgers || []).reduce((sum, row) => {
			return row.type === 'dr' ? sum + Number(row.amount || 0) : sum;
		}, 0);

		const totalCr = (associated_ledgers || []).reduce((sum, row) => {
			return row.type === 'cr' ? sum + Number(row.amount || 0) : sum;
		}, 0);

		return { totalDr, totalCr };
	}, [associated_ledgers]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'voucher_id',
				header: 'Voucher',
				enableColumnFilter: false,
				cell: (info) => {
					const { voucher_uuid } = info.row.original;
					const url = `/accounting/voucher/${voucher_uuid}/details/`;
					return (
						<div className='flex flex-col gap-1'>
							<CustomLink
								label={info.getValue()}
								url={url}
								openInNewTab={true}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'category',
				header: 'Category',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'date',
				header: 'Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},

			{
				accessorFn: (row) =>
					row.ledger_details
						.map((ledger) => ledger.ledger_name)
						.join(', '),
				id: 'ledger_details',
				header: 'Associated',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => {
					const ledgerDetails = info.row.original.ledger_details;
					if (
						!Array.isArray(ledgerDetails) ||
						ledgerDetails.length === 0
					) {
						return '';
					}
					return (
						<div className='flex flex-col gap-1'>
							{ledgerDetails.map((ledger) => {
								const url = `/accounting/ledger/${ledger.ledger_uuid}/details`;
								return (
									<span key={ledger.ledger_uuid}>
										<CustomLink
											label={ledger.ledger_name}
											url={url}
											openInNewTab={true}
										/>
									</span>
								);
							})}
						</div>
					);
				},
			},
			{
				accessorFn: (row) =>
					row.type === 'dr' ? row.amount.toLocaleString() : '',
				id: 'dr_amount',
				header: 'Dr',
				enableColumnFilter: false,
				cell: (info) =>
					info.row.original.type === 'dr'
						? info.row.original.amount.toLocaleString()
						: '',
			},
			{
				accessorFn: (row) =>
					row.type === 'cr' ? row.amount.toLocaleString() : '',
				id: 'cr_amount',
				header: 'Cr',
				enableColumnFilter: false,
				cell: (info) =>
					info.row.original.type === 'cr'
						? info.row.original.amount.toLocaleString()
						: '',
			},
			{
				accessorKey: 'currency_symbol',
				enableColumnFilter: false,
				header: 'Currency',
				cell: (info) => info.getValue(),
			},
		],
		[associated_ledgers]
	);

	return (
		<ReactTable
			title='Associated Ledgers'
			data={associated_ledgers}
			columns={columns}
			showTitleOnly={false}
		>
			<tr className='bg-slate-200 font-semibold'>
				<td
					colSpan={4}
					className='px-4 py-2 text-right text-sm font-semibold'
				>
					Total:
				</td>
				<td className='px-3 py-2 text-sm font-semibold'>
					{totals.totalDr.toLocaleString()}
				</td>
				<td className='px-3 py-2 text-sm font-semibold'>
					{totals.totalCr.toLocaleString()}
				</td>
				<td className='px-3 py-2 text-sm'></td>
			</tr>
		</ReactTable>
	);
}
