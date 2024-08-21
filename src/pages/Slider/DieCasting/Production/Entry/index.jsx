import { DeleteModal } from '@/components/Modal';
import { NoDataFound } from '@/components/Table/ui';
import { useAccess, useRHF } from '@/hooks';
import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { useOtherOrder, useOtherSliderItem } from '@/state/Other';
import {
	useSliderDieCastingProduction,
	useSliderDieCastingProductionByUUID,
} from '@/state/Slider';
import {
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	RemoveButton,
} from '@/ui';
import PageContainer from '@/ui/Others/PageContainer';
import GetDateTime from '@/util/GetDateTime';

import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	SLIDER_DIE_CASTING_NULL,
	SLIDER_DIE_CASTING_SCHEMA,
} from '@util/Schema';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Index() {
	useAccess('slider__die_casting_production_entry');

	const { url, postData, updateData, deleteData } =
		useSliderDieCastingProduction();
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
	} = useRHF(SLIDER_DIE_CASTING_SCHEMA, SLIDER_DIE_CASTING_NULL);

	useEffect(() => {
		if (isUpdate && data) {
			reset({
				array: data,
			});
		}
	}, [data, isUpdate]);

	const { data: slider_item_name } = useOtherSliderItem();
	const { data: orders } = useOtherOrder();

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
					navigate(`/slider/die-casting/production`);
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
				navigate(`/slider/die-casting/production`);
			})
			.catch((err) => {
				console.error(`Error with Promise.all: ${err}`);
			});
	};

	const breadcrumbs = [
		{
			label: 'Slider',
			isDisabled: true,
		},
		{
			label: 'Die Casting',
			isDisabled: true,
		},
		{
			label: 'Production',
			href: '/slider/die-casting/production',
		},
		{
			label: isUpdate ? 'Update' : 'Create',
			href: isUpdate
				? `/slider/die-casting/production/update/${uuid}`
				: '/slider/die-casting/production/entry',
		},
	];

	const tdClass = 'px-1 pt-1 pb-2';

	return (
		<PageContainer
			title={isUpdate ? 'Update Production' : 'Create Production'}
			breadcrumbs={breadcrumbs}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'>
				<DynamicField
					title={uuid == null ? `Entry Details` : 'Update Details'}
					handelAppend={handleSliderDieCastingAppend}
					tableHead={[
						'MC NO',
						'Item Name',
						'Order No',
						'Cavity Goods',
						'Cavity Defect',
						'Push',
						'Weight',
						'Remarks',
					].map((item) => (
						<th key={item} scope='col' className='px-1 py-2'>
							{item}
						</th>
					))}>
					{isUpdate && fields.length === 0 && (
						<NoDataFound colSpan={8} />
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
										dynamicerror={errors?.array?.mc_no}
									/>
								</td>

								{/* ITEM NAME */}
								<td className={cn('w-60', tdClass)}>
									<FormField
										label={`array[${index}].die_casting_uuid`}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.die_casting_uuid
										}>
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
								<td className={cn('w-44', tdClass)}>
									<FormField
										label={`array[${index}].order_info_uuid`}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.order_info_uuid
										}>
										<Controller
											name={`array[${index}].order_info_uuid`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Order'
														options={orders}
														value={orders?.find(
															(inItem) =>
																inItem.value ==
																getValues(
																	`array[${index}].order_info_uuid`
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
								<td className={cn('w-32', tdClass)}>
									<Input
										label={`array[${index}].cavity_goods`}
										defaultValue={item.cavity_goods}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.cavity_goods
										}
									/>
								</td>

								{/* CAVITY DEFECT */}
								<td className={cn('w-32', tdClass)}>
									<Input
										label={`array[${index}].cavity_defect`}
										defaultValue={item.cavity_defect}
										is_title_needed='false'
										register={register}
										dynamicerror={
											errors?.array?.cavity_defect
										}
									/>
								</td>

								{/* PUSH */}
								<td className={cn('w-32', tdClass)}>
									<Input
										label={`array[${index}].push`}
										defaultValue={item.push}
										is_title_needed='false'
										register={register}
										dynamicerror={errors?.array?.push}
									/>
								</td>

								{/* WEIGHT */}
								<td className={cn('w-40', tdClass)}>
									<JoinInput
										label={`array[${index}].weight`}
										defaultValue={item.weight}
										is_title_needed='false'
										unit='KG'
										register={register}
										dynamicerror={errors?.array?.weight}
									/>
								</td>

								{/* REMARKS */}
								<td className={cn('', tdClass)}>
									<Input
										label={`array[${index}].remarks`}
										defaultValue={item.remarks}
										is_title_needed='false'
										register={register}
										dynamicerror={errors?.array?.remarks}
									/>
								</td>

								<td>
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
				<div className='modal-action'>
					<button
						type='submit'
						className='text-md btn btn-primary btn-block'
						ref={r_saveBtn}
						// onKeyDown={keyDown}
					>
						Save
					</button>
				</div>
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
		</PageContainer>
	);
}
