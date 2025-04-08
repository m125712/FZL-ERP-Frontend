import { useCallback, useMemo, useState } from 'react';
import { useDyeingDummy, useDyeingSwatch } from '@/state/Dyeing';
import { useOtherRecipe } from '@/state/Other';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import {
	DateTime,
	LinkWithCopy,
	ReactSelect,
	StatusButton,
	StatusSelect,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const [status, setStatus] = useState('pending');
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
	];
	const { data, isLoading } = useDyeingSwatch(`type=${status}`);
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
	const { data: recipe } = useOtherRecipe(`approved=true`);
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
				width: 'w-24',
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
				accessorKey: 'order_type',
				header: 'Type',
				width: 'w-24',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				accessorFn: (row) => {
					if (row.order_type === 'tape') {
						return 'MTR';
					} else {
						return row.is_inch === 1 ? 'INCH' : 'CM';
					}
				},
				id: 'unit',
				header: 'Unit',
				width: 'w-24',
			},
			{
				accessorKey: 'quantity',
				header: (
					<span>
						Quantity <br />
						(PCS)
					</span>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					const { is_batch_created } = row;
					if (is_batch_created) {
						return 'Yes';
					}
					if (!is_batch_created) {
						return 'No';
					}
				},
				id: 'is_dyeing_batch_entry',
				header: 'Dyeing Batch Created',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						className={'btn-xs'}
						value={info.row.original.is_batch_created}
					/>
				),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Swatch Status',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				width: 'min-w-52',
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
									(recipeItem.bleaching === bleaching &&
										recipeItem.order_info_uuid ===
											order_info_uuid) ||
									recipeItem.value === null
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
			{
				accessorFn: (row) => {
					if (row.swatch_approval_date === null) return null;

					return format(row.swatch_approval_date, 'dd/MM/yyyy');
				},
				id: 'swatch_approval_date',
				header: (
					<span>
						Approval <br />
						Date
					</span>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.row.original.swatch_approval_date} />
				),
			},
		],
		[data, recipe, handleSwatchStatus, haveAccess]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraButton={
					<StatusSelect
						options={options}
						status={status}
						setStatus={setStatus}
					/>
				}
			/>
		</div>
	);
}
