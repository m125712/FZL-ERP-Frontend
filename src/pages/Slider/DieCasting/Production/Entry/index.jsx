import { Suspense, useEffect, useRef, useState } from 'react';
import {
	useOtherOrderBatchDescription,
	useOtherOrderStore,
	useOtherSliderItem,
} from '@/state/Other';
import {
	useSliderDieCastingProduction,
	useSliderDieCastingProductionByUUID,
	useSliderDieCastingStock,
} from '@/state/Slider';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import TableNoData from '@/components/Table/_components/TableNoData';
import {
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	RemoveButton,
} from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	SLIDER_DIE_CASTING_NULL,
	SLIDER_DIE_CASTING_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index() {
	const { url, postData, updateData, deleteData } =
		useSliderDieCastingProduction();
	const { invalidateQuery } = useSliderDieCastingStock();
	const r_saveBtn = useRef();
	const { uuid } = useParams();

	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = uuid !== undefined;
	const { data } = useSliderDieCastingProductionByUUID(uuid, {
		enabled: isUpdate,
	});

	useEffect(() => {
		uuid !== undefined
			? (document.title = 'Update Die Casting Entry')
			: (document.title = 'Die Casting Entry');
	}, []);

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
		context: form,
	} = useRHF(SLIDER_DIE_CASTING_SCHEMA, SLIDER_DIE_CASTING_NULL);

	useEffect(() => {
		if (isUpdate && data) {
			reset(data);
		}
	}, [data, isUpdate]);

	const { data: slider_item_name } = useOtherSliderItem();
	const { data: orders } = useOtherOrderBatchDescription();
	const { data: order } = useOtherOrderStore();

	const {
		fields,
		append: sliderDieCastingAppend,
		remove: sliderDieCastingRemove,
	} = useFieldArray({
		control,
		name: 'array',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleSliderDieCastingRemove = (index) => {
		if (getValues(`array[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`array[${index}].uuid`),
				itemName: getValues(`array[${index}].uuid`),
			});
			window['slider__die_casting_production_entry__delete'].showModal();
		}
		sliderDieCastingRemove(index);
	};

	const handleSliderDieCastingAppend = () => {
		sliderDieCastingAppend({
			mc_no: '',
			slider_item_id: '',
			item_type: '',
			cavity_goods: '',
			cavity_reject: '',
			push_value: '',
			order_number: '',
			weight: '',
			remarks: '',
		});
	};
	const onClose = () => reset(SLIDER_DIE_CASTING_NULL);

	// Submit
	const onSubmit = async (data) => {
		const { array } = data;
		const created_by = user?.uuid;

		if (isUpdate) {
			const updatedPromises = [...array].map((item) => {
				// Create New Data or Update Existing
				if (item.uuid === undefined) {
					return postData.mutateAsync({
						url,
						newData: {
							...item,
							created_by,
							created_at: GetDateTime(),
							uuid: nanoid(),
						},
						isOnCloseNeeded: false,
					});
				}

				const updatedData = {
					...item,
					updated_at: GetDateTime(),
				};
				return updateData.mutateAsync({
					url: `${url}/${item.uuid}`,
					uuid: item.uuid,
					updatedData,
					isOnCloseNeeded: false,
				});
			});

			try {
				await Promise.all(updatedPromises).then(() => {
					reset(SLIDER_DIE_CASTING_NULL);
					invalidateQuery();
					navigate(`/slider/making/production_1`);
				});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Create New Data
		const newDataPromises = [...array].map((item) =>
			postData.mutateAsync({
				url,
				newData: {
					...item,
					created_by,
					created_at: GetDateTime(),
					uuid: nanoid(),
				},
				onClose,
			})
		);

		await Promise.all(newDataPromises)
			.then(() => {
				reset(SLIDER_DIE_CASTING_NULL);
				invalidateQuery();
				navigate(`/slider/making/production_1`);
			})
			.catch((err) => {
				console.error(`Error with Promise.all: ${err}`);
			});
	};

	const tdClass = 'px-1 pt-1 pb-2';

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
				<DynamicField
					title={uuid == null ? `Entry Details` : 'Update Details'}
					handelAppend={handleSliderDieCastingAppend}
					tableHead={[
						'MC NO',
						'Item Name',
						'Order Dsc',
						'Cavity Goods',
						'Cavity Defect',
						'Push',
						'Qty',
						'Weight',
						'Remarks',
					].map((item) => (
						<th key={item} scope='col' className='px-1 py-2'>
							{item}
						</th>
					))}
				>
					{isUpdate && fields.length === 0 && (
						<TableNoData colSpan={8} />
					)}

					{fields.length > 0 &&
						fields.map((item, index) => (
							<tr key={item.id}>
								{/* MC NO */}
								<td className={cn('w-24', tdClass)}>
									<Input
										label={`array[${index}].mc_no`}
										defaultValue={item.mc_no}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.[index]?.mc_no
										}
									/>
								</td>

								{/* ITEM NAME */}
								<td className={cn(tdClass)}>
									<FormField
										label={`array[${index}].die_casting_uuid`}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.[index]
												?.die_casting_uuid
										}
									>
										<Controller
											name={`array[${index}].die_casting_uuid`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Item'
														options={
															slider_item_name
														}
														value={slider_item_name?.find(
															(inItem) =>
																inItem.value ==
																getValues(
																	`array[${index}].die_casting_uuid`
																)
														)}
														onChange={(e) => {
															onChange(e.value);
														}}
														menuPortalTarget={
															document.body
														}
													/>
												);
											}}
										/>
									</FormField>
								</td>

								{/* ORDER NO */}
								<td className={cn(tdClass)}>
									<FormField
										label={`array[${index}].order_description_uuid`}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.[index]
												?.order_description_uuid
										}
									>
										<Controller
											name={`array[${index}].order_description_uuid`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Order'
														options={order}
														value={order?.find(
															(inItem) =>
																inItem.value ==
																getValues(
																	`array[${index}].order_description_uuid`
																)
														)}
														onChange={(e) => {
															onChange(e.value);
														}}
														menuPortalTarget={
															document.body
														}
													/>
												);
											}}
										/>
									</FormField>
								</td>

								{/* CAVITY GOODS */}
								<td className={cn('w-24', tdClass)}>
									<Input
										label={`array[${index}].cavity_goods`}
										defaultValue={item.cavity_goods}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.[index]?.cavity_goods
										}
									/>
								</td>

								{/* CAVITY DEFECT */}
								<td className={cn('w-24', tdClass)}>
									<Input
										label={`array[${index}].cavity_defect`}
										defaultValue={item.cavity_defect}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.[index]
												?.cavity_defect
										}
									/>
								</td>

								{/* PUSH */}
								<td className={cn('w-24', tdClass)}>
									<Input
										label={`array[${index}].push`}
										defaultValue={item.push}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.[index]?.push
										}
									/>
								</td>
								<td
									className={cn(
										'w-24 text-center font-semibold text-slate-800',
										tdClass
									)}
								>
									{watch(`array[${index}].push`) *
										watch(`array[${index}].cavity_goods`)}
								</td>
								{/* WEIGHT */}
								<td className={cn('w-40', tdClass)}>
									<JoinInput
										label={`array[${index}].weight`}
										defaultValue={item.weight}
										is_title_needed='false'
										unit='KG'
										register={register}
										dynamicerror={
											errors?.array?.[index]?.weight
										}
									/>
								</td>

								{/* REMARKS */}
								<td className={cn('w-24', tdClass)}>
									<Input
										label={`array[${index}].remarks`}
										defaultValue={item.remarks}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.[index]?.remarks
										}
									/>
								</td>

								<td className={cn('w-8', tdClass)}>
									<RemoveButton
										onClick={() =>
											handleSliderDieCastingRemove(index)
										}
										showButton={fields.length > 1}
									/>
								</td>
							</tr>
						))}
				</DynamicField>
				<Footer buttonClassName='!btn-primary' />
			</form>
			<Suspense>
				<DeleteModal
					modalId={'slider__die_casting_production_entry__delete'}
					title={'Production Entry'}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>

			<DevTool control={control} />
		</FormProvider>
	);
}
