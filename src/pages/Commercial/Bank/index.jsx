import { lazy, useEffect, useMemo, useState } from 'react';
import { useCommercialBank } from '@/state/Commercial';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

// function IndeterminateCheckbox({ indeterminate, ...rest }) {
// 	const ref = useRef(null);

// 	useEffect(() => {
// 		if (typeof indeterminate === "boolean") {
// 			ref.current.indeterminate = indeterminate;
// 		}
// 	}, [ref, indeterminate]);

// 	return (
// 		<input
// 			type="checkbox"
// 			className="checkbox-secondary checkbox checkbox-sm"
// 			ref={ref}
// 			{...rest}
// 		/>
// 	);
// }

export default function Index() {
	const { data, isLoading, url, deleteData } = useCommercialBank();
	const info = new PageInfo('Commercial/Bank', url, 'commercial__bank');
	const haveAccess = useAccess('commercial__bank');

	const [rowSelection, setRowSelection] = useState({});

	const columns = useMemo(
		() => [
			// {
			// 	accessorKey: "select",
			// 	header: ({ table }) => (
			// 		<IndeterminateCheckbox
			// 			checked={table.getIsAllRowsSelected()}
			// 			indeterminate={table.getIsSomeRowsSelected()}
			// 			onChange={table.getToggleAllRowsSelectedHandler()}
			// 		/>
			// 	),
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	cell: ({ row }) => (
			// 		<IndeterminateCheckbox
			// 			checked={row.getIsSelected()}
			// 			indeterminate={row.getIsSomeSelected()}
			// 			onChange={row.getToggleSelectedHandler()}
			// 		/>
			// 	),
			// },
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'swift_code',
				header: 'Swift Code',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'routing_no',
				header: 'Routing No',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'address',
				header: 'Address',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'policy',
				header: 'Policy',
				width: 'w-24',
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
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateBank, setUpdateBank] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateBank((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
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
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				// subtitle={`Selected: ${Object.keys(rowSelection).length ?? 0}`}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateBank,
						setUpdateBank,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
