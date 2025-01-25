import { lazy, useMemo, useState } from 'react';
import { useDyeingTransfer } from '@/state/Dyeing';
import { useOtherOrderDescription } from '@/state/Other';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Update = lazy(() => import('./EntryUpdate/Update'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useDyeingTransfer();
	const { invalidateQuery: invalidateOrderDescription } =
		useOtherOrderDescription();
	const info = new PageInfo('Dyeing Store', url, 'common__dyeing_transfer');
	const haveAccess = useAccess('common__dyeing_transfer');
	const navigate = useNavigate();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${info.getValue()}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}/${order_description_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'order_description',
			// 	header: 'Style / Color / Size',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<span className='capitalize'>{info.getValue()}</span>
			// 	),
			// },
			// {
			// 	accessorKey: "trx_from",
			// 	header: "Transferred From",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
			// {
			// 	accessorKey: 'colors',
			// 	header: 'Colors',
			// 	enableColumnFilter: false,
			// 	cell: (info) => {
			// 		return (
			// 			<span className='capitalize'>
			// 				{info.getValue().replace(/_|stock/g, ' ')}
			// 			</span>
			// 		);
			// 	},
			// },
			// {
			// 	accessorKey: 'section',
			// 	header: 'Section',
			// 	enableColumnFilter: false,
			// 	cell: (info) => {
			// 		return (
			// 			<span className='capitalize'>
			// 				{info.getValue().replace(/_|stock/g, ' ')}
			// 			</span>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'trx_quantity_in_meter',
				header: (
					<span>
						Transferred
						<br />
						QTY (M)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => (info.getValue() > 0 ? info.getValue() : '---'),
			},
			{
				accessorKey: 'trx_quantity',
				header: (
					<span>
						Transferred
						<br />
						QTY (KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
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

	// Update
	const [updateTransfer, setUpdateTransfer] = useState({
		uuid: null,
	});

	// Add
	const handelAdd = () => navigate('/common/dyed-store/entry');

	const handelUpdate = (idx) => {
		setUpdateTransfer((prev) => ({
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
			itemName: data[idx].item_description,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				title={info.getTitle()}
				data={data}
				columns={columns}
			/>
			<Suspense>
				<Suspense>
					<Update
						modalId={info.getAddOrUpdateModalId()}
						{...{
							updateTransfer,
							setUpdateTransfer,
						}}
					/>
				</Suspense>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					invalidateQuery={invalidateOrderDescription}
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
