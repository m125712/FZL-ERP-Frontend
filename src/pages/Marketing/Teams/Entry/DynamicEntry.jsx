import { useCallback } from 'react';
import { useOtherMarketing } from '@/state/Other';

import { ActionButtons, CheckBox, DynamicField, Textarea } from '@/ui';

import MarketingExecutive from './MarketingExecutive';

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
	data,
}) {
	const handelMarketingEntriesAppend = () => {
		MarketingEntriesAppend({
			uuid: undefined,
		});
	};

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
				title='Team Member'
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
						className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'
					>
						{item}
					</th>
				))}
			>
				{MarketingEntries.map((item, index) => (
					<tr key={item.id}>
						<td className={`${rowClass}`}>
							<MarketingExecutive
								index={index}
								MarketingEntries={MarketingEntries}
								control={control}
								errors={errors}
								watch={watch}
								Controller={Controller}
								getValues={getValues}
								setValue={setValue}
								data={data}
							/>
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
							className={`w-16 ${rowClass} border-l-4 border-l-primary`}
						>
							<ActionButtons
								showDuplicateButton={false}
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
