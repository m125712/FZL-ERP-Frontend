import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import {
	useFetch,
	useFetchForRhfReset,
	useFetchForRhfResetForPlanning,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useDyeingPlanning } from '@/state/Dyeing';
import {
	CheckBoxWithoutLabel,
	DynamicDeliveryField,
	Input,
	Textarea,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_PLANNING_HEADOFFICE_NULL,
	DYEING_PLANNING_HEADOFFICE_SCHEMA,
} from '@util/Schema';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

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
	} = useRHF(
		DYEING_PLANNING_HEADOFFICE_SCHEMA,
		DYEING_PLANNING_HEADOFFICE_NULL
	);

	// planning_entry
	const { fields: PlanningEntryField } = useFieldArray({
		control,
		name: 'planning_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const onClose = () => reset(DYEING_PLANNING_HEADOFFICE_NULL);

	// * Fetch initial data
	isUpdate
		? useFetchForRhfReset(
				`/zipper/planning-details/by/${week_id}`,
				week_id,
				reset
			)
		: useFetchForRhfResetForPlanning(`/zipper/order-planning`, reset);

	const onSubmit = async (data) => {
		// * Update
		if (isUpdate) {
			const planning_data_updated = {
				...data,
				updated_at: GetDateTime(),
			};

			const planning_entry_updated = [...data?.planning_entry]
				.filter((item) => item.is_checked)
				.map((item) => ({
					...item,
					factory_remarks: item.factory_remarks,
					uuid: item.planning_entry_uuid,
					updated_at: GetDateTime(),
				}));

			if (planning_entry_updated.length === 0) {
				alert('Select at least one item to proceed.');
			} else {
				await updateData.mutateAsync({
					url: `/zipper/planning/${data?.week}`,
					updatedData: planning_data_updated,
					isOnCloseNeeded: false,
				});

				let planning_entry_updated_promises = [
					...planning_entry_updated.map(async (item) => {
						await updateData.mutateAsync({
							url: `/zipper/planning-entry/${item.uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						});
					}),
				];

				await Promise.all(planning_entry_updated_promises)
					.then(() =>
						reset(
							Object.assign({}, DYEING_PLANNING_HEADOFFICE_NULL)
						)
					)
					.then(
						navigate(
							`/dyeing-and-iron/planning-head-office/details/${week_id}`
						)
					)
					.catch((err) => console.log(err));
			}
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

		const planning_entry = [...data?.planning_entry]
			.filter((item) => item.is_checked)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				planning_week: weeks,
				factory_remarks: item.factory_remarks,
				created_at,
			}));

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

			await Promise.all(promises)
				.then(() =>
					reset(Object.assign({}, DYEING_PLANNING_HEADOFFICE_NULL))
				)
				.then(
					navigate(
						`/dyeing-and-iron/planning-head-office/details/${weeks}`
					)
				)
				.catch((err) => console.log(err));
		}
		return;
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

	// TODO: Please Check this Logic
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
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'balance_factory_quantity',
				header: 'Balanced Factory',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'factory_quantity',
				header: 'Factory QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.planning_entry?.[idx]?.factory_quantity;
					return (
						<Input
							label={`planning_entry[${idx}].factory_quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'factory_remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => (
					<Textarea
						label={`planning_entry[${info.row.index}].factory_remarks`}
						is_title_needed='false'
						height='h-8'
						{...{ register, errors }}
					/>
				),
			},
		],
		[isAllChecked, isSomeChecked, PlanningEntryField, register, errors]
	);

	return (
		<div>
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

				<ReactTable data={PlanningEntryField} columns={columns} />

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
