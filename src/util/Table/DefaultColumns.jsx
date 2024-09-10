import { DateTime, EditDelete } from '@/ui';

export const DEFAULT_COLUMNS = ({
	handelUpdate = () => {},
	handelDelete = () => {},
	haveAccess,
}) => [
	{
		accessorKey: 'remarks',
		header: 'Remarks',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'created_by_name',
		header: 'Created By',
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		enableColumnFilter: false,
		filterFn: 'isWithinRange',
		cell: (info) => <DateTime date={info.getValue()} />,
	},
	{
		accessorKey: 'updated_at',
		header: 'Updated',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.getValue()} />,
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		enableColumnFilter: false,
		enableSorting: false,
		hidden:
			!haveAccess.includes('update') && !haveAccess.includes('delete'),
		width: 'w-24',
		cell: (info) => (
			<EditDelete
				idx={info.row.index}
				handelUpdate={handelUpdate}
				handelDelete={handelDelete}
				showUpdate={haveAccess.includes('update')}
				showDelete={haveAccess.includes('delete')}
			/>
		),
	},
];
