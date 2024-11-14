import { useCallback } from 'react';
import { useOtherMarketing } from '@/state/Other';

import { DateInput } from '@/ui/Core';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	ActionButtons,
	CheckBox,
	DynamicField,
	FormField,
	Input,
	ReactSelect,
	Textarea,
} from '@/ui';

export default function index({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,

	MarketingEntries,
	MarketingEntriesAppend,
	MarketingEntriesRemove,
	setDeleteItem,
}) {
	const { data: marketing } = useOtherMarketing();

	const handelMarketingEntriesAppend = () => {
		MarketingEntriesAppend({
			recipe_uuid: '',
		});
	};

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`lc_entry_others[${index}]`);
			MarketingEntriesAppend({ ...item, uuid: undefined });
		},
		[getValues, MarketingEntriesAppend]
	);

	const handleRecipeRemove = (index) => {
		const udUuid = getValues(`lc_entry_others[${index}].uuid`);
		const udNo = getValues(`lc_entry_others[${index}].ud_no`);
		if (udUuid !== undefined) {
			setDeleteItem({
				itemId: udUuid,
				itemName: udNo,
			});
			window['lc_entry_details_delete'].showModal();
		}
		MarketingEntriesRemove(index);
	};

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<>
			<DynamicField
				title='UD'
				handelAppend={handelMarketingEntriesAppend}
				tableHead={[
					'Marketing Executive',
					'Leader',
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
				{MarketingEntries.map((item, index) => (
					<tr key={item.id}>
						<td className={`${rowClass}`}>
							<FormField
								label={`marketing_team_entry[${index}].marketing_uuid`}
								is_title_needed='false'
								errors={errors}
								dynamicerror={
									errors?.marketing_team_entry?.[index]
										?.marketing_uuid
								}>
								<Controller
									name={`marketing_team_entry[${index}].marketing_uuid`}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												menuPortalTarget={document.body}
												placeholder='Select Party'
												options={marketing}
												value={marketing?.find(
													(item) =>
														item.value ===
														getValues(
															`marketing_team_entry[${index}].marketing_uuid`
														)
												)}
												onChange={(e) =>
													onChange(e.value)
												}
											/>
										);
									}}
								/>
							</FormField>
						</td>
						<td className={`${rowClass}`}>
							<CheckBox
								text='text-secondary-content'
								label={`marketing_team_entry[${index}].is_team_leader`}
								is_title_needed='false'
								{...{ register, errors }}
							/>
						</td>
						<td className={`${rowClass}`}>
							<Textarea
								is_title_needed='false'
								label={`marketing_team_entry[${index}].remarks`}
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
