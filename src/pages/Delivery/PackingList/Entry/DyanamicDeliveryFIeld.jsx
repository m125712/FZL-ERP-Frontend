// DynamicDeliveryTable.jsx
import React from 'react';

import { CustomLink, DynamicDeliveryField, Input, RemoveButton } from '@/ui';

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
	totalQuantity = () => {},
}) => {
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';
	let tableHead = [
		'O/N',
		'Item Description',
		'Style',
		'Color',
		'Size',
		'Unit',
		'Order QTY',
		'Balance QTY',
		'Production QTY',
		'Quantity',
		'Poly QTY',
		'Short QTY',
		'Reject QTY',
		'Remarks',
	];

	if (watch('item_for') === 'slider') {
		tableHead = [
			'O/N',
			'Item Description',
			'Style',
			'Order QTY',
			'Balance QTY',
			'Production QTY',
			'Quantity',
			'Poly QTY',
			'Short QTY',
			'Reject QTY',
			'Remarks',
			,
		];
	} else if (
		watch('item_for') === 'thread' ||
		watch('item_for') === 'sample_thread'
	) {
		tableHead = [
			'O/N',
			'Count',
			'Style',
			'Color',
			'Length',
			'Unit',
			'Order QTY',
			'Balance QTY',
			'Production QTY',
			'Carton Qty',
			'Quantity',
			'Short QTY',
			'Reject QTY',
			'Remarks',
		];
	} else if (watch('item_for') === 'sample_zipper') {
		tableHead = [
			'O/N',
			'Item Description',
			'Style',
			'Color',
			'Size',
			'Unit',
			'Order QTY',
			'Balance QTY',
			'Quantity',
			'Poly QTY',
			'Short QTY',
			'Reject QTY',
			'Remarks',
			,
		];
	}

	const total = totalQuantity(watch(entryFiledName));

	return (
		<DynamicDeliveryField
			title={title}
			tableHead={
				<>
					{tableHead.map((item) => (
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
						{/* <CustomLink
							label={getValues(
								`${entryFiledName}[${index}].order_number`
							)}
							url={`/order/details/${getValues(`${entryFiledName}[${index}].order_number`)}`}
							showCopyButton={false}
						/> */}

						{getValues(`${entryFiledName}[${index}].item_for`) ===
							'thread' ||
						getValues(`${entryFiledName}[${index}].item_for`) ===
							'sample_thread' ? (
							<CustomLink
								label={getValues(
									`${entryFiledName}[${index}].order_number`
								)}
								url={`/thread/order-info/${getValues(`${entryFiledName}[${index}].order_info_uuid`)}`}
								showCopyButton={false}
							/>
						) : (
							<CustomLink
								label={getValues(
									`${entryFiledName}[${index}].order_number`
								)}
								url={`/order/details/${getValues(
									`${entryFiledName}[${index}].order_number`
								)}`}
								showCopyButton={false}
							/>
						)}
					</td>
					<td className={`w-32 ${rowClass}`}>
						<CustomLink
							label={getValues(
								`${entryFiledName}[${index}].item_description`
							)}
							url={`/order/details/${getValues(`${entryFiledName}[${index}].order_number`)}/${getValues(`${entryFiledName}[${index}].order_description_uuid`)}`}
							showCopyButton={false}
						/>
					</td>
					<td className={`w-32 ${rowClass}`}>
						{getValues(`${entryFiledName}[${index}].style`)}
					</td>
					{watch('item_for') !== 'slider' && (
						<td className={`w-32 ${rowClass}`}>
							{getValues(`${entryFiledName}[${index}].color`)}
						</td>
					)}

					{watch('item_for') !== 'slider' && (
						<td className={`w-32 ${rowClass}`}>
							{getValues(`${entryFiledName}[${index}].size`)}
						</td>
					)}

					<td className={`w-32 ${rowClass}`}>
						{getValues(`${entryFiledName}[${index}].unit`)}
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
					{watch('item_for') !== 'sample_zipper' && (
						<td className={rowClass}>
							{getValues(
								`${entryFiledName}[${index}].finishing_prod`
							)}
						</td>
					)}
					{(watch('item_for') === 'thread' ||
						watch('item_for') === 'sample_thread') && (
						<td className={rowClass}>
							{Math.ceil(
								Number(
									getValues(
										`${entryFiledName}[${index}].max_quantity`
									)
								) /
									Number(
										getValues(
											`${entryFiledName}[${index}].cone_per_carton`
										)
									)
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
						watch('item_for') === 'sample_zipper' ||
						watch('item_for') === 'slider' ||
						watch('item_for') === 'tape') && (
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
			<tr className='bg-slate-200 text-primary'>
				<td colSpan={8}>
					<div className='flex justify-end py-2'>Total Quantity:</div>
				</td>
				<td>
					<div className='px-5'>{total?.totalQty}</div>
				</td>
				<td>
					<div className='px-5'>{total?.totalPolyQty}</div>
				</td>
				<td>
					<div className='px-5'>{total?.totalShortQty}</div>
				</td>
				<td>
					<div className='px-5'>{total?.totalRejectQty}</div>
				</td>
				<td></td>
				{isUpdate && entryFiledName === 'packing_list_entry' && (
					<td></td>
				)}
			</tr>
		</DynamicDeliveryField>
	);
};

export default DynamicDeliveryTable;
