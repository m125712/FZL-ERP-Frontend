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
		cell: (info) => info.getValue(),
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
	// 	cell: (info) => info.getValue(),
	// },
	{
		accessorKey: 'delivery_order_quantity',
		header: 'Delivery Qty',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
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
		cell: (info) => info.getValue(),
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
	// 	cell: (info) => info.getValue(),
	// },
	{
		accessorKey: 'total_pi_value',
		header: 'PI Value(USD)',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
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
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'party_name',
		header: 'Party Name',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'marketing_name',
		header: 'S & M',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
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
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'threshold',
		header: 'Threshold',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'stock',
		header: 'Stock',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'unit',
		header: 'Unit',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'last_purchase_date',
		header: 'Purchase Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} isTime={false} />,
	},
	{
		accessorKey: 'lead_time',
		header: 'Lead Time(days)',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
];
export const pi_to_be_submitted_columns = [
	{
		accessorKey: 'name',
		header: 'Party Name',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'total_quantity',
		header: 'Order Qty',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'total_delivered',
		header: 'Delivered',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'total_undelivered_balance_quantity',
		header: 'Undelivered',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'total_balance_pi_value',
		header: 'PI Value(USD)',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
];
