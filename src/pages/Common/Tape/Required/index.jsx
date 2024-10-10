import { lazy, useEffect, useMemo, useState } from 'react';
import { useCommonTapeRequired } from '@/state/Common';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';
import { DEFAULT_COLUMNS } from '@/util/Table/DefaultColumns';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useCommonTapeRequired();
	const info = new PageInfo('Tape Required', url, 'common__tape_required');
	const haveAccess = useAccess(info.getTab());

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	//* Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	//* Add or Update
	const [updateTapeRequired, setUpdateTapeRequired] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateTapeRequired((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	//* Delete
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

	const columns = useMemo(
		() => [
			{
				accessorKey: 'end_type_name',
				header: 'End Type',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'nylon_stopper_name',
				header: 'Nylon Stopper',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper Number',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'top',
				header: 'Top',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bottom',
				header: 'Bottom',
				enableColumnFilter: false,
				cell: (info) =>info.getValue(),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateTapeRequired,
						setUpdateTapeRequired,
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
