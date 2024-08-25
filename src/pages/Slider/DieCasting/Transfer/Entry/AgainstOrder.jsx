import { NoDataFound } from '@/components/Table/ui';
import { useRHF } from '@/hooks';
import cn from '@/lib/cn';
import { CheckBoxWithoutLabel, DynamicField, FormField, Input } from '@/ui';
import {
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_NULL,
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_SCHEMA,
} from '@/util/Schema';
import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import { useOtherOrder } from '@/state/Other';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { DevTool } from '@hookform/devtools';
import { useSliderDieCastingStockByOrderNumbers } from '@/state/Slider';

const AgainstOrder = () => {
	const r_saveBtn = useRef();
	const { data: orders } = useOtherOrder();
	const {
		register,
		handleSubmit,
		errors,
		control,
		useFieldArray,
		getValues,
		setValue,
		watch,
	} = useRHF(
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_SCHEMA,
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_ORDER_NULL
	);

	const { fields: stockFields } = useFieldArray({
		control,
		name: 'stocks',
	});

	const { data: stocks } = useSliderDieCastingStockByOrderNumbers(
		watch('order_info_uuids'),
		{
			enabled: !!watch('order_info_uuids')?.length,
		}
	);

	useEffect(() => {
		setValue('stocks', stocks?.stocks);
	}, [stocks]);

	const onSubmit = async (data) => {
		console.log({
			data,
		});
	};

	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return stockFields.forEach((item, index) => {
				setValue(`stocks[${index}].is_checked`, true);
			});
		}
		if (!isAllChecked) {
			return stockFields.forEach((item, index) => {
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
			<Header errors={errors} register={register} />
			<FormField
				label='order_info_uuids'
				title='Order Numbers'
				errors={errors}>
				<Controller
					name='order_info_uuids'
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								isMulti
								placeholder='Select Order Numbers'
								options={orders}
								value={orders?.filter((inItem) =>
									getValues(`order_info_uuids`)?.includes(
										inItem.value
									)
								)}
								onChange={(e) => {
									onChange(e.map((inItem) => inItem.value));
								}}
							/>
						);
					}}
				/>
			</FormField>

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
							'Order No',
							'Item Name',
							'Zipper No',
							'End Type',
							'Puller',
							'Logo',
							'Slider Body',
							'Puller Link',
							'Stopper Type',
							'Assigned QTY',
						].map((item) => {
							return (
								<th key={item} scope='col' className={thClass}>
									{item}
								</th>
							);
						})}{' '}
					</>
				}>
				{stockFields.length === 0 && <NoDataFound colSpan={11} />}

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

								{/* Order No */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].order_number`)}
								</td>

								{/* Item Name */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].item_name`)}
								</td>

								{/* Zipper Name */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].zipper_number_name  `
									)}
								</td>

								{/* End Type */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].end_type_name`
									)}
								</td>

								{/* Puller Type */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].puller_type_name`
									)}
								</td>

								{/* Logo */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].logo_type_name`
									)}
								</td>

								{/* Slider Body Shape Name */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].slider_body_shape_name`
									)}
								</td>

								{/* Puller Link Name */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].puller_link_name`
									)}
								</td>

								{/* Stopper Type */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].stopper_type_name`
									)}
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

			<DevTool control={control} />
		</form>
	);
};

export default AgainstOrder;
