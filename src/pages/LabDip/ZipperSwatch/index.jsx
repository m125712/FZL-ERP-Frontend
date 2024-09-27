import { useMemo } from 'react';
import { useDyeingSwatch } from '@/state/Dyeing';
import { useAccess, useFetch } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy, ReactSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, updateData, isLoading } = useDyeingSwatch();
	const info = new PageInfo(
		'LabDip/ZipperSwatch',
		'order/swatch',
		'lab_dip__zipper_swatch'
	);
	const haveAccess = useAccess('lab_dip__zipper_swatch');

	// * fetching the data

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
				header: 'Size (CM)',
				width: 'w-24',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Swatch Status',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					const { recipe_uuid } = info.row.original;
					const { order_info_uuid, bleaching } = info.row.original;
					const { value: recipe } = useFetch(
						`/other/lab-dip/recipe/value/label?order_info_uuid=${order_info_uuid}&bleaching=${bleaching}`
					);

					return (
						<ReactSelect
							key={recipe_uuid}
							placeholder='Select order info uuid'
							options={recipe ?? []}
							value={recipe?.find(
								(item) => item.value == recipe_uuid
							)}
							filterOption={null}
							onChange={(e) =>
								handleSwatchStatus(e, info.row.index)
							}
							// isDisabled={recipe !== undefined ? false : true}
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
			url: `/zipper/sfg-swatch/${data[idx]?.uuid}`,
			updatedData: { recipe_uuid: e.value },
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