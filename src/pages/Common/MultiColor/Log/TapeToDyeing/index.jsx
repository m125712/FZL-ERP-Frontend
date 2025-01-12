import { useMemo, useState } from 'react';
import { useCommonMultiColorLog } from '@/state/Common';
import { useOtherOrderDescription } from '@/state/Other';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { CustomLink, DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, deleteData, isLoading, url, updateData } =
		useCommonMultiColorLog();
	const info = new PageInfo('Tape -> Dyeing', url, 'common__multi_color_log');

	const haveAccess = useAccess('common__multi_color_log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						openInNewTab={true}
					/>
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
				accessorKey: 'is_received_in_sewing',
				header: 'Dying Received?',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<SwitchToggle
							disabled={false}
							onChange={() => handelSwitch(info.row.index)}
							checked={info.getValue() === 1}
						/>
					);
				},
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

	const { data: order_id } = useOtherOrderDescription();

	// Update
	const [entry, setEntry] = useState({
		uuid: null,
		trx_quantity: null,
		tape_prod: null,
		remarks: null,
	});

	const handelUpdate = (idx) => {
		setEntry((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			trx_quantity: data[idx].trx_quantity,
			tape_prod: data[idx].tape_prod,
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

	const handelSwitch = async (idx) => {
		const val = data[idx];

		await updateData.mutateAsync({
			url: `/zipper/tape-coil-to-dyeing/${val?.uuid}`,
			updatedData: {
				is_received_in_sewing: val.is_received_in_sewing ? 0 : 1,
			},
		});
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						order_id,
						entry,
						setEntry,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					deleteData={deleteData}
					url={`/zipper/tape-coil-to-dyeing`}
				/>
			</Suspense>
		</div>
	);
}
