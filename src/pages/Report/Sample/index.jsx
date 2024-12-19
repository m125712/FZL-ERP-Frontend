import { useEffect, useMemo, useState } from 'react';
import { useSample } from '@/state/Report';
import { format } from 'date-fns';

import ReactTable from '@/components/Table';
import { DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import Header from './Header';

export default function Index() {
	const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
	const { data, isLoading, url } = useSample(date);
	const info = new PageInfo('Sample', url, 'report__sample');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'Order Ref.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'Product',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'issue_date',
				header: 'Order Date',
				enableColumnFilter: false,
				cell: (info) =>
					info.getValue() && <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'item_name',
				header: 'Type',
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
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => {
					const { is_inch, order_type } = info.row.original;

					return order_type === 'tape'
						? 'Meter'
						: is_inch
							? 'Inch'
							: 'Cm';
				},
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<Header date={date} setDate={setDate} />
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
