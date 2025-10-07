import React from 'react';
import { useOtherMarketing } from '@/state/Other';

import { FormField, ReactSelect } from '@/ui';

export default function MarketingExecutive({
	index,
	MarketingEntries,
	control,
	errors,
	watch,
	Controller,
	getValues,
	setValue,
	data,
}) {
	const query = watch(`marketing_team_entry[${index}].marketing_uuid`)
		? ``
		: `is_already_team=false`;
	const { data: marketing } = useOtherMarketing(query);

	let filteredMarketing = marketing?.filter(
		(item) =>
			// * this returns true if the condition is met in the sone() function
			!MarketingEntries.some(
				({ marketing_uuid }) =>
					marketing_uuid === item.value &&
					item.value !==
						data?.marketing_team_entry[index]?.marketing_uuid
			)
	);

	return (
		<FormField
			label={`marketing_team_entry[${index}].marketing_uuid`}
			is_title_needed='false'
			errors={errors}
			dynamicerror={errors?.marketing_team_entry?.[index]?.marketing_uuid}
		>
			<Controller
				name={`marketing_team_entry[${index}].marketing_uuid`}
				control={control}
				render={({ field: { onChange } }) => {
					return (
						<ReactSelect
							menuPortalTarget={document.body}
							placeholder='Select Marketing Executive'
							options={filteredMarketing}
							value={marketing?.find(
								(item) =>
									item.value ===
									getValues(
										`marketing_team_entry[${index}].marketing_uuid`
									)
							)}
							onChange={(e) => onChange(e.value)}
						/>
					);
				}}
			/>
		</FormField>
	);
}
