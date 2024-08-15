import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useDyeingSwatch } from '@/state/Dyeing';
import { useAccess, useFetchFunc, useUpdateFunc, useFetch } from '@/hooks';
import { EditDelete, LinkWithCopy, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { useEffect, useMemo, useState } from 'react';
import AddOrUpdate from './AddOrUpdate';

export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useDyeingSwatch();
	const info = new PageInfo(
		'Swatch',
		'order/swatch',
		'dyeing__dyeing_and_iron_swatch'
	);
	const haveAccess = useAccess('dyeing__dyeing_and_iron_swatch');

	// * fetching the datat

	const { value: recipe } = useFetch('/other/lab-dip/recipe/value/label');



	const [swatch, setSwatch] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);



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
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Swatch Status',
				enableColumnFilter: false,
				cell: (info) => {
					const { recipe_uuid } = info.row.original;

					return (
						// <select
						// 	className="select select-bordered select-primary select-sm"
						// 	name="swatch_status"
						// 	defaultValue={info.getValue()}
						// 	onChange={(e) =>
						// 		handleSwatchStatus(e, info.row.index)
						// 	}
						// >
						// 	<option>--</option>
						// 	{statusOption?.map((item) => (
						// 		<option key={item.value} value={item.value}>
						// 			{item.label}
						// 		</option>
						// 	))}
						// </select>
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
							isDisabled={recipe !== undefined ? false : true}
							menuPortalTarget={document.body}
						/>
					);
				},
			},
			// {
			// 	accessorKey: "remarks",
			// 	header: "Remarks",
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			// {
			// 	accessorKey: "actions",
			// 	header: "Actions",
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	hidden: !haveAccess.includes("update"),
			// 	width: "w-24",
			// 	cell: (info) => {
			// 		return (
			// 			<EditDelete
			// 				idx={info.row.index}
			// 				handelUpdate={handelUpdate}
			// 				showDelete={false}
			// 			/>
			// 		);
			// 	},
			// },
		],
		[data, recipe]
	);

	// Fetching data from server
	// useEffect(() => {
	// 	document.title = info.getTabName();
	// 	useFetchFunc(info.getFetchUrl(), setSwatch, setLoading, setError);
	// }, []);

	const handleSwatchStatus = async (e, idx) => {

		await updateData.mutateAsync({
			url: `/zipper/sfg-swatch/${data[idx]?.uuid}`,
			updatedData: { recipe_uuid: e.value },
			isOnCloseNeeded: false,
		});

		// const updatedData = {
		// 	id: swatch[idx].order_entry_id,
		// 	swatch_status: e.currentTarget.value,
		// 	updated_at: GetDateTime(),
		// };

		// await useUpdateFunc({
		// 	// replace space, #, other special characters in style
		// 	uri: `/order/swatch/${updatedData?.id}/${swatch[idx]?.style.replace(/[#&/]/g, '')}`,
		// 	itemId: updatedData?.id,
		// 	data: swatch[idx],
		// 	updatedData: updatedData,
		// 	setItems: setSwatch((prev) => {
		// 		prev[idx] = {
		// 			...prev[idx],
		// 			...updatedData,
		// 		};
		// 		return [...prev];
		// 	}),
		// });
	};

	// Update
	const [updateSwatch, setUpdateSwatch] = useState({
		id: null,
		order_entry_id: null,
		style: '',
		status: '',
		remarks: '',
	});

	// const handelUpdate = (idx) => {
	// 	const selected = swatch[idx];
	// 	setUpdateSwatch((prev) => ({
	// 		...prev,
	// 		...selected,
	// 	}));
	// 	window[info.getAddOrUpdateModalId()].showModal();
	// };

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>
			{/* <Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setSwatch,
						updateSwatch,
						setUpdateSwatch,
					}}
				/>
			</Suspense> */}
		</div>
	);
}
