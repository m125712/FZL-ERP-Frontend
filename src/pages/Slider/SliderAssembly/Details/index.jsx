import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { useAccess, useFetchFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const info = new PageInfo(
		'Production',
		'slider/slider-assembly',
		'slider__assembly_details'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const [slider, setSlider] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const haveAccess = useAccess('slider__assembly_details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: "party",
			// 	header: "Party",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
			{
				accessorKey: 'item_name_label',
				header: 'Item Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_quantity',
				header: (
					<>
						Production QTY <br />
						(PCS)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_weight',
				header: (
					<>
						Production Weight <br />
						(KG)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'weight',
				header: (
					<>
						Weight <br />
						(PCS / KG)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: "remarks",
			// 	header: "Remarks",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
			// {
			// 	accessorKey: "issued_by_name",
			// 	header: "Issued By",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
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
			// {
			// 	accessorKey: "updated_at",
			// 	header: "Updated",
			// 	enableColumnFilter: false,
			// 	width: "w-24",
			// 	cell: (info) => {
			// 		return <DateTime date={info.getValue()} />;
			// 	},
			// },
			{
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					const uuid = info.row.original.slider_slider_assembly_uuid;
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
		[slider]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setSlider, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => navigate('/slider/slider-assembly/entry');

	// Update
	const handelUpdate = (uuid) => {
		navigate(`/slider/slider-assembly/update/${uuid}`);
	};

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: slider[idx].id,
			itemName: slider[idx].item_name_label.replace(/ /g, '_'),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes('create')}
				data={slider}
				columns={columns}
				handelAdd={handelAdd}
				extraClass={'py-0.5'}
			/>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setSlider}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
