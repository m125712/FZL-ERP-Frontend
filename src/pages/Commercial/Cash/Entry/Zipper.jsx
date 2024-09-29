import React, { useEffect, useState } from 'react';
import { useOtherOrderNumberForZipperByMarketingAndPartyUUID } from '@/state/Other';
import { Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import {
	CheckBoxWithoutLabel,
	DynamicDeliveryField,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
} from '@/ui';

import cn from '@/lib/cn';

const Zipper = ({
	watch,
	getValues,
	control,
	errors,
	isUpdate,
	setValue,
	register,
	orderEntryField,
	newOrderEntryField,
}) => {
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);

	const [isAllNewChecked, setIsAllNewChecked] = useState(false);
	const [isSomeNewChecked, setIsSomeNewChecked] = useState(false);

	const { pi_uuid } = useParams();

	const { data: order_number_for_zippers } =
		useOtherOrderNumberForZipperByMarketingAndPartyUUID(
			watch('marketing_uuid'),
			watch('party_uuid'),
			pi_uuid ? `is_cash=true&pi_uuid=${pi_uuid}` : 'is_cash=true'
		);

	const { data: new_order_number_for_zippers } =
		useOtherOrderNumberForZipperByMarketingAndPartyUUID(
			watch('marketing_uuid'),
			watch('party_uuid'),
			'is_cash=true'
		);

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return orderEntryField.forEach((item, index) => {
				if (isAllChecked) {
					setValue(`pi_cash_entry[${index}].is_checked`, true);
				}
			});
		}
		if (!isAllChecked) {
			return orderEntryField.forEach((item, index) => {
				setValue('is_all_checked', false);
				setValue(`pi_cash_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	useEffect(() => {
		if (isAllNewChecked || isSomeNewChecked) {
			return newOrderEntryField.forEach((item, index) => {
				if (isAllNewChecked) {
					setValue(`new_pi_cash_entry[${index}].is_checked`, true);
				}
			});
		}
		if (!isAllNewChecked) {
			return newOrderEntryField.forEach((item, index) => {
				setValue('is_all_new_checked', false);
				setValue(`new_pi_cash_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllNewChecked]);

	const handleRowChecked = (e, index, isNew = false) => {
		const isChecked = e.target.checked;
		setValue(
			isNew
				? `new_pi_cash_entry[${index}].is_checked`
				: `pi_cash_entry[${index}].is_checked`,
			isChecked
		);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of isNew
			? watch('new_pi_cash_entry')
			: watch('pi_cash_entry')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
				setValue(
					isNew ? 'is_all_new_checked' : 'is_all_checked',
					false
				);
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		isNew
			? setIsAllNewChecked(isEveryChecked)
			: setIsAllChecked(isEveryChecked);
		isNew
			? setIsSomeNewChecked(isSomeChecked)
			: setIsSomeChecked(isSomeChecked);
	};

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<SectionEntryBody title='Zipper Details'>
			<div className='grid grid-cols-2 gap-4'>
				<FormField
					label='order_info_uuids'
					title='Order Numbers (Zipper)'
					errors={errors}>
					<Controller
						name='order_info_uuids'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									isDisabled={pi_uuid}
									isMulti
									placeholder='Select Order Numbers'
									options={order_number_for_zippers}
									value={order_number_for_zippers?.filter(
										(item) => {
											const order_info_uuids =
												getValues('order_info_uuids');

											return order_info_uuids?.includes(
												item.value
											);
										}
									)}
									onChange={(e) => {
										onChange(e.map(({ value }) => value));
									}}
								/>
							);
						}}
					/>
				</FormField>

				{pi_uuid && (
					<FormField
						label='new_order_info_uuids'
						title='New Order Numbers (Zipper)'
						errors={errors}>
						<Controller
							name='new_order_info_uuids'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										isMulti
										placeholder='Select Order Numbers'
										// options={new_order_number_for_zippers?.filter(
										// 	(item) =>
										// 		!watch(
										// 			'order_info_uuids'
										// 		)?.includes(item.value)
										// )}
										options={new_order_number_for_zippers}
										value={new_order_number_for_zippers?.filter(
											(item) => {
												const order_info_uuids =
													getValues(
														'new_order_info_uuids'
													);

												return order_info_uuids?.includes(
													item.value
												);
											}
										)}
										onChange={(e) => {
											onChange(
												e.map(({ value }) => value)
											);
										}}
									/>
								);
							}}
						/>
					</FormField>
				)}
			</div>

			<DynamicDeliveryField
				title={`Entries`}
				tableHead={
					<>
						{!isUpdate && (
							<th
								key='is_all_checked'
								scope='col'
								className='group w-20 cursor-pointer px-3 py-2'>
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
							'O/N',
							'Item Description',
							'Style',
							'Color',
							'Size (CM)',
							'QTY (PCS)',
							'Given',
							'PI QTY',
							'Balance QTY',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer px-3 py-2 transition duration-300'>
								{item}
							</th>
						))}

						{isUpdate && (
							<th
								key='action'
								scope='col'
								className='group cursor-pointer px-3 py-2 transition duration-300'>
								Delete
							</th>
						)}
					</>
				}>
				{orderEntryField.map((item, index) => (
					<tr
						key={item.id}
						className={cn(
							'relative cursor-pointer bg-base-100 text-primary transition-colors duration-200 ease-in',
							isUpdate &&
								watch(`pi_cash_entry[${index}].isDeletable`) &&
								'bg-error/10 text-error hover:bg-error/20 hover:text-error'
						)}>
						{!isUpdate && (
							<td className={cn(`w-8 ${rowClass}`)}>
								<CheckBoxWithoutLabel
									label={`pi_cash_entry[${index}].is_checked`}
									checked={watch(
										`pi_cash_entry[${index}].is_checked`
									)}
									onChange={(e) => handleRowChecked(e, index)}
									disabled={
										getValues(
											`pi_cash_entry[${index}].quantity`
										) == 0
									}
									{...{ register, errors }}
								/>
							</td>
						)}

						<td className={`w-32 ${rowClass}`}>
							{getValues(`pi_cash_entry[${index}].order_number`)}
						</td>
						<td className={`w-32 ${rowClass}`}>
							{getValues(
								`pi_cash_entry[${index}].item_description`
							)}
						</td>
						<td className={`w-32 ${rowClass}`}>
							{getValues(`pi_cash_entry[${index}].style`)}
						</td>
						<td className={`w-32 ${rowClass}`}>
							{getValues(`pi_cash_entry[${index}].color`)}
						</td>
						<td className={`${rowClass}`}>
							{getValues(`pi_cash_entry[${index}].size`)}
						</td>
						<td className={`${rowClass}`}>
							{Number(
								getValues(`pi_cash_entry[${index}].quantity`)
							).toFixed(0)}
						</td>
						<td className={`${rowClass}`}>
							{Number(
								getValues(
									`pi_cash_entry[${index}].given_pi_cash_quantity`
								)
							).toFixed(2)}
						</td>
						<td className={`w-32 ${rowClass}`}>
							<Input
								label={`pi_cash_entry[${index}].pi_cash_quantity`}
								is_title_needed='false'
								height='h-8'
								dynamicerror={
									errors?.pi_cash_entry?.[index]
										?.pi_cash_quantity
								}
								disabled={
									getValues(
										`pi_cash_entry[${index}].pi_cash_quantity`
									) === 0
								}
								{...{ register, errors }}
							/>
							<Input
								label={`pi_cash_entry[${index}].sfg_uuid`}
								is_title_needed='false'
								className='hidden'
								{...{ register, errors }}
							/>
						</td>
						<td className={`${rowClass}`}>
							{Number(
								getValues(
									`pi_cash_entry[${index}].balance_quantity`
								)
							).toFixed(2)}
						</td>
						{isUpdate && (
							<td className={`${rowClass}`}>
								<CheckBoxWithoutLabel
									className={cn(
										watch(
											`pi_cash_entry[${index}].isDeletable`
										)
											? 'checkbox-error'
											: 'checkbox-error'
									)}
									label={`pi_cash_entry[${index}].isDeletable`}
									{...{ register, errors }}
								/>
							</td>
						)}
					</tr>
				))}
			</DynamicDeliveryField>

			{isUpdate && (
				<DynamicDeliveryField
					title={`New Entries`}
					tableHead={
						<>
							<th
								key='is_all_checked'
								scope='col'
								className='group w-20 cursor-pointer px-3 py-2'>
								<CheckBoxWithoutLabel
									label='is_all_new_checked'
									checked={isAllNewChecked}
									onChange={(e) => {
										setIsAllNewChecked(e.target.checked);
										setIsSomeNewChecked(e.target.checked);
									}}
									{...{ register, errors }}
								/>
							</th>
							{[
								'O/N',
								'Item Description',
								'Style',
								'Color',
								'Size (CM)',
								'QTY (PCS)',
								'Given',
								'PI QTY',
								'Balance QTY',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer px-3 py-2 transition duration-300'>
									{item}
								</th>
							))}
						</>
					}>
					{newOrderEntryField.map((item, index) => (
						<tr
							key={item.id}
							className={cn(
								'relative cursor-pointer bg-base-100 text-primary transition-colors duration-200 ease-in'
							)}>
							<td className={cn(`w-8 ${rowClass}`)}>
								<CheckBoxWithoutLabel
									label={`new_pi_cash_entry[${index}].is_checked`}
									checked={watch(
										`new_pi_cash_entry[${index}].is_checked`
									)}
									onChange={(e) =>
										handleRowChecked(e, index, true)
									}
									disabled={
										getValues(
											`new_pi_cash_entry[${index}].quantity`
										) == 0
									}
									{...{ register, errors }}
								/>
							</td>

							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`new_pi_cash_entry[${index}].order_number`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`new_pi_cash_entry[${index}].item_description`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`new_pi_cash_entry[${index}].style`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`new_pi_cash_entry[${index}].color`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`new_pi_cash_entry[${index}].size`)}
							</td>
							<td className={`${rowClass}`}>
								{Number(
									getValues(
										`new_pi_cash_entry[${index}].quantity`
									)
								).toFixed(0)}
							</td>
							<td className={`${rowClass}`}>
								{Number(
									getValues(
										`new_pi_cash_entry[${index}].given_pi_cash_quantity`
									)
								).toFixed(2)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`new_pi_cash_entry[${index}].pi_cash_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.new_pi_cash_entry?.[index]
											?.pi_cash_quantity
									}
									disabled={
										getValues(
											`new_pi_cash_entry[${index}].pi_cash_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
								<Input
									label={`new_pi_cash_entry[${index}].sfg_uuid`}
									is_title_needed='false'
									className='hidden'
									{...{ register, errors }}
								/>
							</td>
							<td className={`${rowClass}`}>
								{Number(
									getValues(
										`new_pi_cash_entry[${index}].balance_quantity`
									)
								).toFixed(2)}
							</td>
						</tr>
					))}
				</DynamicDeliveryField>
			)}
		</SectionEntryBody>
	);
};

export default Zipper;
