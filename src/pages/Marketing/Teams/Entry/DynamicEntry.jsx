import { useCallback } from 'react';
import { useOtherMarketing } from '@/state/Other';

import {
	ActionButtons,
	CheckBox,
	DynamicField,
	FormField,
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
	setValue,

	MarketingEntries,
	MarketingEntriesAppend,
	MarketingEntriesRemove,
	setDeleteItem,
}) {
	const { data: marketing } = useOtherMarketing();

	let filteredMarketing = marketing?.filter(
		(item) =>
			// * this returns true if the condition is met in the sone() function
			!MarketingEntries.some(
				({ marketing_uuid }) => marketing_uuid === item.value
			)
	);

	const handelMarketingEntriesAppend = () => {
		MarketingEntriesAppend({
			uuid: '',
		});
	};

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`marketing_team_entry[${index}]`);
			MarketingEntriesAppend({ ...item, uuid: undefined });
		},
		[getValues, MarketingEntriesAppend]
	);

	const handleRecipeRemove = (index) => {
		const Uuid = getValues(`marketing_team_entry[${index}].uuid`);
		const name = getValues(`marketing_team_entry[${index}].marketing_name`);
		if (Uuid !== undefined) {
			setDeleteItem({
				itemId: Uuid,
				itemName: name,
			});
			window['marketing_team_entry_delete_modal'].showModal();
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
												options={filteredMarketing}
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
								onChange={(e) => {
									// * logic for checking only one member for team leader
									if (e.target.checked) {
										MarketingEntries.map((item, i) => {
											if (i !== index) {
												setValue(
													`marketing_team_entry[${i}].is_team_leader`,
													false
												);
											}
										});
									}
								}}
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
