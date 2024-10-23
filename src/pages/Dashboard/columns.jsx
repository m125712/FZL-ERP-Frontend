import { DateTime } from '@/ui';

export const sample_lead_time_columns = [
	{
		accessorKey: 'sample_order_no',
		header: 'Sample O/N',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'issue_date',
		header: 'Issue Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} />,
	},
	{
		accessorKey: 'delivery_last_date',
		header: 'Last Delivery Date',
		enableColumnFilter: false,
		cell: (info) =>
			info.getValue() ? <DateTime date={info.getValue()} /> : 'N/A',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
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
		accessorKey: 'item',
		header: 'Item',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'quantity',
		header: 'Total Quantity',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
];

export const pi_register_columns = [
	{
		accessorKey: 'pi_cash_number',
		header: 'PI Number',
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
		accessorKey: 'bank_name',
		header: 'Bank',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
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
		cell: (info) => <DateTime date={info.getValue()} />,
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
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'lc_date',
		header: 'LC Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} />,
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
		header: 'Last Purchase Date',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} />,
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
