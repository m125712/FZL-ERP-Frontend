import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useSliderDieCastingProduction } from '@/state/Slider';

import { DateTime, EditDelete } from '@/ui';
import PageContainer from '@/ui/Others/PageContainer';
import PageInfo from '@/util/PageInfo';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const { data, isLoading, url, deleteData } =
		useSliderDieCastingProduction();
	const navigate = useNavigate();
	const info = new PageInfo(
		'Production',
		url,
		'slider__die_casting_production'
	);

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
			label: 'Production',
			href: '/slider/die-casting/production',
		},
	];

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const haveAccess = useAccess('slider__die_casting_production');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'mc_no',
				header: 'M/C',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_name',
				header: 'Item Name',
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'item_type',
			// 	header: 'Type',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'cavity_goods',
				header: 'Cavity Goods',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'cavity_defect',
				header: 'Cavity Defect',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'push',
				header: 'Push',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_quantity',
				header: (
					<>
						Production QTY
						<br />
						(PCS)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'weight',
				header: (
					<>
						Weight
						<br />
						(KG)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'pcs_per_kg',
				header: (
					<>
						Unit Qty
						<br />
						(PCS/KG)
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
				header: 'Created At',
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

	// Add
	const handelAdd = () => navigate('/slider/die-casting/production/entry');

	// Update
	const handelUpdate = (uuid) => {
		navigate(`/slider/die-casting/production/update/${uuid}`);
	};

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].die_casting_name.replace(/ /g, '_'),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<PageContainer title='Production Lists' breadcrumbs={breadcrumbs}>
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
				extraClass={'py-0.5'}
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
}
