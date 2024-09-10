import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useSliderDieCastingStock } from '@/state/Slider';
import { DateTime, EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useSliderDieCastingStock();
	const info = new PageInfo('Stock', url, 'slider__die_casting_stock');
	const haveAccess = useAccess('slider__die_casting_stock');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => {
					const {
						is_body,
						is_puller,
						is_cap,
						is_link,
						is_h_bottom,
						is_u_top,
						is_box_pin,
						is_two_way_pin,
					} = info?.row?.original;

					const renderBadges = () => {
						const badges = [
							{
								label: 'Body',
								isActive: is_body === 1,
							},
							{
								label: 'Puller',
								isActive: is_puller === 1,
							},
							{
								label: 'Cap',
								isActive: is_cap === 1,
							},
							{
								label: 'Link',
								isActive: is_link === 1,
							},
							{
								label: 'H Bottom',
								isActive: is_h_bottom === 1,
							},
							{
								label: 'U Top',
								isActive: is_u_top === 1,
							},
							{
								label: 'Box Pin',
								isActive: is_box_pin === 1,
							},
							{
								label: 'Two Way Pin',
								isActive: is_two_way_pin === 1,
							},
						];

						return badges;
					};

					return (
						<div>
							<span>{info.getValue()}</span>

							{renderBadges().length > 0 && (
								<div className='mt-1 flex w-max max-w-[200px] flex-wrap gap-2'>
									{renderBadges()
										.filter((b) => b.isActive)
										.map((e) => (
											<div
												key={e.label}
												className='badge badge-secondary badge-sm'>
												{e.label}
											</div>
										))}
								</div>
							)}
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'item',
			// 	header: 'Item',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			// {
			// 	accessorKey: 'item_short_name',
			// 	header: 'Item Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'zipper_number',
			// 	header: 'Zipper Number',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'zipper_short_name',
			// 	header: 'Zipper Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'end_type',
			// 	header: 'End-Type',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'end_type_name',
				header: 'End-Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'end_type_short_name',
			// 	header: 'End-Type Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'puller_type',
			// 	header: 'Puller-Type',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'puller_type_name',
				header: 'Puller-Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'puller_type_short_name',
			// 	header: 'Puller-Type Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'logo_type',
			// 	header: 'Logo-Type',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'logo_type_name',
				header: 'Logo-Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'logo_type_short_name',
			// 	header: 'Logo-Type Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'slider_body_shape',
			// 	header: 'Body Shape',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'slider_body_shape_name',
				header: 'Body Shape',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'slider_body_shape_short_name',
			// 	header: 'Body Shape Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'puller_link',
			// 	header: 'Puller Link',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'puller_link_name',
				header: 'Puller Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'puller_link_short_name',
			// 	header: 'Puller Link Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			// {
			// 	accessorKey: 'stopper_type',
			// 	header: 'Stopper Type',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'stopper_type_name',
				header: 'Stopper Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'stopper_type_short_name',
			// 	header: 'Stopper Type Short Name',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },

			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'quantity_in_sa',
				header: 'Assembly Stock',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'weight',
				header: 'Weight',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(3),
			},

			{
				accessorKey: 'pcs_per_kg',
				header: 'Pcs/Kg',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(0),
			},

			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},

			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},

			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			// {
			// 	accessorKey: 'is_body',
			// 	header: 'Body?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },

			// {
			// 	accessorKey: 'is_puller',
			// 	header: 'Puller?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },

			// {
			// 	accessorKey: 'is_cap',
			// 	header: 'Cap?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'is_link',
			// 	header: 'Link?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'is_h_bottom',
			// 	header: 'H Bottom?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'is_u_top',
			// 	header: 'U Top?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'is_box_pin',
			// 	header: 'Box Pin?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },
			// {
			// 	accessorKey: 'is_two_way_pin',
			// 	header: 'Two Way Pin?',
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 		<CheckboxWithoutForm checked={info.getValue()} />
			// 	),
			// },

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
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateStock, setUpdateStock] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateStock((prev) => ({
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
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
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
						updateStock,
						setUpdateStock,
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
		</>
	);
}
