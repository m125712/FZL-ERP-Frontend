import React from 'react';
import { Plus } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

import { DateInput } from '@/ui/Core';
import { FormField, Input, ReactSelect, RemoveButton } from '@/ui';

const paymentTypeOption = [
	{ label: 'RTGS', value: 'rtgs' },
	{ label: 'MPS', value: 'mps' },
	{ label: 'NPSB', value: 'npsb' },
];

const PaymentField = React.memo(function PaymentField({
	voucherIndex,
	control,
	register,
	errors,
	Controller,
	watch,
}) {
	const {
		fields: paymentFields,
		append: paymentAppend,
		remove: paymentRemove,
	} = useFieldArray({
		control,
		name: `voucher_entry.${voucherIndex}.voucher_entry_payment`,
	});

	const handlePaymentAppend = () => {
		paymentAppend({
			payment_type: '',
			trx_no: '',
			date: null,
			amount: '',
		});
	};

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide p-3';

	return (
		<div className='ml-4 mt-2 border-l-2 border-gray-200 pl-32'>
			<div className='mb-2 flex items-center justify-between'>
				<button
					type='button'
					onClick={handlePaymentAppend}
					className='btn btn-outline btn-sm text-end'
				>
					<Plus className='size-4' />
					Payment
				</button>
			</div>
			{paymentFields?.length > 0 && (
				<table className='w-full table-auto'>
					<thead>
						<tr>
							<th className='pl-4'>No.</th>
							<th className='pl-4'>Payment Method</th>
							<th className='pl-4'>Transaction No.</th>
							<th className='pl-4'>Date</th>
							<th className='pl-14'>Credit</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{paymentFields.map((item, index) => (
							<tr key={item.id} className='gap-4'>
								<td className={`w-10 ${rowClass}`}>
									{item.index + 1}
								</td>
								<td className={`w-48 ${rowClass}`}>
									<FormField
										label={`voucher_entry.${voucherIndex}.voucher_entry_payment.${index}.payment_type`}
										title='Payment Method'
										is_title_needed='false'
										dynamicerror={
											errors?.voucher_entry?.[
												voucherIndex
											]?.voucher_entry_payment?.[index]
												?.payment_type
										}
									>
										<Controller
											name={`voucher_entry.${voucherIndex}.voucher_entry_payment.${index}.payment_type`}
											control={control}
											render={({
												field: { onChange, value },
											}) => (
												<ReactSelect
													placeholder='Select Payment Method'
													options={paymentTypeOption}
													value={
														paymentTypeOption.find(
															(opt) =>
																opt.value ===
																value
														) ?? null
													}
													onChange={(e) =>
														onChange(e?.value)
													}
													menuPortalTarget={
														document.body
													}
												/>
											)}
										/>
									</FormField>
								</td>

								<td className={`w-48 ${rowClass}`}>
									<Input
										title='Transaction No.'
										label={`voucher_entry.${voucherIndex}.voucher_entry_payment.${index}.trx_no`}
										dynamicerror={
											errors?.voucher_entry?.[
												voucherIndex
											]?.voucher_entry_payment?.[index]
												?.trx_no
										}
										is_title_needed='false'
										register={register}
									/>
								</td>

								<td className={`w-48 ${rowClass}`}>
									<DateInput
										label={`voucher_entry.${voucherIndex}.voucher_entry_payment.${index}.date`}
										Controller={Controller}
										control={control}
										is_title_needed='false'
										selected={watch(
											`voucher_entry.${voucherIndex}.voucher_entry_payment.${index}.date`
										)}
										{...{ register, errors }}
									/>
								</td>

								<td className={`w-48 ${rowClass} pl-14`}>
									<Input
										title='Credit'
										is_title_needed='false'
										label={`voucher_entry.${voucherIndex}.voucher_entry_payment.${index}.amount`}
										dynamicerror={
											errors?.voucher_entry?.[
												voucherIndex
											]?.voucher_entry_payment?.[index]
												?.amount
										}
										register={register}
									/>
								</td>

								<td className={`w-12 ${rowClass} pl-0`}>
									<RemoveButton
										onClick={() => paymentRemove(index)}
										showButton={paymentFields.length > 0}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
});

export default PaymentField;
