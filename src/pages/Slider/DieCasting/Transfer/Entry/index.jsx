import { useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/context/auth';
import {
	useSliderAssemblyProduction,
	useSliderColoringProduction,
	useSliderDashboardInfo,
	useSliderDieCastingStock,
	useSliderDieCastingTransferAgainstOrder,
	useSliderDieCastingTransferAgainstStock,
	useSliderDiecastingTrxLog,
} from '@/state/Slider';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { Footer } from '@/components/Modal/ui';
import ReactTable from '@/components/Table';
import TableNoData from '@/components/Table/_components/TableNoData';
import { ShowLocalToast } from '@/components/Toast';
import { DynamicField, Input } from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';
import {
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL,
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_SCHEMA,
} from '@/util/Schema';

import Header from './Header';

const getBadges = (index, getValues) => {
	const badges = [
		{
			label: 'Body',
			isActive: Number(getValues(`stocks[${index}].is_body`)) === 1,
		},
		{
			label: 'Puller',
			isActive: Number(getValues(`stocks[${index}].is_puller`)) === 1,
		},
		{
			label: 'Link',
			isActive: Number(getValues(`stocks[${index}].is_link`)) === 1,
		},
		{
			label: 'Cap',
			isActive: Number(getValues(`stocks[${index}].is_cap`)) === 1,
		},
		{
			label: 'H Bottom',
			isActive: Number(getValues(`stocks[${index}].is_h_bottom`)) === 1,
		},
		{
			label: 'U Top',
			isActive: Number(getValues(`stocks[${index}].is_u_top`)) === 1,
		},

		{
			label: 'Box Pin',
			isActive: Number(getValues(`stocks[${index}].is_box_pin`)) === 1,
		},

		{
			label: 'Two Way Pin',
			isActive:
				Number(getValues(`stocks[${index}].is_two_way_pin`)) === 1,
		},
	];

	return badges;
};

const Index = () => {
	const navigate = useNavigate();
	const r_saveBtn = useRef();
	const { user } = useAuth();
	const {
		data: stocks,
		postData,
		invalidateQuery: invalidateQueryStocks,
	} = useSliderDieCastingStock();
	const { invalidateQuery: invalidateQueryStock } =
		useSliderDieCastingTransferAgainstStock();
	const { invalidateQuery: invalidateQueryOrder } =
		useSliderDieCastingTransferAgainstOrder();
	const { invalidateQuery: invalidateQueryInfo } = useSliderDashboardInfo();
	const { invalidateQuery: invalidateColoringProdQuery } =
		useSliderColoringProduction();
	const { invalidateQuery: invalidateProdQuery } =
		useSliderAssemblyProduction();
	const { invalidateQuery: invalidateTrxLog } = useSliderDiecastingTrxLog();

	const {
		register,
		handleSubmit,
		errors,
		control,
		useFieldArray,
		getValues,
		setValue,
		Controller,
		watch,
		reset,
		context: form,
	} = useRHF(
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_SCHEMA,
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL
	);

	const { fields: stockFields } = useFieldArray({
		control,
		name: 'stocks',
	});

	const onSubmit = async (data) => {
		// * ADD data
		const created_at = GetDateTime();

		const batch_entry = [...data?.stocks]
			.filter((item) => item.assigned_quantity > 0)
			.map((item) => ({
				uuid: nanoid(),
				die_casting_uuid: item.uuid,
				quantity: item.assigned_quantity,
				weight: item.assigned_weight,
				remarks: item.remarks,
				created_by: user?.uuid,
				created_at,
			}));

		if (batch_entry.length === 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Select at least one item to proceed.',
			});
		} else {
			if (data.order_description_uuid) {
				let promises = [
					...batch_entry.map(
						async (item) =>
							await postData.mutateAsync({
								url: '/slider/die-casting-transaction',
								newData: {
									...item,
									stock_uuid: data.order_description_uuid,
									trx_quantity: item.quantity,
								},
								isOnCloseNeeded: false,
							})
					),
				];

				await Promise.all(promises)
					.then(() => {
						reset(
							Object.assign(
								{},
								SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL
							)
						);
						invalidateQueryOrder();
						invalidateQueryInfo();
						invalidateColoringProdQuery();
						invalidateProdQuery();
						navigate(`/slider/die-casting/transfer`);
					})
					.catch((err) => console.error(err));

				return;
			}
			let promises = [
				...batch_entry.map(
					async (item) =>
						await postData.mutateAsync({
							url: '/slider/trx-against-stock',
							newData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			await Promise.all(promises)
				.then(() => {
					reset(
						Object.assign(
							{},
							SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL
						)
					);
					invalidateQueryStock();
					invalidateQueryStocks();
					invalidateTrxLog();
					navigate(`/slider/die-casting/transfer`);
				})
				.catch((err) => console.error(err));

			return;
		}
		return;
	};

	useEffect(() => {
		setValue(
			'stocks',
			stocks?.filter(
				(field) =>
					watch('section') === 'coloring'
						? !allowedTypes.includes(field.type) // Include if 'coloring'
						: allowedTypes.includes(field.type) // Exclude if not 'coloring'
			)
		);
	}, [stocks, watch('section')]);

	const allowedTypes = ['body', 'cap', 'puller', 'link'];

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: true,
				cell: (info) => {
					const index = info.row.index;
					// <div className='mt-1 flex max-w-[200px] flex-wrap gap-1 gap-y-2'>
					// 	{getBadges(index, getValues)
					// 		?.filter((item) => item.isActive)
					// 		.map((badge) => (
					// 			<div
					// 				key={badge.label}
					// 				className='badge badge-secondary badge-sm'>
					// 				{badge.label}
					// 			</div>
					// 		))}
					// </div>;
					return info.getValue();
				},
			},
			{
				accessorFn: (row) => (row?.item_name ? row?.item_name : '---'),
				id: 'item_name',
				header: 'Item Name',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper No',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'type',
				header: 'Type',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row?.end_type_name ? row?.end_type_name : '---',
				id: 'end_type_name',
				header: 'End Type',
				enableColumnFilter: true,
				// cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row?.puller_type_name ? row?.puller_type_name : '---',
				id: 'puller_type_name',
				header: 'Puller',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row?.logo_type_name ? row?.logo_type_name : '---',
				id: 'logo_type_name',
				header: 'Logo',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row?.slider_body_shape_name
						? row?.slider_body_shape_name
						: '---',
				id: 'slider_body_shape_name',
				header: 'Slider Body',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row?.slider_link_name ? row?.slider_link_name : '---',
				id: 'slider_link_name',
				header: 'Slider Link',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row?.stopper_type_name ? row?.stopper_type_name : '---',
				id: 'stopper_type_name',
				header: 'Stopper Type',
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'weight',
				header: 'Weight (KG)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'assigned_quantity',
				header: 'Assigned QTY (PCS)',
				enableColumnFilter: false,
				cell: (info) => {
					const idx = info.row.index;
					const { weight, quantity } = info.row.original;

					return (
						<Input
							label={`stocks[${idx}].assigned_quantity`}
							is_title_needed='false'
							register={register}
							dynamicerror={
								errors?.[`stocks`]?.[idx]?.assigned_quantity
							}
							onChange={(e) => {
								setValue(
									`stocks[${idx}].assigned_weight`,
									(
										(Number(weight) / Number(quantity)) *
										Number(e.target.value)
									).toFixed(4)
								);
							}}
						/>
					);
				},
			},
			{
				accessorKey: 'assigned_weight',
				header: 'Assigned Weight (KG)',
				enableColumnFilter: false,
				cell: (info) => {
					const idx = info.row.index;

					return watch(`stocks[${idx}].assigned_weight`);
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => {
					const idx = info.row.index;
					return (
						<Input
							label={`stocks[${idx}].remarks`}
							is_title_needed='false'
							register={register}
						/>
					);
				},
			},
		],
		[stockFields, watch, register, errors]
	);

	return (
		<>
			<FormProvider {...form}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-6'>
					<Header
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
						}}
					/>

					<ReactTable
						title={'Entry Details'}
						accessor={false}
						data={stockFields}
						columns={columns}
						extraClass={'py-0.5'}
					/>
					<Footer buttonClassName='!btn-primary' />
					<DevTool control={control} placement='top-left' />
				</form>
			</FormProvider>
		</>
	);
};

export default Index;
