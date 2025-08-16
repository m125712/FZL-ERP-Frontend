import { useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { UseLabDipInfoByDetails, useLabDipRecipe } from '@/state/LabDip';
import { useAccess } from '@/hooks';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, LinkWithCopy } from '@/ui';

import GetDateTime from '@/util/GetDateTime';

export default function Index({ recipe, order_info_uuid }) {
	const { updateData, url } = useLabDipRecipe();
	const { invalidateQuery: invalidateQueryLabDipInfo } =
		UseLabDipInfoByDetails(recipe?.uuid);

	const haveAccess = useAccess('lab_dip__recipe');
	const { user } = useAuth();

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
								!order_info_uuid ||
								(!overrideAccess &&
									(!access || Number(info.getValue()) === 1))
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
				accessorKey: 'approved_date',
				header: 'Approved Date',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'is_pps_req',
				header: 'PP Sample Required?',
				enableColumnFilter: false,
				cell: (info) => {
					const access = haveAccess.includes('click_approve');
					const overrideAccess = haveAccess.includes(
						'click_approve_override'
					);
					return (
						<SwitchToggle
							disabled={
								!order_info_uuid ||
								(!overrideAccess &&
									(!access || Number(info.getValue()) === 1))
							}
							onChange={() =>
								handelPPsRequiredStatusChange(info.row.index)
							}
							checked={Number(info.getValue()) === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'is_pps_req_date',
				header: 'PP Required Date',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
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
			url: `/lab-dip/info-entry/${recipe[idx]?.info_entry_uuid}`,
			updatedData: {
				approved: recipe[idx]?.approved === 1 ? 0 : 1,
				approved_date:
					recipe[idx]?.approved === 1 ? null : GetDateTime(),
				updated_by: user?.uuid,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
		invalidateQueryLabDipInfo();
	};

	const handelPPsRequiredStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `/lab-dip/info-entry/${recipe[idx]?.info_entry_uuid}`,
			updatedData: {
				is_pps_req: recipe[idx]?.is_pps_req === 1 ? 0 : 1,
				is_pps_req_date:
					recipe[idx]?.is_pps_req === 1 ? null : GetDateTime(),
				updated_by: user?.uuid,
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
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
		invalidateQueryLabDipInfo();
	};
	return (
		<ReactTableTitleOnly title='Details' data={recipe} columns={columns} />
	);
}
