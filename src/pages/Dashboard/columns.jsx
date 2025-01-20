import { formatDistanceStrict } from 'date-fns';

import { CustomLink, DateTime } from '@/ui';

const getSLicedValue = (value, length = 7) => {
	if (value.length < length) return value;
	return value.slice(0, length) + '...';
};

export const sample_lead_time_columns = [
	{
		accessorKey: 'sample_order_no',
		header: 'Sample O/N',
		enableColumnFilter: false,
		cell: (info) => (
			<CustomLink
				label={info.getValue()}
				url={`/order/details/${info.getValue()}`}
				openInNewTab={true}
			/>
		),
	},
	{
		accessorFn: (row) => {
			let date = formatDistanceStrict(
				row.issue_date,
				row.delivery_last_date || Date.now(),
				{ unit: 'day' }
			);

			return date;
		},
		id: 'day_passed',
		header: 'Day Passed',
		enableColumnFilter: false,
	},
	// {
	// 	accessorKey: 'issue_date',
	// 	header: 'Issue Date',
	// 	enableColumnFilter: false,
	// 	cell: (info) => <DateTime date={info.getValue()} isTime={false} />,
	// },
	// {
	// 	accessorKey: 'delivery_last_date',
	// 	header: 'Last Delivery Date',
	// 	enableColumnFilter: false,
	// 	cell: (info) =>
	// 		info.getValue() ? (
	// 			<DateTime date={info.getValue()} isTime={false} />
	// 		) : (
	// 			'N/A'
	// 		),
	// },
	// {
	// 	accessorKey: 'status',
	// 	header: 'Status',
	// 	enableColumnFilter: false,
	//
	// },
	{
		accessorKey: 'delivery_order_quantity',
		header: 'Delivery Qty',
		enableColumnFilter: false,
	},
];

export const order_entry_feed_columns = [
	{
		accessorKey: 'order_no',
		header: 'O/N',
		enableColumnFilter: false,
		cell: (info) => (
			<CustomLink
				label={info.getValue()}
				url={`/order/details/${info.getValue()}`}
				openInNewTab={true}
			/>
		),
	},
	{
		accessorKey: 'party_name',
		header: 'Party Name',
		enableColumnFilter: false,
		cell: (info) => getSLicedValue(info.getValue()),
	},
	{
		accessorKey: 'marketing_name',
		header: 'S & M',
		enableColumnFilter: false,
		cell: (info) => getSLicedValue(info.getValue()),
	},
	{
		accessorKey: 'item',
		header: 'Item',
		enableColumnFilter: false,
		cell: (info) => getSLicedValue(info.getValue(), 10),
	},
	{
		accessorKey: 'quantity',
		header: 'Total',
		enableColumnFilter: false,
	},
];

export const pi_register_columns = [
	{
		accessorKey: 'pi_cash_number',
		header: 'PI Number',
		enableColumnFilter: false,
		cell: (info) => (
			<CustomLink
				label={info.getValue()}
				url={`/commercial/pi/${info.getValue()}`}
				openInNewTab={true}
			/>
		),
	},
	{
		accessorKey: 'party_name',
		header: 'Party Name',
		enableColumnFilter: false,
		cell: (info) => getSLicedValue(info.getValue()),
	},
	// {
	// 	accessorKey: 'bank_name',
	// 	header: 'Bank',
	// 	enableColumnFilter: false,
	//
	// },
	{
		accessorKey: 'total_pi_value',
		header: 'PI Value(USD)',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'lc_date',
		header: 'LC Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} isTime={false} />,
	},
];

export const doc_rcv_columns = [
	{
		accessorKey: 'file_number',
		header: 'Doc. Rcv. No.',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'party_name',
		header: 'Party Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'marketing_name',
		header: 'S & M',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'lc_value',
		header: 'LC Value(USD)',
		enableColumnFilter: false,
		cell: (info) => Number(info.getValue()).toFixed(2),
	},
	{
		accessorKey: 'lc_date',
		header: 'LC Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} isTime={false} />,
	},
];
export const stock_status_columns = [
	{
		accessorKey: 'name',
		header: 'Name',
		enableColumnFilter: false,
		cell: (info) => getSLicedValue(info.getValue(), 15),
	},
	{
		accessorKey: 'threshold',
		header: 'Threshold',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'stock',
		header: 'Stock',
		enableColumnFilter: false,
		cell: ({ row }) => {
			const { stock, threshold } = row.original;

			return (
				<span
					className={
						stock < threshold ? 'text-error' : 'text-success'
					}>
					{stock}
				</span>
			);
		},
	},
	{
		accessorKey: 'unit',
		header: 'Unit',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'last_purchase_date',
		header: 'Purchased',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} isTime={false} />,
	},
	{
		accessorKey: 'lead_time',
		header: 'Lead Time',
		enableColumnFilter: false,
	},
];
export const pi_to_be_submitted_columns = [
	{
		accessorKey: 'name',
		header: 'Party Name',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'total_quantity',
		header: 'Order Qty',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'total_delivered',
		header: 'Delivered',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'total_undelivered_balance_quantity',
		header: 'Undelivered',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'total_balance_pi_value',
		header: 'PI Value(USD)',
		enableColumnFilter: false,
	},
];
