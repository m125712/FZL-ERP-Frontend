import { useMemo, useState } from 'react';
import {
	useSliderColoringLogProduction,
	useSliderColoringProduction,
} from '@/state/Slider';
import Pdf from '@components/Pdf/SliderColoringProduction';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, isLoading, deleteData } = useSliderColoringLogProduction();
	const { invalidateQuery } = useSliderColoringProduction();

	const info = new PageInfo(
		'Production Log',
		'/slider/slider-coloring/log/production'
	);

	const haveAccess = useAccess('slider__coloring_log');
	const headers = [
		'order_number',
		'item_description',
		'puller_color_name',
		'production_quantity',
		'remarks',
	];
	const extraData = useMemo(() => {
		return data?.map((item) => {
			const extra = {
				party_name: item.party_name,
			};
			return extra;
		});
	}, [data]);
	const pdfData = useMemo(() => {
		return {
			filterTableHeader: headers,
			pdf: Pdf,
			extraData: extraData,
		};
	}, [extraData, Pdf]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Barch No.',
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
			,
			{
				accessorKey: 'item_description',
				header: 'Item Dsc',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'end_type_name',
				header: 'End Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lock_type_name',
				header: 'Lock Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_type_name',
				header: 'Puller Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_color_name',
				header: 'Puller Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_name',
				header: 'Slider',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_body_shape_name',
				header: 'Slider Body Shape',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_link_name',
				header: 'Slider Link',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_type_name',
				header: 'Coloring Type',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'logo_type_name',
				header: 'Logo Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'logo_is_body',
				header: 'Logo Body',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'logo_is_puller',
				header: 'Logo Puller',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_quantity',
				header: (
					<span>
						batch
						<br />
						QTY (PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_quantity',
				header: (
					<span>
						Production
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'weight',
				header: (
					<span>
						Weight
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
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
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

	// Update
	const [updateSliderProd, setUpdateSliderProd] = useState({
		uuid: null,
		stock_uuid: null,
		coloring_stock: null,
		coloring_prod: null,
		production_quantity: null,
		section: null,
		wastage: null,
		remarks: '',
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateSliderProd((prev) => ({
			...prev,
			...selected,
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
			itemName: data[idx].order_number,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				showPdf={true}
				pdfData={pdfData}
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateSliderProd,
						setUpdateSliderProd,
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
					url={`/slider/production`}
					invalidateQuery={invalidateQuery}
				/>
			</Suspense>
		</div>
	);
}
