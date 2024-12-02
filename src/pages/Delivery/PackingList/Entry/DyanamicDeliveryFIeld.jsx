// DynamicDeliveryTable.jsx
import React from 'react';
import { get, useForm } from 'react-hook-form';

import { DynamicDeliveryField, Input, RemoveButton } from '@/ui';

import cn from '@/lib/cn';

const DynamicDeliveryTable = ({
	title,
	handlePackingListEntryRemove,
	packingListEntryField,
	isUpdate = false,
	register,
	watch,
	getValues,
	errors,
	entryFiledName,
}) => {
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<DynamicDeliveryField
			title={title}
			tableHead={
				<>
					{watch('item_for') === 'zipper'
						? [
								'O/N',
								'Item Description',
								'Style',
								'Color',
								'Size',
								'Unit',
								'Order QTY',
								'Balance QTY',
								'Production QTY',
								// 'Warehouse',
								// 'Delivered',
								'Quantity(pcs)',
								'Poly QTY',
								'Short QTY',
								'Reject QTY',
								'Remarks',
								,
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer px-3 py-2 transition duration-300'>
									{item}
								</th>
							))
						: watch('item_for') === 'thread'
							? [
									'O/N',
									'Count',
									'Style',
									'Color',
									'Length',
									'Unit',
									'Order QTY',
									'Balance QTY',
									'Production QTY',
									// 'Warehouse',
									// 'Delivered',
									'Quantity(pcs)',
									'Short QTY',
									'Reject QTY',
									'Remarks',
								].map((item) => (
									<th
										key={item}
										scope='col'
										className='group cursor-pointer px-3 py-2 transition duration-300'>
										{item}
									</th>
								))
							: watch('item_for') === 'sample_thread'
								? [
										'O/N',
										'Count',
										'Style',
										'Color',
										'Length',
										'Unit',
										'Order QTY',
										'Balance QTY',
										// 'Warehouse',
										// 'Delivered',
										'Quantity(pcs)',
										'Short QTY',
										'Reject QTY',
										'Remarks',
									].map((item) => (
										<th
											key={item}
											scope='col'
											className='group cursor-pointer px-3 py-2 transition duration-300'>
											{item}
										</th>
									))
								: [
										'O/N',
										'Item Description',
										'Style',
										'Color',
										'Size',
										'Unit',
										'Order QTY',
										'Balance QTY',
										// 'Warehouse',
										// 'Delivered',
										'Quantity(pcs)',
										'Poly QTY',
										'Short QTY',
										'Reject QTY',
										'Remarks',
										,
									].map((item) => (
										<th
											key={item}
											scope='col'
											className='group cursor-pointer px-3 py-2 transition duration-300'>
											{item}
										</th>
									))}

					{isUpdate && entryFiledName === 'packing_list_entry' && (
						<th
							key='action'
							scope='col'
							className='group cursor-pointer px-3 py-2 transition duration-300'>
							Delete
						</th>
					)}
				</>
			}>
			{packingListEntryField.map((item, index) => (
				<tr
					key={item.id}
					className={cn(
						'relative cursor-pointer bg-base-100 text-primary transition-colors duration-200 ease-in',
						isUpdate &&
							watch(`${entryFiledName}[${index}].isDeletable`) &&
							'bg-error/10 text-error hover:bg-error/20'
					)}>
					<td className={`w-32 ${rowClass}`}>
						{getValues(`${entryFiledName}[${index}].order_number`)}
					</td>
					<td className={`w-32 ${rowClass}`}>
						{getValues(
							`${entryFiledName}[${index}].item_description`
						)}
					</td>
					<td className={`w-32 ${rowClass}`}>
						{getValues(`${entryFiledName}[${index}].style`)}
					</td>
					<td className={`w-32 ${rowClass}`}>
						{getValues(`${entryFiledName}[${index}].color`)}
					</td>

					<td className={`w-32 ${rowClass}`}>
						{getValues(`${entryFiledName}[${index}].size`)}
					</td>

					<td className={`w-32 ${rowClass}`}>
						{getValues(`item_for`) === 'thread' ||
						getValues(`item_for`) === 'sample_thread'
							? 'cone'
							: getValues(`${entryFiledName}[${index}].is_inch`)
								? 'inch'
								: getValues(
											`${entryFiledName}[${index}].is_meter`
									  )=== 1
									? 'meter'
									: 'cm'}
					</td>
					<td className={rowClass}>
						{getValues(`${entryFiledName}[${index}].is_meter`) === 1
							? '---'
							: getValues(
									`${entryFiledName}[${index}].order_quantity`
								)}
					</td>
					<td className={rowClass}>
						{getValues(
							`${entryFiledName}[${index}].balance_quantity`
						)}
					</td>
					{(watch('item_for') === 'zipper' ||
						watch('item_for') === 'thread') && (
						<td className={rowClass}>
							{getValues(
								`${entryFiledName}[${index}].finishing_prod`
							)}
						</td>
					)}
					<td className={`w-32 ${rowClass}`}>
						<Input
							label={`${entryFiledName}[${index}].quantity`}
							is_title_needed='false'
							dynamicerror={
								errors?.[entryFiledName]?.[index]?.quantity
							}
							// disabled={
							// 	getValues(
							// 		`${entryFiledName}[${index}].quantity`
							// 	) === 0
							// }
							register={register}
							errors={errors}
						/>
					</td>
					{(watch('item_for') === 'zipper' ||
						watch('item_for') === 'sample_zipper') && (
						<td className={`w-32 ${rowClass}`}>
							<Input
								label={`${entryFiledName}[${index}].poli_quantity`}
								is_title_needed='false'
								dynamicerror={
									errors?.[entryFiledName]?.[index]
										?.poli_quantity
								}
								register={register}
								errors={errors}
							/>
						</td>
					)}
					<td className={`w-32 ${rowClass}`}>
						<Input
							label={`${entryFiledName}[${index}].short_quantity`}
							is_title_needed='false'
							dynamicerror={
								errors?.[entryFiledName]?.[index]
									?.short_quantity
							}
							register={register}
							errors={errors}
						/>
					</td>
					<td className={`w-32 ${rowClass}`}>
						<Input
							label={`${entryFiledName}[${index}].reject_quantity`}
							is_title_needed='false'
							dynamicerror={
								errors?.[entryFiledName]?.[index]
									?.reject_quantity
							}
							register={register}
							errors={errors}
						/>
					</td>
					<td className={`w-60 ${rowClass}`}>
						<Input
							label={`${entryFiledName}[${index}].remarks`}
							is_title_needed='false'
							dynamicerror={
								errors?.[entryFiledName]?.[index]?.remarks
							}
							register={register}
							errors={errors}
						/>
					</td>
					{isUpdate && entryFiledName === 'packing_list_entry' && (
						<td
							className={cn(
								rowClass,
								'min-w-20 border-l-2 border-base-200'
							)}>
							<RemoveButton
								showButton
								onClick={() =>
									handlePackingListEntryRemove(index)
								}
							/>
						</td>
					)}
				</tr>
			))}
		</DynamicDeliveryField>
	);
};

export default DynamicDeliveryTable;
