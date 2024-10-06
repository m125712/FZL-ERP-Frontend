import { useEffect, useMemo, useState } from 'react';
import { useDyeingSwatch } from '@/state/Dyeing';
import { useThreadSwatch } from '@/state/Thread';
import { useAccess, useFetch, useFetchFunc, useUpdateFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { EditDelete, LinkWithCopy, ReactSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import AddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useThreadSwatch();
	const info = new PageInfo(
		'LabDip/Thread Swatch',
		'order/swatch',
		'lab_dip__thread_swatch'
	);
	const haveAccess = useAccess('lab_dip__thread_swatch');

	// * fetching the data

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/thread/order-info'
						/>
					);
				},
			},

			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-40',

				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-40',

				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'count_length_name',
				header: 'Count Length',
				width: 'w-40',

				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'po',
				header: 'PO',
				width: 'w-40',

				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleaching',
				width: 'w-40',

				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_quantity',
				header: (
					<span>
						Quantity
						<br />
						(PCS)
					</span>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Swatch Status',
				width: 'w-60',
				enableColumnFilter: false,
				cell: (info) => {
					const { recipe_uuid, bleaching } = info.row.original;
					const { uuid } = info.row.original;

					const { value: shade_recipe } = useFetch(
						`/other/lab-dip/shade-recipe/value/label?thread_order_info_uuid=${uuid}&bleaching=${bleaching}`
					);

					const swatchAccess = haveAccess.includes(
						'click_swatch_status'
					);
					const swatchAccessOverride = haveAccess.includes(
						'click_swatch_status_override'
					);

					return (
						<ReactSelect
							className={'input-xs'}
							key={recipe_uuid}
							placeholder='Select order info uuid'
							options={shade_recipe ?? []}
							value={shade_recipe?.filter(
								(item) => item.value == recipe_uuid
							)}
							filterOption={null}
							onChange={(e) =>
								handleSwatchStatus(e, info.row.index)
							}
							isDisabled={
								swatchAccessOverride
									? false
									: recipe_uuid === null && swatchAccess
										? false
										: true
							}
							menuPortalTarget={document.body}
						/>
					);
				},
			},
		],
		[data]
	);

	const handleSwatchStatus = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-entry/${data[idx]?.order_entry_uuid}`,
			updatedData: {
				recipe_uuid: e.value,
				swatch_approval_date: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
		</div>
	);
}
