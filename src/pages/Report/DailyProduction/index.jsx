import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionReportDateWise, useReportStock } from '@/state/Report';
import { formToJSON } from 'axios';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/DailyProduction';
import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';

import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `own_uuid=${userUUID}&approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return 'all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=false`;
};

export default function index() {
	const haveAccess = useAccess('report__daily_production');
	const { user } = useAuth();

	const info = new PageInfo(
		'Daily Production',
		null,
		'report__daily_production'
	);

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const { data, isLoading } = useProductionReportDateWise(
		from,
		from,
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_section_name',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'opening_quantity',
				header: 'Opening',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'purchase_quantity',
				header: 'Purchase',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'consumption_quantity',
				header: 'Consumption',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'closing_quantity',
				header: 'Closing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);
	useEffect(() => {
		document.title = info.getTabName();
	}, []);
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<div className='flex flex-col gap-8'>
				<Header {...{ from, setFrom }} />
				<button
					type='button'
					onClick={() => {
						Pdf(data, from)?.print({}, window);
					}}
					className='btn btn-primary'>
					Generate PDF
				</button>
			</div>
		</>
	);
}
