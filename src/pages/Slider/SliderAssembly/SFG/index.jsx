import { lazy, useEffect, useMemo, useState } from 'react';
import { useAccess, useFetchFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { LinkWithCopy, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const Production = lazy(() => import('./Production'));
const Transaction = lazy(() => import('./Transaction'));

export default function Index() {
	const info = new PageInfo(
		'Assembly SFG Stock',
		'sfg/by/slider_assembly_prod',
		'slider__assembly_sfg'
	);
	const [sliderAssemblyProd, setSliderAssemblyProd] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const haveAccess = useAccess('slider__assembly_sfg');

	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setSliderAssemblyProd,
			setLoading,
			setError
		);
	}, []);

	// o/n	style	color	size	pcs	  production	production_modal_button	trx	trx_modal_button

	const columns = useMemo(
		() => [
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
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_description',
				header: 'Style / Color / Size',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'slider_assembly_stock',
				header: (
					<span>
						Stock
						<br />
						(PCS)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_production'),
				width: 'w-24',
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelProduction(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: 'slider_assembly_prod',
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
				accessorKey: 'actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_to_coloring'),
				width: 'w-24',
				cell: (info) => {
					return (
						<Transfer
							onClick={() => handelTransaction(info.row.index)}
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
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[sliderAssemblyProd]
	);

	const [updateSliderAssemblyProd, setUpdateSliderAssemblyProd] = useState({
		id: null,
		slider_assembly_stock: null,
		slider_assembly_prod: null,
		order_entry_id: null,
		total_trx_quantity: null,
		end_type_name: '',
		quantity: null,
		order_number: null,
		item_description: '',
		order_description: '',
	});

	const handelProduction = (idx) => {
		setUpdateSliderAssemblyProd((prev) => ({
			...prev,
			id: sliderAssemblyProd[idx].id,
			name: sliderAssemblyProd[idx].item_description,
			slider_assembly_stock:
				sliderAssemblyProd[idx].slider_assembly_stock,
			slider_assembly_prod: sliderAssemblyProd[idx].slider_assembly_prod,
			order_entry_id: sliderAssemblyProd[idx].order_entry_id,
			total_trx_quantity: sliderAssemblyProd[idx].total_trx_quantity,
			end_type_name: sliderAssemblyProd[idx].end_type_name,
			quantity: sliderAssemblyProd[idx].quantity,
			order_number: sliderAssemblyProd[idx].order_number,
			item_description: sliderAssemblyProd[idx].item_description,
			order_description: sliderAssemblyProd[idx].order_description,
		}));
		window['SliderAssemblyProdModal'].showModal();
	};

	const handelTransaction = (idx) => {
		setUpdateSliderAssemblyProd((prev) => ({
			...prev,
			id: sliderAssemblyProd[idx].id,
			name: sliderAssemblyProd[idx].item_description,
			slider_assembly_stock:
				sliderAssemblyProd[idx].slider_assembly_stock,
			slider_assembly_prod: sliderAssemblyProd[idx].slider_assembly_prod,
			order_entry_id: sliderAssemblyProd[idx].order_entry_id,
			total_trx_quantity: sliderAssemblyProd[idx].total_trx_quantity,
			end_type_name: sliderAssemblyProd[idx].end_type_name,
			quantity: sliderAssemblyProd[idx].quantity,
			order_number: sliderAssemblyProd[idx].order_number,
			item_description: sliderAssemblyProd[idx].item_description,
			order_description: sliderAssemblyProd[idx].order_description,
		}));
		window['SliderAssemblyTrxModal'].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				data={sliderAssemblyProd}
				columns={columns}
			/>
			<Suspense>
				<Production
					modalId='SliderAssemblyProdModal'
					{...{
						setSliderAssemblyProd,
						updateSliderAssemblyProd,
						setUpdateSliderAssemblyProd,
					}}
				/>
			</Suspense>
			<Suspense>
				<Transaction
					modalId='SliderAssemblyTrxModal'
					{...{
						setSliderAssemblyProd,
						updateSliderAssemblyProd,
						setUpdateSliderAssemblyProd,
					}}
				/>
			</Suspense>
		</div>
	);
}
