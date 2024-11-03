import { useCallback, useMemo } from 'react';
import { useDyeingDummy, useDyeingSwatch } from '@/state/Dyeing';
import { useAccess, useFetch } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy, ReactSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading } = useDyeingSwatch();
	const { updateData } = useDyeingDummy();
	const info = new PageInfo(
		'LabDip/ZipperSwatch',
		'order/swatch',
		'lab_dip__zipper_swatch'
	);
	const haveAccess = useAccess('lab_dip__zipper_swatch');

	// * fetching the data

	const handleSwatchStatus = useCallback(
		async (e, idx) => {
			await updateData.mutateAsync({
				url: `/zipper/sfg-swatch/${data[idx]?.uuid}`,
				updatedData: {
					recipe_uuid: e.value,
					swatch_approval_date: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		},
		[updateData, data]
	);
	const { value: recipe } = useFetch(
		`/other/lab-dip/recipe/value/label?approved=true`
	);
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				// enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-40',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleach',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-40',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				width: 'w-24',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'is_inch',
				header: 'Unit',
				width: 'w-24',
				// enableColumnFilter: false,
				cell: (info) => (info.getValue() == 1 ? 'IN' : 'CM'),
			},
			{
				accessorKey: 'quantity',
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
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					const { recipe_uuid } = info.row.original;
					const { order_info_uuid, bleaching } = info.row.original;

					const swatchAccess = haveAccess.includes(
						'click_swatch_status'
					);
					const swatchAccessOverride = haveAccess.includes(
						'click_swatch_status_override'
					);

					return (
						<ReactSelect
							key={recipe_uuid}
							placeholder='Select order info uuid'
							options={recipe?.filter(
								(recipeItem) =>
									recipeItem.bleaching === bleaching &&
									recipeItem.order_info_uuid ===
										order_info_uuid
							)}
							value={recipe?.find(
								(item) => item.value == recipe_uuid
							)}
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
		[data, recipe, handleSwatchStatus, haveAccess]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
		</div>
	);
}
