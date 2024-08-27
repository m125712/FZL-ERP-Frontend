import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetch, useFetchFunc, useUpdateFunc } from '@/hooks';
import { useDyeingSwatch } from '@/state/Dyeing';
import { useThreadSwatch } from '@/state/Thread';
import { EditDelete, LinkWithCopy, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { useEffect, useMemo, useState } from 'react';
import AddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useThreadSwatch();
	const info = new PageInfo(
		'Dyeing/Swatch',
		'order/swatch',
		'thread__swatch'
	);
	const haveAccess = useAccess('thread__swatch');
	console.log(data);

	// * fetching the data
	const { value: shade_recipe } = useFetch(
		'/other/lab-dip/shade-recipe/value/label'
	);

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
							uri='/thread/order-info/details'
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
				accessorKey: 'shade_recipe_name',
				header: 'Swatch Status',
				enableColumnFilter: false,
				cell: (info) => {
					const { shade_recipe_uuid } = info.row.original;

					return (
						<ReactSelect
							key={shade_recipe_uuid}
							placeholder='Select order info uuid'
							options={shade_recipe ?? []}
							value={shade_recipe?.filter(
								(item) => item.value == shade_recipe_uuid
							)}
							filterOption={null}
							onChange={(e) =>
								handleSwatchStatus(e, info.row.index)
							}
							menuPortalTarget={document.body}
						/>
					);
				},
			},
		],
		[data, shade_recipe]
	);

	const handleSwatchStatus = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-entry/${data[idx]?.order_entry_uuid}`,
			updatedData: {
				shade_recipe_uuid: e.value,
				swatch_approval_date: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};

	// Update
	const [updateSwatch, setUpdateSwatch] = useState({
		id: null,
		order_entry_id: null,
		style: '',
		status: '',
		remarks: '',
	});

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>
		</div>
	);
}
