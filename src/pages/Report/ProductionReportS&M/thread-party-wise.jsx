import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useOtherCountLength } from '@/state/Other';
import {
	usePIToBeSubmitted,
	useProductionReportThreadPartyWise,
} from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

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

export default function Index() {
	const haveAccess = useAccess('report__production_report_sm');
	const { user } = useAuth();

	const { data, isLoading, url } = useProductionReportThreadPartyWise(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo(
		'Production Report (Thread : Party Wise)',
		url,
		'production_report_thread_party_wise'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);
	const { data: count_length } = useOtherCountLength();

	const columns = useMemo(() => {
		const staticColumns = [
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info?.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Quantity',
				enableColumnFilter: false,
				cell: (info) => info?.getValue(),
			},
		];

		const countLengthColumns = count_length?.map((nodeItem) => ({
			accessorKey: nodeItem?.label,
			header: nodeItem?.label,
			enableColumnFilter: false,
			cell: (info) => info?.getValue() || 0,
		}));

		return staticColumns?.concat(countLengthColumns);
	}, [data, count_length]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
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
