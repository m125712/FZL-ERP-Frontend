import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc, useFetch } from '@/hooks';
import { EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useCommonTapeToDyeing } from '@/state/Common';
import TapeToDyeingAddOrUpdate from './TapeToDyeingAddOrUpdate';
export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading, isError } =
		useCommonTapeToDyeing();
	const info = new PageInfo('SFG Tape Log', '/zipper/tape-coil-to-dyeing');
	const [coilLog, setCoilLog] = useState([]);

	const haveAccess = useAccess('common__coil_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},

			{
				accessorKey: 'trx_quantity',
				header: (
					<span>
						Stock
						<br />
						(KG)
					</span>
				),
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
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_update_sfg'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('click_delete_sfg')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	// useEffect(() => {
	// 	useFetchFunc(info.getFetchUrl(), setCoilLog, setLoading, setError);
	// }, []);

	const { value: order_id } = useFetch(
		'/other/order/description/value/label'
	);

	// Update
	const [updateCoilLog, setUpdateCoilLog] = useState({
		id: null,
		trx_from: null,
		trx_to: null,
		item_name: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		coil_stock: null,
		dying_and_iron_stock: null,
		finishing_stock: null,
		order_entry_id: null,
		zipper_number_name: null,
	});

	const [entryUUID, setEntryUUID] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setEntryUUID((prev) => ({
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
			itemName:
				data[idx].order_number + ' - ' + data[idx].item_description,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<TapeToDyeingAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						order_id,
						entryUUID,
						setEntryUUID,
						setCoilLog,
						updateCoilLog,
						setUpdateCoilLog,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setCoilLog}
					deleteData={deleteData}
					url={`/zipper/tape-coil-to-dyeing`}
				/>
			</Suspense>
		</div>
	);
}
