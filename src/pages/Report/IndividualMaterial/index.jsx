import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useIndividualMaterial } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { REPORT_DATE_FORMATE } from '../utils';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (
		haveAccess.includes('show_own_orders') &&
		haveAccess.includes('show_zero_balance') &&
		userUUID
	) {
		return `own_uuid=${userUUID}&show_zero_balance=1`;
	} else if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}&show_zero_balance=0`;
	} else if (haveAccess.includes('show_zero_balance') && userUUID) {
		return `show_zero_balance=1`;
	}

	return `show_zero_balance=0`;
};

export default function Index() {
	const haveAccess = useAccess('report__individual_material');

	const { user } = useAuth();
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [material, setMaterial] = useState(null);
	// const { data, isLoading, url } = useIndividualMaterial(
	// 	format(date, 'yyyy-MM-dd'),
	// 	format(toDate, 'yyyy-MM-dd'),
	// 	getPath(haveAccess, user?.uuid),
	// 	!!user?.uuid
	// );

	const { data, isLoading, url } = useIndividualMaterial(material);
	const info = new PageInfo(
		'Individual Material',
		url,
		'report__individual_material'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'vendor_name',
				header: 'Vendor',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'store_type',
				header: 'Store Type',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'price',
				header: 'Price',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_local',
				header: 'Local',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'lc_number',
				header: 'LC No.',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan No.',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					REPORT_DATE_FORMATE(row.purchase_created_at),
				id: 'purchase_created_at',
				header: 'Purchase Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.purchase_created_at}
						isTime={false}
						customizedDateFormate='dd MMM, yy'
					/>
				),
			},
			{
				accessorKey: 'purchase_id',
				header: 'Purchase Id',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'purchase_description_remarks',
				header: 'Purchase Remarks',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<Header material={material} setMaterial={setMaterial} />
			<ReactTable
				key='bulk'
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
				// extraButton={
				// 	haveDateAccess && (
				// 		<div className='flex items-center gap-2'>
				// 			<SimpleDatePicker
				// 				className='h-[2.34rem] w-32'
				// 				key={'Date'}
				// 				value={date}
				// 				placeholder='Date'
				// 				onChange={(data) => {
				// 					setDate(data);
				// 				}}
				// 				selected={date}
				// 			/>
				// 			<SimpleDatePicker
				// 				className='h-[2.34rem] w-32'
				// 				key={'toDate'}
				// 				value={toDate}
				// 				placeholder='To'
				// 				onChange={(data) => {
				// 					setToDate(data);
				// 				}}
				// 				selected={toDate}
				// 			/>
				// 		</div>
				// 	)
				// }
			/>
		</>
	);
}
