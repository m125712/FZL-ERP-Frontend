import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { useDyeingTransfer } from '@/state/Dyeing';
import { useMetalTMTapeLog } from '@/state/Metal';
import {
	useNylonMetallicFinishingTapeLog,
	useNylonPlasticFinishingTapeLog,
} from '@/state/Nylon';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Update = lazy(() => import('./Update'));

export default function Index() {
	const { data, isLoading, url, deleteData } =
		useNylonMetallicFinishingTapeLog();
	const info = new PageInfo(
		'Tape Transfer Log',
		url,
		'nylon__metallic_finishing_log'
	);

	const haveAccess = useAccess('nylon__metallic_finishing_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
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
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'colors',
				header: 'Colors',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>
							{info.getValue().replace(/_|stock/g, ' ')}
						</span>
					);
				},
			},
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
					!haveAccess.includes('click_update_tape') &&
					!haveAccess.includes('click_delete_tape'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'click_delete_tape'
							)}
							showUpdate={haveAccess.includes(
								'click_update_tape'
							)}
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
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
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
					{...{
						deleteItem,
						setDeleteItem,
						deleteData,
					}}
					url='/zipper/dyed-tape-transaction'
				/>
			</Suspense>
		</div>
	);
}
