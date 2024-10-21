import { useMemo } from 'react';
import { UseLabDipInfoByDetails, useLabDipRecipe } from '@/state/LabDip';
import { useAccess } from '@/hooks';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, LinkWithCopy } from '@/ui';

import GetDateTime from '@/util/GetDateTime';

export default function Index({ recipe }) {
	const { updateData, url } = useLabDipRecipe();
	const { invalidateQuery: invalidateQueryLabDipInfo } =
		UseLabDipInfoByDetails(recipe?.uuid);

	const haveAccess = useAccess('lab_dip__recipe');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'recipe_name',
				header: 'Recipe Name',
				enableColumnFilter: false,
				cell: (info) => {
					const { recipe_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={recipe_uuid}
							uri='/lab-dip/recipe/details'
						/>
					);
				},
			},
			{
				accessorKey: 'approved',
				header: 'Approved',
				enableColumnFilter: false,
				cell: (info) => {
					const access = haveAccess.includes('click_approve');
					const overrideAccess = haveAccess.includes(
						'click_approve_override'
					);
					return (
						<SwitchToggle
							disabled={
								overrideAccess
									? false
									: access
										? Number(info.getValue()) === 1
										: true
							}
							onChange={() =>
								handelApprovedStatusChange(info.row.index)
							}
							checked={Number(info.getValue()) === 1}
						/>
					);
				},
			},

			// {
			// 	accessorKey: 'status',
			// 	header: 'Status',
			// 	enableColumnFilter: false,

			// 	cell: (info) => {
			// 		const access = haveAccess.includes('click_status');
			// 		const overrideAccess = haveAccess.includes(
			// 			'click_status_override'
			// 		);
			// 		return (
			// 			<SwitchToggle
			// 				disabled={
			// 					overrideAccess
			// 						? false
			// 						: access
			// 							? Number(info.getValue()) === 1
			// 							: true
			// 				}
			// 				onChange={() => handelStatusChange(info.row.index)}
			// 				checked={Number(info.getValue()) === 1}
			// 			/>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'recipe_created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'recipe_updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[recipe]
	);
	const handelApprovedStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${recipe[idx]?.recipe_uuid}`,
			updatedData: {
				approved: recipe[idx]?.approved === 1 ? 0 : 1,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
		invalidateQueryLabDipInfo();
	};
	const handelStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${recipe[idx]?.recipe_uuid}`,
			updatedData: {
				status: recipe[idx]?.status === 1 ? 0 : 1,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
		invalidateQueryLabDipInfo();
	};
	return (
		<ReactTableTitleOnly title='Details' data={recipe} columns={columns} />
	);
}
