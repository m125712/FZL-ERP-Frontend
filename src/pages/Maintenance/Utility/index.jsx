import { lazy, useEffect, useMemo, useState } from 'react';
import { useUtility } from '@/state/Maintenance';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('maintenance__utility');
	const { data, isLoading, deleteData } = useUtility();

	const info = new PageInfo(
		'Maintenance / Utility',
		'/maintenance/utility',
		'maintenance__utility'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'off_day',
				header: 'Off Day',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.off_day}
					/>
				),
			},
			{
				accessorKey: 'utility_id',
				header: 'ID',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					const { uuid } = info.row.original;
					const dateValue = info.getValue();
					return (
						<CustomLink
							url={`/maintenance/utility/${uuid}`}
							label={dateValue}
							openInNewTab={true}
							showCopyButton={true}
						/>
					);
				},
			},
			{
				accessorKey: 'date',
				header: 'Date',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					const dateValue = info.getValue();
					return <DateTime date={dateValue} isTime={false} />;
				},
			},
			{
				accessorKey: 'previous_date',
				header: 'Previous Date',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();
					return value ? format(parseISO(value), 'dd/MM/yyyy') : '-';
				},
			},

			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue() || '-',
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();
					return value ? <DateTime date={value} /> : '-';
				},
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
						/>
					);
				},
			},
		],
		[data, haveAccess]
	);

	// Add
	const handelAdd = () => navigate('/maintenance/utility/entry');

	const handelUpdate = (idx) => {
		navigate(`/maintenance/utility/${data[idx].uuid}/update`);
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].date
				? format(parseISO(data[idx].date), 'dd/MM/yyyy')
				: data[idx].uuid,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/maintain/utility',
						deleteData,
					}}
				/>
			</Suspense>
		</>
	);
}
