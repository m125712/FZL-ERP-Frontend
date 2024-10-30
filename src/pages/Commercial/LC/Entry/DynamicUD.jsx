import { useCallback } from 'react';

import { DateInput } from '@/ui/Core';
import { ActionButtons, DynamicField, Input } from '@/ui';

export default function index({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,

	udField,
	udAppend,
	udRemove,
	setDeleteLCEntryUD,
}) {
	const handelUDAppend = () => {
		udAppend({
			recipe_uuid: '',
		});
	};

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`lc_entry_others[${index}]`);
			udAppend({ ...item, uuid: undefined });
		},
		[getValues, udAppend]
	);

	const handleRecipeRemove = (index) => {
		const udUuid = getValues(`lc_entry_others[${index}].uuid`);
		const udNo = getValues(`lc_entry_others[${index}].ud_no`);
		if (udUuid !== undefined) {
			setDeleteLCEntryUD({
				itemId: udUuid,
				itemName: udNo,
			});
			window['lc_entry_details_delete'].showModal();
		}
		udRemove(index);
	};

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<>
			<DynamicField
				title='UD'
				handelAppend={handelUDAppend}
				tableHead={[
					'Ud No.',
					'Ud Received',
					'Ud Number',
					'Remarks',
					'Action',
				].map((item) => (
					<th
						key={item}
						scope='col'
						className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'>
						{item}
					</th>
				))}>
				{udField.map((item, index) => (
					<tr key={item.id}>
						<td className={`${rowClass}`}>
							<Input
								label={`lc_entry_others[${index}].ud_no`}
								is_title_needed='false'
								{...{ register, errors }}
							/>
						</td>
						<td className={`${rowClass}`}>
							<DateInput
								label={`lc_entry_others[${index}].ud_received`}
								is_title_needed='false'
								Controller={Controller}
								control={control}
								selected={watch(
									`lc_entry_others[${index}].ud_received`
								)}
								{...{ register, errors }}
							/>
						</td>
						<td className={`w-44 ${rowClass}`}>
							<Input
								label={`lc_entry_others[${index}].up_number`}
								is_title_needed='false'
								{...{ register, errors }}
							/>
						</td>
						<td className={`w-44 ${rowClass}`}>
							<Input
								label={`lc_entry_others[${index}].remarks`}
								is_title_needed='false'
								{...{ register, errors }}
							/>
						</td>
						<td
							className={`w-16 ${rowClass} border-l-4 border-l-primary`}>
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
