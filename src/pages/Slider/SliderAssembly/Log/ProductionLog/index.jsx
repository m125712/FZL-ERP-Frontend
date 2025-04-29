import { useMemo, useState } from 'react';
import {
	useSliderAssemblyLogJoinedProduction,
	useSliderAssemblyProduction,
} from '@/state/Slider';
import Pdf from '@components/Pdf/SliderAssemblyProduction';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddOrUpdateProd from './AddOrUpdateProd';
import AddOrUpdateStockProd from './AddOrUpdateStockProd';

export default function Index() {
	const { data, isLoading, deleteData } =
		useSliderAssemblyLogJoinedProduction();
	const { invalidateQuery } = useSliderAssemblyProduction();
	const info = new PageInfo(
		'Production Log 2',
		'/slider/making/log_2/production'
	);
	const headers = [
		'order_number',
		'item_name',
		'item_description',
		'production_quantity',
		'weight',
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

	const haveAccess = useAccess('slider__making_log_2');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'Batch No.',
				enableColumnFilter: false,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/planning/finishing-batch/${info.row.original.finishing_batch_uuid}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
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
				header: 'Item Dsc',
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						openInNewTab={true}
					/>
				),
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
				accessorKey: 'teeth_color_name',
				header: 'Teeth Color',
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
				accessorKey: 'slider_body_shape_name',
				header: 'Body',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'puller_type_name',
				header: 'Puller',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_link_name',
				header: 'Link',
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
				accessorKey: 'coloring_type_name',
				header: 'Coloring Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'logo',
				header: 'Logo Type',
				enableColumnFilter: false,
				cell: (info) => {
					const { logo_type_name, logo_is_body, logo_is_puller } =
						info.row.original;

					return logo_type_name
						? `${logo_type_name} ${logo_is_body ? '(Body)' : ''} ${logo_is_puller ? '(Puller)' : ''}`
						: '';
				},
			},
			{
				accessorKey: 'order_quantity',
				header: (
					<span>
						Ordered
						<br />
						QTY (PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'swatch_approved_quantity',
				header: 'Approved QTY',
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
				header: 'Created by',
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
				hidden: !(
					haveAccess.includes('update') ||
					haveAccess.includes('delete')
				),
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

	// Update
	const [updateSliderProd, setUpdateSliderProd] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateSliderProd((prev) => ({
			...prev,
			...selected,
		}));

		if (data[idx]?.order_number === 'Assembly Stock') {
			window['StockProduction'].showModal();
		} else {
			window[info.getAddOrUpdateModalId()].showModal();
		}
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

		if (data[idx]?.order_number === 'Assembly Stock') {
			window['StockProductionDelete'].showModal();
		} else {
			window[info.getDeleteModalId()].showModal();
		}
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
				<AddOrUpdateProd
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateSliderProd,
						setUpdateSliderProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<AddOrUpdateStockProd
					modalId='StockProduction'
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
			<Suspense>
				<DeleteModal
					modalId={'StockProductionDelete'}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					deleteData={deleteData}
					url={`/slider/die-casting-to-assembly-stock`}
					invalidateQuery={invalidateQuery}
				/>
			</Suspense>
		</div>
	);
}
