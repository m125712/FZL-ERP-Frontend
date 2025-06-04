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

const options = [
	{ value: 'all', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'completed', label: 'Completed' },
];

const options2 = [
	{ value: 'complete_order', label: 'Complete Order' },
	{ value: 'incomplete_order', label: 'Incomplete Order' },
];

export default function Index() {
	const [status, setStatus] = useState('pending');
	const [status2, setStatus2] = useState('incomplete_order');

	const { data, isLoading } = useDyeingSwatch(
		status2 === 'complete_order'
			? `order_type=${status2}`
			: `type=${status}&order_type=${status2}`
	);
	const { updateData } = useDyeingDummy(); //! need to update the data
	const info = new PageInfo(
		'LabDip/ZipperSwatch',
		'order/swatch',
		'lab_dip__zipper_swatch'
	);
	const haveAccess = useAccess('lab_dip__zipper_swatch');

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
				width: 'w-32',
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
			// {
			// 	accessorKey: 'order_type',
			// 	header: 'Type',
			// 	width: 'w-24',
			// 	// enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-40',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
					if (row.order_type === 'tape') return 'MTR';

					return row.is_inch === 1 ? 'INCH' : 'CM';
				},
				id: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: (
					<>
						QTY <br />
						(PCS)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleach',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => {
					const isBleach = info.getValue() === 'bleach';
					return (
						<StatusButton className={'btn-xs'} value={isBleach} />
					);
				},
			},
			{
				accessorFn: (row) => (row.is_batch_created ? 'Yes' : 'No'),
				id: 'is_dyeing_batch_entry',
				header: (
					<>
						Batch <br />
						Created
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						className={'btn-xs'}
						value={info.row.original.is_batch_created}
					/>
				),
			},
			{
				accessorKey: 'receive_by_factory_time',
				header: (
					<>
						Factory <br />
						Received
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.receive_by_factory_time}
					/>
				),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
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

					let isDisabled = true;
					if (swatchAccessOverride) isDisabled = false;
					if (recipe_uuid === null && swatchAccess)
						isDisabled = false;

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
							isDisabled={isDisabled}
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
					<>
						Setup <br />
						Date
					</>
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
					<>
						{status2 === 'incomplete_order' && (
							<StatusSelect
								options={options}
								status={status}
								setStatus={setStatus}
							/>
						)}
						<StatusSelect
							options={options2}
							status={status2}
							setStatus={setStatus2}
						/>
					</>
				}
			/>
		</div>
	);
}
