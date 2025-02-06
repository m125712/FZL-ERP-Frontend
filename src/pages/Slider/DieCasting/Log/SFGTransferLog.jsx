import { lazy, useEffect, useMemo, useState } from 'react';
import { useFetchFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const info = new PageInfo(
		'Die Casting Transfer Log',
		'sfg/trx/by/die_casting_prod'
	);
	const [dieCastingLog, setDieCastingLog] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// section	tape_or_coil_stock_id	quantity	wastage	issued_by

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_description',
				header: 'Style / Color / Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			// {
			// 	accessorKey: "trx_from",
			// 	header: "Transferred From",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
			{
				accessorKey: 'trx_to',
				header: 'Transferred To',
				enableColumnFilter: false,
				cell: (info) => {
					// remove underscore and capitalize
					const str = info.getValue();
					if (str) {
						const newStr = str.split('_').join(' ');
						return newStr.charAt(0).toUpperCase() + newStr.slice(1);
					} else {
						return str;
					}
				},
			},
			{
				accessorKey: 'trx_quantity',
				header: 'Transferred QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'issued_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// {
			// 	accessorKey: "actions",
			// 	header: "Actions",
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !SECTION_EDIT_ACCESS,
			// 	width: "w-24",
			// 	cell: (info) => {
			// 		return (
			// 			<EditDelete
			// 				idx={info.row.index}
			// 				handelUpdate={handelUpdate}
			// 				handelDelete={handelDelete}
			// 			/>
			// 		);
			// 	},
			// },
		],
		[dieCastingLog]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setDieCastingLog,
			setLoading,
			setError
		);
	}, []);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={dieCastingLog}
				columns={columns}
			/>
		</div>
	);
}
