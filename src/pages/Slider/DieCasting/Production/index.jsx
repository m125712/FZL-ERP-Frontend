import { lazy, useEffect, useMemo, useState } from 'react';
import { useSliderDieCastingProduction } from '@/state/Slider';
import Pdf from '@components/Pdf/SliderDieCastingProduction';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import {
	CustomLink,
	DateTime,
	EditDelete,
	LinkWithCopy,
	SimpleDatePicker,
} from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [pdfData, setPdfData] = useState('');
	const { data, isLoading, url, deleteData } = useSliderDieCastingProduction(
		`from_date=${format(from, 'yyyy-MM-dd')}&to_date=${format(to, 'yyyy-MM-dd')}`
	);
	const navigate = useNavigate();
	const info = new PageInfo(
		'Production 1',
		url,
		'slider__making_production_1'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const haveAccess = useAccess('slider__making_production_1');
	const headers = [
		'mc_no',
		'die_casting_name',
		'cavity_goods',
		'cavity_defect',
		'push',
		'order_number',
		'item_description',
		'production_quantity',
		'weight',
		'remarks',
	];

	useEffect(() => {
		if (data) {
			Pdf(data)?.getDataUrl((dataUrl) => {
				setPdfData(dataUrl);
			});
		}
	}, [data]);

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
				width: 'w-40',
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
				width: 'w-40',
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'mc_no',
				header: 'M/C',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'die_casting_name',
				header: 'Item',
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_color_name',
				header: 'Teeth Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'cavity_goods',
				header: (
					<>
						Cavity
						<br />
						Goods
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'cavity_defect',
				header: (
					<>
						Cavity
						<br />
						Defect
					</>
				),
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
						Prod QTY
						<br />
						(PCS)
					</>
				),
				enableColumnFilter: false,
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
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden: !(
					haveAccess.includes('update') ||
					haveAccess.includes('delete')
				),
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={() => handelDelete(info.row.id)}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Add
	const handelAdd = () => navigate('/slider/making/production_1/entry');

	// Update
	const [update, setUpdate] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdate((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
		}));

		window[info.getAddOrUpdateModalId()].showModal();
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
		<>
			<div className='flex flex-col gap-8'>
				<ReactTable
					title={info.getTitle()}
					accessor={haveAccess.includes('create')}
					data={data}
					columns={columns}
					handelAdd={handelAdd}
					extraClass={'py-0.5'}
					showDateRange={false}
					// showPdf={true}
					// pdfData={pdfData}
					extraButton={
						<div className='flex items-center gap-2'>
							<SimpleDatePicker
								className='m-w-32 h-[2.34rem]'
								key={'from'}
								value={from}
								placeholder='From'
								selected={from}
								onChangeForTime={(data) => {
									setFrom(data);
								}}
							/>
							<SimpleDatePicker
								className='m-w-32 h-[2.34rem]'
								key={'to'}
								value={to}
								placeholder='To'
								selected={to}
								onChangeForTime={(data) => {
									setTo(data);
								}}
							/>
						</div>
					}
				/>
				<iframe
					src={pdfData}
					className='h-[40rem] w-full rounded-md border-none'
				/>
			</div>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						update,
						setUpdate,
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
