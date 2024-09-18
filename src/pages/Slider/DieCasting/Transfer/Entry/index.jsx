import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useSliderDashboardInfo,
	useSliderDieCastingStock,
	useSliderDieCastingTransferAgainstOrder,
	useSliderDieCastingTransferAgainstStock,
} from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from 'react-router-dom';
import { useRHF } from '@/hooks';

import TableNoData from '@/components/Table/_components/TableNoData';
import { ShowLocalToast } from '@/components/Toast';
import { CheckBoxWithoutLabel, DynamicField, Input } from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
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
			.filter((item) => item.is_checked)
			.map((item) => ({
				uuid: nanoid(),
				die_casting_uuid: item.uuid,
				quantity: item.assigned_quantity,
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
					navigate(`/slider/die-casting/transfer`);
				})
				.catch((err) => console.error(err));

			return;
		}
		return;
	};

	useEffect(() => {
		setValue('stocks', stocks);
	}, [stocks]);

	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return stockFields.forEach((item, index) => {
				if (isAllChecked) {
					setValue(`stocks[${index}].is_checked`, true);
				}
			});
		}
		if (!isAllChecked) {
			return stockFields.forEach((item, index) => {
				setValue('is_all_checked', false);
				setValue(`stocks[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`stocks[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('stocks')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
				setValue('is_all_checked', false);
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		setIsAllChecked(isEveryChecked);
		setIsSomeChecked(isSomeChecked);
	};

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';
	const thClass =
		'group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300';

	return (
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
			<DynamicField
				title={`Entry Details`}
				tableHead={
					<>
						<th
							key='is_all_checked'
							scope='col'
							className={cn(thClass, 'w-20')}>
							<CheckBoxWithoutLabel
								label='is_all_checked'
								checked={isAllChecked}
								onChange={(e) => {
									setIsAllChecked(e.target.checked);
									setIsSomeChecked(e.target.checked);
								}}
								{...{
									register,
									errors,
								}}
							/>
						</th>
						{[
							'Name',
							'Item Name',
							'Zipper No',
							'Type',
							'End Type',
							'Puller',
							'Logo',
							'Slider Body',
							'Puller Link',
							'Stopper Type',
							'Quantity',
							'Assigned QTY (PCS)',
							'Remarks',
						].map((item) => {
							return (
								<th key={item} scope='col' className={thClass}>
									{item}
								</th>
							);
						})}{' '}
					</>
				}>
				{stockFields.length === 0 && <TableNoData colSpan={11} />}

				{stockFields.length > 0 &&
					stockFields.map((item, index) => {
						return (
							<tr key={item.id}>
								<td className={cn(`w-8 ${rowClass}`)}>
									<CheckBoxWithoutLabel
										label={`stocks[${index}].is_checked`}
										checked={watch(
											`stocks[${index}].is_checked`
										)}
										onChange={(e) =>
											handleRowChecked(e, index)
										}
										{...{
											register,
											errors,
										}}
									/>
								</td>

								{/*  Name */}
								<td className={cn('w-[150px]', rowClass)}>
									<span>{item.name}</span>

									<div className='mt-1 flex max-w-[200px] flex-wrap gap-1 gap-y-2'>
										{getBadges(index, getValues)
											?.filter((item) => item.isActive)
											.map((badge) => (
												<div
													key={badge.label}
													className='badge badge-secondary badge-sm'>
													{badge.label}
												</div>
											))}
									</div>
								</td>

								{/* Item Name */}
								<td className={cn('w-24', rowClass)}>
									{item.item_name}
								</td>

								{/* Zipper Name */}
								<td className={cn('w-24', rowClass)}>
									{item.zipper_number_name}
								</td>

								{/* Tyoe Name */}
								<td className={cn('w-24', rowClass)}>
									{item.type
										.split('_') // Split the string by underscores
										.map(
											(word) =>
												word.charAt(0).toUpperCase() +
												word.slice(1)
										) // Capitalize the first letter of each word
										.join(' ')}
								</td>

								{/* End Type */}
								<td className={cn('w-24', rowClass)}>
									{item.end_type_name}
								</td>

								{/* Puller Type */}
								<td className={cn('w-24', rowClass)}>
									{item.puller_type_name}
								</td>

								{/* Logo */}
								<td className={cn('w-24', rowClass)}>
									{item.logo_type_name}
								</td>

								{/* Slider Body Shape Name */}
								<td className={cn('w-24', rowClass)}>
									{item.slider_body_shape_name}
								</td>

								{/* Puller Link Name */}
								<td className={cn('w-24', rowClass)}>
									{item.puller_link_name}
								</td>

								{/* Stopper Type */}
								<td className={cn('w-24', rowClass)}>
									{item.stopper_type_name}
								</td>
								{/* Quantity */}
								<td className={cn('w-24', rowClass)}>
									{Number(item.quantity)}
								</td>

								{/* PROVIDED QTY */}
								<td className={cn('w-24', rowClass)}>
									<Input
										label={`stocks[${index}].assigned_quantity`}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.[`stocks`]?.[index]
												?.assigned_quantity
										}
									/>
								</td>
								{/* remarks */}
								<td className={cn('w-24', rowClass)}>
									<Input
										label={`stocks[${index}].remarks`}
										is_title_needed='false'
										register={register}
									/>
								</td>
							</tr>
						);
					})}
			</DynamicField>
			<div className='modal-action'>
				<button
					type='submit'
					className='text-md btn btn-primary btn-block'
					ref={r_saveBtn}
					// onKeyDown={keyDown}
				>
					Save
				</button>
			</div>
			<DevTool control={control} placement='top-left' />
		</form>
	);
};

export default Index;
