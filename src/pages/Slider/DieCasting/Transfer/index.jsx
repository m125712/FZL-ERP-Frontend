import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useSliderDieCastingTransfer } from '@/state/Slider';

import { DateTime, EditDelete } from '@/ui';
import PageContainer from '@/ui/Others/PageContainer';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

const Index = () => {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData } = useSliderDieCastingTransfer();
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
		navigate(`/slider/die-casting/transfer/update/${uuid}`);
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

	const breadcrumbs = [
		{
			label: 'Slider',
			isDisabled: true,
		},
		{
			label: 'Die Casting',
			isDisabled: true,
		},
		{
			label: 'Transfer',
			href: '/slider/die-casting/transfer',
		},
	];

	return (
		<PageContainer title='Transfer Lists' breadcrumbs={breadcrumbs}>
			<ReactTable
				title={info.getTitle()}
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
					}}
				/>
			</Suspense>
		</PageContainer>
	);
};

export default Index;
