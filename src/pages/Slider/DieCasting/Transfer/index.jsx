import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import {
	useSliderDieCastingStock,
	useSliderDieCastingTransferAgainstStock,
} from '@/state/Slider';
import { DateTime, EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

const Index = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData } =
		useSliderDieCastingTransferAgainstStock();
	const { invalidateQuery } = useSliderDieCastingStock();
	const info = new PageInfo('Transfer', url, 'slider__die_casting_transfer');
	const haveAccess = useAccess('slider__die_casting_transfer');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_uuid',
				header: 'die_casting_uuid',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'created_by_name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
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
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					const uuid = info.row.original?.uuid;
					return (
						<EditDelete
							handelUpdate={() => handelUpdate(uuid)}
							handelDelete={() => handelDelete(info.row.id)}
							showDelete={haveAccess.includes('delete')}
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
	const handelAdd = () => navigate('/slider/die-casting/transfer/entry');

	// Update
	const handelUpdate = (uuid) => {
		// navigate(`/slider/die-casting/transfer/update/${uuid}`);
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
		<>
			<ReactTable
				title='Against Stock > Slider Assembly'
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
						invalidateQuery,
					}}
				/>
			</Suspense>
		</>
	);
};

export default Index;
