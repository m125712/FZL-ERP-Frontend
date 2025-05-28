import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useDyeingFinishingBatch,
	useDyeingFinishingBatchByUUID,
	useDyeingFinishingBatchOrders,
} from '@/state/Dyeing';
import { useSliderAssemblyProduction } from '@/state/Slider';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import SubmitButton from '@/ui/Others/Button/SubmitButton';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';
import {
	FINISHING_BATCH_ENTRY_NULL,
	FINISHING_BATCH_ENTRY_SCHEMA,
} from '@/util/Schema';

import { Columns } from './columns';
import Header from './Header';

export default function index() {
	const [orderType, setOrderType] = useState('');
	const [sliderType, setSliderType] = useState('');
	const [endType, setEndType] = useState('');
	let [searchParams] = useSearchParams();
	const production_date = searchParams.get('production_date');
	const { user } = useAuth();
	const navigate = useNavigate();
	const { batch_uuid } = useParams();
	const isUpdate = batch_uuid !== undefined;

	const {
		data,
		postData,
		updateData,
		deleteData,
		invalidateQuery: invalidateDetails,
	} = useDyeingFinishingBatchByUUID(batch_uuid, 'is_update=true');

	const { invalidateQuery } = useDyeingFinishingBatch(
		`type=pending`,
		!isUpdate
	);
	// const { invalidateQuery: invalidateSliderAssembly } =
	// 	useSliderAssemblyProduction();

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

		formState: { dirtyFields },
		context: form,
	} = useRHF(
		{
			...FINISHING_BATCH_ENTRY_SCHEMA,
			dyeing_lead_time:
				FINISHING_BATCH_ENTRY_SCHEMA.dyeing_lead_time.when({
					is: () => orderType !== 'slider',
					then: (schema) => schema.required('Required'),
					otherwise: (schema) => schema.nullable(),
				}),
			slider_lead_time:
				FINISHING_BATCH_ENTRY_SCHEMA.slider_lead_time.when({
					is: () =>
						!(
							orderType === 'tape' ||
							sliderType === 'completely_provided'
						),
					then: (schema) => schema.required('Required'),
					otherwise: (schema) => schema.nullable(),
				}),
		},
		{ ...FINISHING_BATCH_ENTRY_NULL, production_date }
	);

	useEffect(() => {
		if (data && isUpdate) {
			reset(data); // Reset the form with updated data
			setOrderType(data?.order_type);
		}
	}, [data, reset]);

	const { data: batchOrders } = useDyeingFinishingBatchOrders(
		watch('order_description_uuid')
	);

	const { fields: BatchOrdersField, remove: BatchOrdersFieldRemove } =
		useFieldArray({
			control,
			name: 'finishing_batch_entry',
		});

	const { fields: NewBatchOrdersField } = useFieldArray({
		control,
		name: 'new_finishing_batch_entry',
	});

	// * setting finishing_batch_entry after fetching it
	useEffect(() => {
		if (!isUpdate) {
			setValue(
				'finishing_batch_entry',
				batchOrders?.length > 0 ? batchOrders : []
			);
		}

		// * on update sometimes the useFieldArray does not update so we need to set it manually
		// * this condition is need to trigger the useFieldArray to update to show the data
		if (isUpdate) {
			setValue('finishing_batch_entry', data?.finishing_batch_entry);
			setValue(
				'new_finishing_batch_entry',
				data?.new_finishing_batch_entry
			);
		}
	}, [batchOrders, watch('order_description_uuid'), data]);

	const onSubmit = async (data) => {
		// * separate the finishing_batch_entry and new_finishing_batch_entry
		const { finishing_batch_entry, new_finishing_batch_entry, ...rest } =
			data;

		if (isUpdate) {
			// * extract only the edited entries from the current entries
			const extractedUpdatedEntries = finishing_batch_entry.filter(
				(entry, index) => dirtyFields?.finishing_batch_entry?.[index]
			);

			const finishingEntry = finishing_batch_entry.filter(
				(item) => item.quantity > 0
			);
			const newFinishingEntry = new_finishing_batch_entry.filter(
				(item) => item.quantity > 0
			);

			if (finishingEntry?.length < 1 && newFinishingEntry?.length < 1) {
				ShowLocalToast({
					type: 'warning',
					message:
						'There should one or more item quantity greater than zero to proceed.',
				});

				return;
			}

			let flag = false;
			finishing_batch_entry.map((item) => {
				if (item.quantity < 1) {
					ShowLocalToast({
						type: 'error',
						message:
							'Quantity should greater than zero in batch orders.',
					});
					flag = true;
					return;
				}
			});

			if (flag) return;

			await updateData.mutateAsync({
				url: `/zipper/finishing-batch/${rest.uuid}`,
				updatedData: { ...rest, updated_at: GetDateTime() },
				isOnCloseNeeded: false,
			});

			// * update existing finishing batch entry which have been edited
			const finishingEntryUpdatedPromises = [
				...extractedUpdatedEntries,
			].map(
				async (item) =>
					await updateData.mutateAsync({
						url: `/zipper/finishing-batch-entry/${item.uuid}`,
						updatedData: { ...item, updated_at: GetDateTime() },
						isOnCloseNeeded: false,
					})
			);

			// * slider batch entry update depending on order_type and slider_provided
			if (orderType === 'tape') {
			} else if (sliderType === 'completely_provided') {
			} else {
				const slider_quantity_current =
					finishing_batch_entry.length === 1
						? finishing_batch_entry[0].quantity
						: finishing_batch_entry.reduce(
								(prev, curr) => prev + curr.quantity,
								0
							);
				const slider_quantity_new =
					new_finishing_batch_entry.length === 1
						? new_finishing_batch_entry[0].quantity
						: new_finishing_batch_entry.reduce(
								(prev, curr) => prev + curr.quantity,
								0
							);

				let slider_qty = slider_quantity_current + slider_quantity_new;

				if (
					data.end_type_name === '2 Way - Close End' ||
					data.end_type_name === '2 Way - Open End'
				) {
					slider_qty = slider_qty * 2;
				}

				await updateData.mutateAsync({
					url: `/slider/stock/${rest.stock_uuid}`,
					updatedData: {
						batch_quantity: slider_qty,
						updated_at: GetDateTime(),
					},
					isOnCloseNeeded: false,
				});
			}

			const newBatch = newFinishingEntry.map((item) => ({
				...item,
				uuid: nanoid(),
				finishing_batch_uuid: rest.uuid,
				created_at: GetDateTime(),
			}));

			// * create new finishing batch entry
			const newFinishingEntryDataPromises = await postData.mutateAsync({
				url: '/zipper/finishing-batch-entry',
				newData: newBatch,
				isOnCloseNeeded: false,
			});

			await Promise.all([
				...finishingEntryUpdatedPromises,
				newFinishingEntryDataPromises,
			])
				.then(() => reset(FINISHING_BATCH_ENTRY_NULL))
				.then(() => {
					invalidateQuery();
					invalidateDetails();
					// invalidateSliderAssembly();
				})
				.then(() => {
					navigate(`/planning/finishing-batch/${rest.uuid}`);
				})
				.catch((err) => console.log(err));

			return;
		}

		//*Add new data entry
		const finishingEntry = finishing_batch_entry.filter(
			(item) => item.quantity > 0
		);

		if (finishingEntry?.length < 1) {
			ShowLocalToast({
				type: 'warning',
				message:
					'There should one or more item quantity greater than zero to proceed.',
			});

			return;
		}

		const finishingData = {
			...rest,
			uuid: nanoid(),
			created_at: GetDateTime(),
			created_by: user.uuid,
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch',
			newData: finishingData,
			isOnCloseNeeded: false,
		});

		// * new finishing batch entries
		const finishingEntryData = [...finishingEntry].map((item) => ({
			...item,
			uuid: nanoid(),
			finishing_batch_uuid: finishingData.uuid,
			created_at: GetDateTime(),
		}));

		// * slider batch entry depending on order_type and slider_provided
		if (orderType === 'tape') {
		} else if (sliderType === 'completely_provided') {
		} else {
			let slider_quantity =
				finishingEntry.length === 1
					? finishingEntry[0].quantity
					: finishingEntry.reduce(
							(prev, curr) => prev + curr.quantity,
							0
						);

			if (
				endType === '2 Way - Close End' ||
				endType === '2 Way - Open End'
			) {
				slider_quantity = slider_quantity * 2;
			}

			const slider_info = {
				uuid: nanoid(),
				finishing_batch_uuid: finishingData.uuid,
				batch_quantity: slider_quantity,
				created_at: GetDateTime(),
			};

			await postData.mutateAsync({
				url: '/slider/stock',
				newData: slider_info,
				isOnCloseNeeded: false,
			});
		}

		let promises = await postData.mutateAsync({
			url: '/zipper/finishing-batch-entry',
			newData: finishingEntryData,
			isOnCloseNeeded: false,
		});

		await Promise.all([promises])
			.then(() => reset(FINISHING_BATCH_ENTRY_NULL))
			.then(() => {
				invalidateQuery();
				invalidateDetails();
				// invalidateSliderAssembly();
			})
			.then(() => {
				navigate(`/planning/finishing-batch/${finishingData.uuid}`);
			})
			.catch((err) => console.log(err));
		return;
	};

	const [deleteEntry, setDeleteEntry] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (index) => {
		const UUID = getValues(`finishing_batch_entry[${index}].uuid`);
		if (UUID !== undefined) {
			setDeleteEntry({
				itemId: UUID,
				itemName: UUID,
			});
			window['finishing_batch_entry_delete'].showModal();
		}
	};

	// * table columns for new finishing field on new entry or updating/deleting existing finishing field
	const currentColumns = Columns({
		setValue,
		BatchOrdersField,
		handelDelete,
		register,
		errors,
		watch,
		isUpdate,
	});

	// * table columns for adding new finishing field on update
	const NewColumns = Columns({
		setValue,
		NewBatchOrdersField,
		register,
		errors,
		watch,
		is_new: true,
	});

	const getTotal = () => {
		const batch_total = watch()
			.finishing_batch_entry?.filter((item) => item.quantity > 0)
			.reduce((prev, curr) => {
				return prev + Number(curr.quantity);
			}, 0);

		const new_batch_total = watch()
			.new_finishing_batch_entry?.filter((item) => item.quantity > 0)
			.reduce((prev, curr) => prev + Number(curr.quantity), 0);

		return { batch_total, new_batch_total };
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className='flex flex-col gap-8'>
					<Header
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
							orderType,
							setOrderType,
							sliderType,
							setSliderType,
							setEndType,
							isUpdate,
						}}
					/>

					<ReactTable
						title={'Batch Orders'}
						data={BatchOrdersField}
						columns={currentColumns}
					>
						<tr className='bg-slate-100'>
							<td
								colSpan={5}
								className='pe-2 text-right font-semibold'
							>
								Total:
							</td>
							<td
								colSpan={isUpdate ? 3 : 2}
								className='px-4 py-1'
							>
								{getTotal().batch_total}
							</td>
						</tr>
					</ReactTable>

					{isUpdate && NewBatchOrdersField?.length > 0 && (
						<ReactTable
							title={'Add New Batch Orders'}
							data={NewBatchOrdersField}
							columns={NewColumns}
						>
							<tr className='bg-slate-100'>
								<td
									colSpan={6}
									className='p-2 text-right font-semibold'
								>
									Total:
								</td>
								<td colSpan={2} className='px-4 py-1'>
									{getTotal().new_batch_total}
								</td>
							</tr>
						</ReactTable>
					)}
				</div>
				<Footer buttonClassName='!btn-primary' />
			</form>
			<DevTool control={control} placement='top-left' />
			<Suspense>
				<DeleteModal
					modalId={'finishing_batch_entry_delete'}
					title={'Batch Entry Delete'}
					deleteItem={deleteEntry}
					setDeleteItem={setDeleteEntry}
					setItems={BatchOrdersField}
					deleteData={deleteData}
					url={`/zipper/finishing-batch-entry`}
					// invalidateQuery={invalidateNewFinishingBatch}
				/>
			</Suspense>
		</FormProvider>
	);
}
