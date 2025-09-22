import { useEffect, useMemo } from 'react';
import { ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { useAccNeedToAccept } from './config/query';
import { storeType } from './utils';

export default function Index() {
	const { data, isLoading } = useAccNeedToAccept();
	const navigate = useNavigate();

	const info = new PageInfo(
		'Need to Accept',
		'/accounting/need-to-accept',
		'accounting__need_to_accept'
	);
	const haveAccess = useAccess('accounting__need_to_accept');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'purchase_id',
				header: 'ID',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'vendor_name',
				header: 'Vendor',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_price',
				header: 'Total Price',
				enableColumnFilter: false,
				cell: (info) => (
					<div>
						<span className='text-sm'>{info.getValue()}</span>
						<span className='text-sm'>
							{info.row.original.currency_symbol}
						</span>
					</div>
				),
			},
			{
				accessorKey: 'store_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='text-sm'>
						{storeType.find((x) => x.value === info.getValue())
							?.label || info.getValue()}
					</span>
				),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-20',
				cell: (info) => {
					return (
						<ArrowRightCircle
							onClick={() => handelUpdate(info.row.index)}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server'
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const handelUpdate = (index) => {
		navigate(
			`/accounting/voucher/entry/${data?.[index]?.store_type}/${data?.[index]?.vendor_name.split(' ').join('_')}/${data?.[index]?.purchase_id}/${data?.[index]?.total_price}`
		);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
		</div>
	);
}
