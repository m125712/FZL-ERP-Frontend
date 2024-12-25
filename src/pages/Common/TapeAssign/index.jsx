import { useMemo } from 'react';
import { useCommonTapeAssign } from '@/state/Common';
import { useOtherTapeCoil } from '@/state/Other';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy, ReactSelect, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, updateData, isLoading } = useCommonTapeAssign();
	const info = new PageInfo(
		'Common/Tape Assign',
		'common/tape_assign',
		'common__tape_assign'
	);
	const haveAccess = useAccess('common__tape_assign');
	const { data: tape } = useOtherTapeCoil(`/other/tape-coil/value/label`);
	// * fetching the data

	const columns = useMemo(
		() => [
			{
				accessorKey: 'is_sample',
				header: 'Sample',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
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
				accessorKey: 'description',
				header: 'Description',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					`${row.order_number_wise_rank || 0}/${row.order_number_wise_count || 0}`,
				id: 'order_number_wise_rank',
				header: 'O/N count',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				width: 'w-40',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorFn: (row) => row.tape_coil_uuid,
				id: 'tape_assign',
				header: 'Tape Assign',
				enableColumnFilter: false,
				width: 'w-60',
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					const { tape_coil_uuid, item, zipper_number } =
						info.row.original;

					const swatchAccess =
						haveAccess.includes('click_tape_assign');
					const swatchAccessOverride = haveAccess.includes(
						'click_tape_assign_override'
					);

					return (
						<ReactSelect
							key={tape_coil_uuid}
							placeholder='Select Tape'
							options={tape?.filter(
								(tapeItem) =>
									tapeItem.item === item &&
									(tapeItem.zipper_number === zipper_number ||
										tapeItem.zipper_number ===
											'6Vs8xVrvoEcfnWg') //* 6Vs8xVrvoEcfnWg is for 4.5
							)}
							value={tape?.find(
								(item) => item.value == tape_coil_uuid
							)}
							filterOption={null}
							onChange={(e) =>
								handleSwatchStatus(e, info.row.index)
							}
							isDisabled={
								swatchAccessOverride
									? false
									: tape_coil_uuid === null && swatchAccess
										? false
										: true
							}
							menuPortalTarget={document.body}
						/>
					);
				},
			},
		],
		[data, tape]
	);

	const handleSwatchStatus = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/zipper/order/description/update/by/${e.value}`,
			updatedData: {
				order_description_uuid: data[idx].order_description_uuid,
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
