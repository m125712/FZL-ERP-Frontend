import { useAccess, useRHF } from '@/hooks';
import PageContainer from '@/ui/Others/PageContainer';
import { useParams } from 'react-router-dom';

import { DeleteModal } from '@/components/Modal';
import { NoDataFound } from '@/components/Table/ui';
import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { useOtherOrder } from '@/state/Other';
import {
	CheckBox,
	CheckBoxWithoutLabel,
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	RemoveButton,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	SLIDER_DIE_CASTING_TRANSFER_NULL,
	SLIDER_DIE_CASTING_TRANSFER_SCHEMA,
	SLIDER_DIE_CASTING_TRANSFER_TEST,
} from '@util/Schema';
import { useEffect, useRef, useState } from 'react';

const Index = () => {
	useAccess('slider__die_casting_transfer_entry');
	const { uuid } = useParams();
	const isUpdate = uuid !== undefined;
	const r_saveBtn = useRef();

	const { data: orders } = useOtherOrder();

	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		setValue,
		watch,
	} = useRHF(
		SLIDER_DIE_CASTING_TRANSFER_SCHEMA,
		SLIDER_DIE_CASTING_TRANSFER_TEST
	);

	const { fields, remove } = useFieldArray({
		control,
		name: 'stocks',
	});

	const onSubmit = async (data) => {};

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return fields.forEach((item, index) => {
				setValue(`stocks[${index}].is_checked`, true);
			});
		}
		if (!isAllChecked) {
			return fields.forEach((item, index) => {
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
	const tdClass = 'px-1 pt-1 pb-2';
	const cbClass =
		'h-fit w-fit rounded border border-primary/30 bg-primary/5 px-2';

	const breadcrumbs = [
		{
			label: 'Slider',
			isDisabled: true,
		},
		{
			label: 'Die Casting',
			isDisabled: true,
		},
		{
			label: 'Transfer',
			href: '/slider/die-casting/transfer',
		},
		{
			label: isUpdate ? 'Update' : 'Create',
			href: isUpdate
				? `/slider/die-casting/transfer/update/${uuid}`
				: '/slider/die-casting/transfer/entry',
		},
	];

	return (
		<PageContainer
			title={isUpdate ? 'Update Transfer' : 'Create Transfer'}
			breadcrumbs={breadcrumbs}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'>
				<div className='flex items-end gap-4'>
					<FormField
						title='Order No'
						className={'max-w-[200px] flex-1'}
						label={`order_info_uuid`}
						register={register}
						dynamicerror={errors?.order_info_uuid}>
						<Controller
							name={`order_info_uuid`}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Order'
										options={orders}
										value={orders?.find(
											(inItem) =>
												inItem.value ==
												getValues(`order_info_uuid`)
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
										menuPortalTarget={document.body}
									/>
								);
							}}
						/>
					</FormField>
					<CheckBox
						label='is_body'
						title='Body'
						height='h-[2.9rem] '
						className={cbClass}
						{...{ register, errors }}
					/>
					<CheckBox
						label='is_cap'
						title='Cap'
						height='h-[2.9rem] '
						className={cbClass}
						{...{ register, errors }}
					/>
					<CheckBox
						label='is_puller'
						title='Puller'
						height='h-[2.9rem] '
						className={cbClass}
						{...{ register, errors }}
					/>
					<CheckBox
						label='is_link'
						title='Link'
						height='h-[2.9rem] '
						className={cbClass}
						{...{ register, errors }}
					/>
				</div>

				<DynamicField
					title={uuid == null ? `Entry Details` : 'Update Details'}
					tableHead={
						<>
							{!isUpdate && (
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
										{...{ register, errors }}
									/>
								</th>
							)}
							{[
								'Order No',
								'Item Name',
								'Zipper No',
								'End Type',
								'Puller',
								'Logo',
								'Color',
								'Order QTY',
								'Balance QTY',
								'Provided QTY',
							].map((item) => (
								<th key={item} scope='col' className={thClass}>
									{item}
								</th>
							))}{' '}
						</>
					}>
					{isUpdate && fields.length === 0 && (
						<NoDataFound colSpan={9} />
					)}

					{fields.length > 0 &&
						fields.map((item, index) => (
							<tr key={item.id}>
								{!isUpdate && (
									<td className={cn(`w-8 ${rowClass}`)}>
										<CheckBoxWithoutLabel
											label={`stocks[${index}].is_checked`}
											checked={watch(
												`stocks[${index}].is_checked`
											)}
											onChange={(e) =>
												handleRowChecked(e, index)
											}
											{...{ register, errors }}
										/>
									</td>
								)}

								{/* Order No */}
								<td className={cn('w-48', rowClass)}>
									{getValues(`stocks[${index}].order_number`)}
								</td>

								{/* Item Name */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].item_name`)}
								</td>

								{/* Zipper Number */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].zipper_number`
									)}
								</td>

								{/* End Type */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].end_type`)}
								</td>

								{/* Puller Type */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].puller_type`)}
								</td>

								{/* Logo */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].logo`)}
								</td>

								{/* Color */}
								<td className={cn('w-24', rowClass)}>
									{getValues(`stocks[${index}].color`)}
								</td>

								{/* Order QTY  */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].order_quantity`
									)}
								</td>

								{/* BALANCE QTY */}
								<td className={cn('w-24', rowClass)}>
									{getValues(
										`stocks[${index}].balance_quantity`
									)}
								</td>

								{/* PROVIDED QTY */}
								<td className={cn('w-24', rowClass)}>
									<Input
										label={`stocks[${index}].provided_quantity`}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.stocks?.[index]
												?.provided_quantity
										}
									/>
								</td>

								{/* <td>
									<RemoveButton
										onClick={() => remove(index)}
										showButton={fields.length > 1}
									/>
								</td> */}
							</tr>
						))}
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
		</PageContainer>
	);
};

export default Index;
