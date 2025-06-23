import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDailyChallan } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { ProductionStatus, REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__daily_challan');
	const { user } = useAuth();

	const [status, setStatus] = useState('pending');
	const { data, isLoading, url } = useDailyChallan(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo(
		'Daily Challan Status',
		url,
		'report__daily_challan'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.challan_date),
				id: 'challan_date',
				header: 'Challan Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.challan_date}
						isTime={false}
						customizedDateFormate='dd MMM, yy'
					/>
				),
			},
			{
				accessorKey: 'challan_id',
				header: 'Challan No.',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/challan/${uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					const { product, order_info_uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={
								product === 'thread'
									? `/thread/order-info/${order_info_uuid}`
									: `/order/details/${info.getValue()}`
							}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'product',
				header: 'Product',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.gate_pass ? 'YES' : 'NO'),
				id: 'gate_pass',
				header: 'Gate Pass',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.gate_pass}
					/>
				),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Prepared By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorFn: (row) => {
					const { lc_numbers } = row;
					if (lc_numbers?.length === 0) return '--';

					return lc_numbers?.map((lc) => lc?.lc_number).join(', ');
				},
				id: 'lc_numbers',
				header: 'LC No.',
				enableColumnFilter: false,
				cell: (info) => {
					const { lc_numbers } = info.row.original;

					if (lc_numbers?.length === 0) return '--';

					return lc_numbers?.map((lc) => (
						<CustomLink
							key={lc?.lc_number}
							label={lc?.lc_number}
							url={`/commercial/lc/details/${lc?.lc_uuid}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorFn: (row) => {
					const { pi_numbers } = row;

					if (pi_numbers?.length === 0) return '--';

					return pi_numbers?.map((pi) => pi?.pi_number).join(', ');
				},
				id: 'pi_numbers',
				header: 'Pi No.',
				enableColumnFilter: false,
				cell: (info) => {
					const { pi_numbers } = info.row.original;
					if (pi_numbers?.length === 0) return '--';

					return pi_numbers?.map((pi) => (
						<CustomLink
							key={pi?.pi_number}
							label={pi?.pi_number}
							url={`/commercial/pi/${pi?.pi_number}`}
							openInNewTab
						/>
					));
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'S&M',
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
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				<ProductionStatus
					className='w-44'
					status={status}
					setStatus={setStatus}
					page='report__daily_challan'
				/>
			}
		/>
	);
}
