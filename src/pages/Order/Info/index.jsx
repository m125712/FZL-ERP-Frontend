import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { DateTime, EditDelete, LinkWithCopy, StatusButton } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const info = new PageInfo('Order Info', 'order/info', 'order__info');
	const haveAccess = useAccess('order__info');

	const [orderInfo, setOrderInfo] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Sample/Bill/Cash',
				enableColumnFilter: false,
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						<div className='flex space-x-1'>
							<StatusButton size='btn-xs' value={is_sample} />
							<StatusButton size='btn-xs' value={is_bill} />
							<StatusButton
								size='btn-xs'
								value={is_cash === 1 ? 0 : 1}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/order/details'
					/>
				),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
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
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_priority',
				header: 'Priority (Mkt/Fac)',
				enableColumnFilter: false,
				cell: (info) => {
					const { marketing_priority, factory_priority } =
						info.row.original;
					return `${marketing_priority}/${factory_priority}`;
				},
			},
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'issued_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
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
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
						/>
					);
				},
			},
		],
		[orderInfo]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setOrderInfo, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateOrderInfo, setUpdateOrderInfo] = useState({
		id: null,
		order_number: null,
		reference_order: null,
		party_id: null,
		buyer_id: null,
		merchandiser_id: null,
		marketing_id: null,
		factory_id: null,
		issued_by_id: null,
	});

	const handelUpdate = (idx) => {
		const prevData = orderInfo[idx];
		setUpdateOrderInfo((prev) => ({
			...prev,
			...prevData,
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
			itemId: orderInfo[idx].id,
			itemName: orderInfo[idx].order_number,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={orderInfo}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setOrderInfo,
						updateOrderInfo,
						setUpdateOrderInfo,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setOrderInfo}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
