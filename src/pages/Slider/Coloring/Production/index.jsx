import { lazy, useMemo, useState } from 'react';
import { useSliderColoringProduction } from '@/state/Slider';
import Pdf from '@components/Pdf/SliderColoringProduction';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, LinkWithCopy, StatusButton, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const { data, isLoading } = useSliderColoringProduction();
	const info = new PageInfo(
		'Slider Coloring Production',
		'/slider/slider-coloring/production',
		'slider__coloring_production'
	);

	const haveAccess = useAccess('slider__coloring_production');
	const headers = [
		'order_number',
		'item_description',
		'puller_color_name',
		'coloring_prod',
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

	// * columns
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
						showCopyButton={false}
						openInNewTab={true}
					/>
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
						showCopyButton={false}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Dsc',
				enableColumnFilter: true,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/order/details/${info.row.original.order_number}/${info.row.original.order_description_uuid}`}
						showCopyButton={false}
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
				header: 'Zipper No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_waterproof',
				header: 'Waterproof',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
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
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_body_shape_name',
				header: 'Body Shape',
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
				accessorKey: 'coloring_type_name',
				header: 'Coloring',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					let logo = row.logo_type_name;

					if (row.logo_is_body === 1 && row.logo_is_puller === 1) {
						logo += ' (Body, Puller)';
					} else if (row.logo_is_body === 1) {
						logo += ' (Body)';
					} else if (row.logo_is_puller === 1) {
						logo += ' (Puller)';
					}

					return logo;
				},
				id: 'logo_type_name',
				header: 'Logo',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'stopper_type_name',
				header: 'Stopper',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'batch_quantity',
				header: (
					<span>
						Batch
						<br />
						QTY (PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: (
					<span>
						Balance
						<br />
						QTY (PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_stock',
				header: (
					<span>
						Stock
						<br />
						QTY (PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_stock_weight',
				header: (
					<span>
						Stock Weight
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'u_top_quantity',
				header: 'U Top',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'h_bottom_quantity',
				header: 'H Bottom',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'box_pin_quantity',
				header: 'Box Pin',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_add_production',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-8',
				cell: (info) => {
					const {
						u_top_quantity,
						h_bottom_quantity,
						box_pin_quantity,
						coloring_stock,
						end_type_name,
						order_type,
					} = info.row.original;
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
							// disabled={
							// 	(order_type === 'slider'
							// 		? coloring_stock
							// 		: Math.floor(
							// 				Math.min(
							// 					Number(u_top_quantity) / 2,
							// 					coloring_stock,
							// 					end_type_name === 'Close End'
							// 						? h_bottom_quantity
							// 						: box_pin_quantity
							// 				)
							// 			)) <= 0
							// 		? true
							// 		: false
							// }
							disabled={coloring_stock <= 0 ? true : false}
						/>
					);
				},
			},
			{
				accessorKey: 'coloring_prod',
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
				accessorKey: 'coloring_prod_weight',
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
				accessorKey: 'action_add_transaction',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_transaction'),
				width: 'w-8',
				cell: (info) => {
					const { coloring_prod, coloring_prod_weight } =
						info.row.original;
					return (
						<Transfer
							onClick={() => handelTransaction(info.row.index)}
							disabled={
								coloring_prod <= 0 || coloring_prod_weight <= 0
									? true
									: false
							}
						/>
					);
				},
			},
			{
				accessorKey: 'total_trx_quantity',
				header: (
					<span>
						Total Transaction
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'trx_weight',
				header: (
					<span>
						Total Trx Weight
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

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

	const handelProduction = (idx) => {
		const val = data[idx];

		setUpdateSliderProd((prev) => ({
			...prev,
			...val,
		}));

		window['TeethMoldingProdModal'].showModal();
	};

	const [updateSliderTrx, setUpdateSliderTrx] = useState({
		uuid: null,
		stock_uuid: null,
		slider_item_uuid: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		remarks: '',
	});
	const handelTransaction = (idx) => {
		const val = data[idx];

		setUpdateSliderTrx((prev) => ({
			...prev,
			...val,
		}));

		window['TeethMoldingTrxModal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<Production
					modalId='TeethMoldingProdModal'
					{...{
						updateSliderProd,
						setUpdateSliderProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='TeethMoldingTrxModal'
					{...{
						updateSliderTrx,
						setUpdateSliderTrx,
					}}
				/>
			</Suspense>
		</div>
	);
}
