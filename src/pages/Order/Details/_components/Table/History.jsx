import { useMemo } from 'react';
import { useOrderEntryHistory } from '@/state/Order';

import { HistoryModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime } from '@/ui';

export default function Index({
	modalId = '',
	history = {
		uuid: null,
		order_entry_uuid: null,
	},
	setHistory,
}) {
	const { data, isLoading } = useOrderEntryHistory(history?.order_entry_uuid);

	const onClose = () => {
		// document.getElementById(modalId).close();
		window[modalId].close();
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-32',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'quantity',
				header: <span>Quantity</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'company_price',
				header: <span>Company Price</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: <span>Party Price</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: <span>Created By</span>,
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: <span>Created At</span>,
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<HistoryModal
			id={modalId}
			title={modalId + ': History'}
			onClose={onClose}
		>
			<ReactTable showTitleOnly={true} data={data} columns={columns} />
		</HistoryModal>
	);
}
