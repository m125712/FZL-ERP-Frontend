import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useLC } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { REPORT_DATE_FORMATE } from '../utils';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__lc_due');
	const { user } = useAuth();

	const [due, setDue] = useState('/report/lc-report?document_receiving=true');
	const { data, isLoading, url } = useLC(
		`${due}&${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);

	const info = new PageInfo('LC', url, 'report__lc_due');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'file_number',
				header: 'File No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lc_number',
				header: 'LC No',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/commercial/lc/details/${uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.lc_date),
				id: 'lc_date',
				header: 'LC Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'party_name',
				header: 'Party.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_value',
				header: 'LC Value.',
				enableColumnFilter: false,
				cell: (info) =>
					info.getValue() ? Number(info.getValue()).toFixed(2) : '',
			},
			{
				accessorKey: 'amount',
				header: 'Amount',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.handover_date),
				id: 'handover_date',
				header: 'Handover Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorFn: (row) =>
					REPORT_DATE_FORMATE(row.document_receive_date),
				id: 'document_receive_date',
				header: 'Doc Received Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.maturity_date),
				id: 'maturity_date',
				header: 'Maturity Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.payment_date),
				id: 'payment_date',
				header: 'Payment Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'payment_value',
				header: 'Payment Value',
				enableColumnFilter: false,
				cell: (info) =>
					info.getValue() ? Number(info.getValue()).toFixed(2) : '',
			},
			{
				accessorKey: 'total_value',
				header: 'Total Value',
				enableColumnFilter: false,
				cell: (info) =>
					info.getValue() ? Number(info.getValue()).toFixed(2) : '',
			},
			{
				accessorKey: 'ldbc_fdbc',
				header: 'LDBC/FDBC',
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
				accessorKey: 'marketing_name',
				header: 'Marketing Executive',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'commercial_executive',
				header: 'Commercial Executive',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_bank',
				header: 'Party Bank',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'renarks',
				header: 'Remarks.',
				enableColumnFilter: false,
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
			<Header due={due} setDue={setDue} />
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
