import { DeleteModal } from '@/components/Modal';
import {
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useFetch,
	useUpdateFunc,
	useFetchForRhfResetForPlanning,
} from '@/hooks';
import ReactTable from '@/components/Table';
import {
	CheckBoxWithoutLabel,
	DynamicDeliveryField,
	Input,
	Textarea,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { DYEING_PLANNING_SCHEMA, DYEING_PLANNING_NULL } from '@util/Schema';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDyeingPlanning } from '@/state/Dyeing';
import nanoid from '@/lib/nanoid';

import Header from './Header';

// UPDATE IS WORKING
export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useDyeingPlanning();
	const { weeks, week_id } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = week_id !== undefined;
	const [orderInfoIds, setOrderInfoIds] = useState({});

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
	} = useRHF(DYEING_PLANNING_SCHEMA, DYEING_PLANNING_NULL);

	// planning_entry
	const { fields: PlanningEntryField } = useFieldArray({
		control,
		name: 'planning_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const onClose = () => reset(DYEING_PLANNING_NULL);


	// * Fetch initial data
	isUpdate
		? useFetchForRhfResetForOrder(
				`/zipper/planning-details/by/${week_id}`,
				week_id,
				reset
			)
		: useFetchForRhfResetForPlanning(`/zipper/order-planning`, reset);

	// const { value: data } = useFetch('/zipper/order-planning');

	// console.log('Form array fields:', PlanningEntryField);
	// console.log('Form data:', getValues());

	// TODO: Not sure if this is needed. need further checking
	let order_info_ids;
	// useEffect(() => {
	// 	if (pi_uuid !== undefined) {
	// 		setOrderInfoIds((prev) => ({
	// 			...prev,
	// 			order_info_ids,
	// 		}));
	// 	}
	// }, [getValues('order_info_ids')]);

	const week = {
		'24-32': {
			label: '24-32',
			value: '24-32',
		},
		'24-33': {
			label: '24-33',
			value: '24-33',
		},
		'24-34': {
			label: '24-34',
			value: '24-34',
		},
		'24-35': {
			label: '24-35',
			value: '24-35',
		},
	};


	const onSubmit = async (data) => {
		// * Update
		if (isUpdate) {
			const planning_data_updated = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/planning/${data?.week}`,
				updatedData: planning_data_updated,
				isOnCloseNeeded: false,
			});

			const planning_entry_updated = [...data?.planning_entry].map(
				(item) => ({
					...item,
					remarks: item.plan_entry_remarks,
					uuid: item.planning_entry_uuid,
					updated_at: GetDateTime(),
				})
			);
			// console.log(planning_entry_updated);

			let planning_entry_updated_promises = [
				...planning_entry_updated.map(async (item) => {
					await updateData.mutateAsync({
						url: `/zipper/planning-entry/${item.uuid}`,
						updatedData: item,
						isOnCloseNeeded: false,
					});
				}),
			];

			return;
		}

		// * ADD data
		const created_at = GetDateTime();
		const planning_data = {
			...data,
			week: weeks,
			created_at,
			created_by: user.uuid,
		};

		// console.log('planning_data:', planning_data);

		const planning_entry = [...data?.planning_entry]
			.filter((item) => item.is_checked)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				planning_week: weeks,
				remarks: item.plan_entry_remarks,
				created_at,
			}));

		console.log('planning_entry_data:', planning_entry);

		if (planning_entry.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			await postData.mutateAsync({
				url,
				newData: planning_data,
				isOnCloseNeeded: false,
			});

			let promises = [
				...planning_entry.map(
					async (item) =>
						await postData.mutateAsync({
							url: '/zipper/planning-entry/for/factory',
							newData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			// await Promise.all(promises)
			// 	.then(() => reset(Object.assign({}, PI_NULL)))
			// 	.then(() => navigate(`/commercial/pi`))
			// 	.catch((err) => console.log(err));
		}
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return PlanningEntryField.forEach((item, index) => {
				setValue(`planning_entry[${index}].is_checked`, true);
			});
		}
		if (!isAllChecked) {
			return PlanningEntryField.forEach((item, index) => {
				setValue(`planning_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`planning_entry[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('planning_entry')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		setIsAllChecked(isEveryChecked);
		setIsSomeChecked(isSomeChecked);
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'checkbox',
				header: () => (
					<CheckBoxWithoutLabel
						className='bg-white'
						label='is_all_checked'
						checked={isAllChecked}
						onChange={(e) => {
							setIsAllChecked(e.target.checked);
							setIsSomeChecked(e.target.checked);
						}}
						{...{ register, errors }}
					/>
				),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => (
					<CheckBoxWithoutLabel
						label={`planning_entry[${info.row.index}].is_checked`}
						checked={watch(
							`planning_entry[${info.row.index}].is_checked`
						)}
						onChange={(e) => handleRowChecked(e, info.row.index)}
						disabled={
							getValues(
								`planning_entry[${info.row.index}].pi_quantity`
							) == 0
						}
						{...{ register, errors }}
					/>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'size',
				header: 'Size (CM)',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'factory_quantity',
				header: 'Factory QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => (
					<Input
						label={`planning_entry[${info.row.index}].factory_quantity`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={
							errors?.planning_entry?.[info.row.index]?.factory_quantity
						}
						{...{ register, errors }}
					/>
				),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => (
					<Textarea
						label={`planning_entry[${info.row.index}].plan_entry_remarks`}
						is_title_needed='false'
						height='h-8'
						{...{ register, errors }}
					/>
				),
			},
		],
		[isAllChecked]
	);

	// console.log(PlanningEntryField);

	return (
		<div className='container mx-auto mt-4 px-2 pb-2 md:px-4'>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
						isUpdate,
					}}
				/>

				{/* todo: react-table  */}

				<ReactTable
					data={PlanningEntryField}
					columns={columns}
					extraClass='py-2'
				/>

				<div className='modal-action'>
					<button
						type='submit'
						className='text-md btn btn-primary btn-block'>
						Save
					</button>
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId={'planning_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={PlanningEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
