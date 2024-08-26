import { NoDataFound } from '@/components/Table/ui';
import { useRHF } from '@/hooks';
import cn from '@/lib/cn';
import { useSliderDieCastingStock } from '@/state/Slider';
import { CheckBoxWithoutLabel, DynamicField, Input } from '@/ui';
import {
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL,
	SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_SCHEMA,
} from '@/util/Schema';
import { useEffect, useRef, useState } from 'react';
import Header from './Header';

const AgainstStock = () => {
	const r_saveBtn = useRef();
	const { data: stocks } = useSliderDieCastingStock();
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
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_SCHEMA,
		SLIDER_DIE_CASTING_TRANSFER_AGAINST_STOCK_NULL
	);

	const { fields: stockFields } = useFieldArray({
		control,
		name: 'stocks',
	});

	const onSubmit = async (data) => {
		console.log({
			data,
		});
	};

	useEffect(() => {
		setValue('stocks', stocks);
	}, [stocks]);

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
						const badges = [
							{
								label: 'Body',
								isActive:
									Number(
										getValues(`stocks[${index}].is_body`)
									) === 1,
							},
							{
								label: 'Puller',
								isActive:
									Number(
										getValues(`stocks[${index}].is_puller`)
									) === 1,
							},
							{
								label: 'Link',
								isActive:
									Number(
										getValues(`stocks[${index}].is_link`)
									) === 1,
							},
							{
								label: 'Cap',
								isActive:
									Number(
										getValues(`stocks[${index}].is_cap`)
									) === 1,
							},
							{
								label: 'H Bottom',
								isActive:
									Number(
										getValues(
											`stocks[${index}].is_h_bottom`
										)
									) === 1,
							},
							{
								label: 'U Top',
								isActive:
									Number(
										getValues(`stocks[${index}].is_u_top`)
									) === 1,
							},

							{
								label: 'Box Pin',
								isActive:
									Number(
										getValues(`stocks[${index}].is_box_pin`)
									) === 1,
							},

							{
								label: 'Two Way Pin',
								isActive:
									Number(
										getValues(
											`stocks[${index}].is_two_way_pin`
										)
									) === 1,
							},
						];

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
								<td className={cn('w-[200px]', rowClass)}>
									<span>
										{getValues(`stocks[${index}].name`)}
									</span>

									<div className='mt-1 flex max-w-[200px] flex-wrap gap-1 gap-y-2'>
										{badges.map((badge) => {
											return (
												<div
													key={badge.label}
													className='badge badge-secondary badge-sm'>
													{badge.label}
												</div>
											);
										})}
									</div>
								</td>

								{/* Item Name */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].item_name`)}
								</td>

								{/* Zipper Name */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].zipper_number_name`
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
		</form>
	);
};

export default AgainstStock;
