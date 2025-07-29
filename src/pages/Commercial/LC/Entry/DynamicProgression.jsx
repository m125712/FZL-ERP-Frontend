import { useCallback } from 'react';
import { useAccess } from '@/hooks';

import { DateInput } from '@/ui/Core';
import { ActionButtons, DynamicField, Input } from '@/ui';

export default function index({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,
	progressionField,
	progressionAppend,
	progressionRemove,
	setDeleteLCEntry,
}) {
	// Permission checks for different sections of LC progression
	const haveAccess = useAccess('commercial__lc_entry');

	// Permission for document-related fields: Handover, Doc Submit, Doc Receive
	const canEditDocuments = haveAccess.includes('edit_document_progression');

	// Permission for bank/payment-related fields: Bank Forward, Bank Accep., Maturity, Payment, Payment Value
	const canEditBankPayment = haveAccess.includes(
		'edit_bank_payment_progression'
	);
	const handelProgressionAppend = () => {
		progressionAppend({
			recipe_uuid: '',
		});
	};

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`lc_entry[${index}]`);
			progressionAppend({ ...item, uuid: undefined });
		},
		[getValues, progressionAppend]
	);

	const handleRecipeRemove = (index) => {
		const progressionUuid = getValues(`lc_entry[${index}].uuid`);
		if (progressionUuid !== undefined) {
			setDeleteLCEntry({
				itemId: progressionUuid,
				itemName: progressionUuid,
			});
			window['lc_entry_delete'].showModal();
		}
		progressionRemove(index);
	};

	const rowClass = '';

	return (
		<>
			<DynamicField
				title='Progression'
				handelAppend={handelProgressionAppend}
				tableHead={[
					'Amount',
					'LDBC/FDBC',
					// 'Receive Date',
					'Handover',
					'Doc Submit',
					'Doc Receive',
					'Bank Forward',
					'Bank Accep.',
					'Maturity',
					'Payment',
					'Payment Value',
					// 'Approved',
					'Action',
				].map((item) => (
					<th key={item} scope='col' className=''>
						{item}
					</th>
				))}
			>
				{progressionField.map((item, index) => (
					<tr key={item.id}>
						<td className={rowClass}>
							<Input
								label={`lc_entry[${index}].amount`}
								is_title_needed='false'
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<Input
								label={`lc_entry[${index}].ldbc_fdbc`}
								is_title_needed='false'
								{...{ register, errors }}
							/>
						</td>
						{/* <td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].receive_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].receive_date`
								)}
								{...{ register, errors }}
							/>
						</td> */}
						<td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].handover_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].handover_date`
								)}
								disabled={!canEditDocuments}
								// disabled={
								// 	watch(`lc_entry[${index}].receive_date`)
								// 		? false
								// 		: true
								// }
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].document_submission_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].document_submission_date`
								)}
								disabled={!canEditDocuments}
								// disabled={
								// 	watch(`lc_entry[${index}].handover_date`)
								// 		? false
								// 		: true
								// }
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].document_receive_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].document_receive_date`
								)}
								disabled={
									!canEditDocuments ||
									(!watch(
										`lc_entry[${index}].document_submission_date`
									) &&
										!watch(
											`lc_entry[${index}].handover_date`
										))
								}
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].bank_forward_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].bank_forward_date`
								)}
								disabled={
									!canEditBankPayment ||
									!watch(
										`lc_entry[${index}].document_receive_date`
									)
								}
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].acceptance_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].acceptance_date`
								)}
								disabled={
									!canEditBankPayment ||
									!watch(
										`lc_entry[${index}].bank_forward_date`
									)
								}
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].maturity_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].maturity_date`
								)}
								disabled={
									!canEditBankPayment ||
									!watch(`lc_entry[${index}].acceptance_date`)
								}
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<DateInput
								label={`lc_entry[${index}].payment_date`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry[${index}].payment_date`
								)}
								disabled={
									!canEditBankPayment ||
									!watch(`lc_entry[${index}].maturity_date`)
								}
								{...{ register, errors }}
							/>
						</td>
						<td className={rowClass}>
							<Input
								label={`lc_entry[${index}].payment_value`}
								is_title_needed='false'
								disabled={!canEditBankPayment}
								{...{ register, errors }}
							/>
						</td>

						<td
							className={`w-16 ${rowClass} border-l-4 border-l-primary`}
						>
							<ActionButtons
								duplicateClick={() =>
									handelDuplicateDynamicField(index)
								}
								removeClick={() => handleRecipeRemove(index)}
								showRemoveButton={true}
							/>
						</td>
					</tr>
				))}
			</DynamicField>
		</>
	);
}
