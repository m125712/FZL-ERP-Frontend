import { DeleteModal } from '@/components/Modal';
import { useFetchForRhfResetForOrder, useRHF } from '@/hooks';
import { CheckBoxWithoutLabel, DynamicDeliveryField, Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_THREAD_CONNEING_NULL,
	DYEING_THREAD_CONNEING_SCHEMA,
} from '@util/Schema';
import { Suspense, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { useCommercialPI, useCommercialPIEntry } from '@/state/Commercial';
import {
	useDyeingThreadBatch,
	useDyeingThreadBatchByUUID,
	useDyeingThreadBatchEntry,
} from '@/state/Dyeing';
import isJSON from '@/util/isJson';
import Header from './Header';

export default function Index() {
	const { url: threadBatchEntryUrl } = useDyeingThreadBatchEntry();
	const {
		url: threadBatchUrl,
		postData,
		updateData,
		deleteData,
	} = useDyeingThreadBatch();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [orderInfoIds, setOrderInfoIds] = useState('');

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
		getFieldState,
	} = useRHF(DYEING_THREAD_CONNEING_SCHEMA, DYEING_THREAD_CONNEING_NULL);

	// batch_entry
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'batch_entry',
	});

	useFetchForRhfResetForOrder(
		`/thread/batch-details/by/${orderInfoIds}`,
		orderInfoIds,
		reset
	);

	useEffect(() => {
		const uuid = getValues('uuid');

		if (uuid === null || uuid === '') {
			setOrderInfoIds(null);
		} else {
			if (isJSON(uuid)) {
				setOrderInfoIds(() => JSON.parse(uuid).split(',').join(','));
			} else {
				const uuid = getValues('uuid');
				if (!Array.isArray(uuid)) {
					setOrderInfoIds(() => uuid);
				} else {
					setOrderInfoIds(() => uuid.join(','));
				}
			}
		}
	}, [watch('uuid')]);

	// Submit
	const onSubmit = async (data) => {
		// Update item

		const threadBatchData = {
			coning_operator: data?.coning_operator,
			coning_supervisor: data?.coning_supervisor,
			coning_machines: data?.coning_machines,
			updated_at: GetDateTime(),
		};
		// update /commercial/pi/{uuid}
		const threadBatchPromise = await updateData.mutateAsync({
			url: `${threadBatchUrl}/${data?.uuid}`,
			updatedData: threadBatchData,
			uuid: orderInfoIds,
			isOnCloseNeeded: false,
		});

		// pi entry
		let updatedThreadBatchPromises = data.batch_entry.map(async (item) => {
			const updatedData = {
				coning_production_quantity: item.coning_production_quantity,
				coning_production_quantity_in_kg:
					item?.coning_production_quantity_in_kg,
				updated_at: GetDateTime(),
			};

			return await updateData.mutateAsync({
				url: `${threadBatchEntryUrl}/${item?.batch_entry_uuid}`,
				updatedData: updatedData,
				uuid: item.batch_entry_uuid,
				isOnCloseNeeded: false,
			});
		});

		try {
			await Promise.all([
				threadBatchPromise,
				...updatedThreadBatchPromises,
			])
				.then(() =>
					reset(Object.assign({}, DYEING_THREAD_CONNEING_NULL))
				)
				.then(() => navigate(`/dyeing-and-iron/thread-batch`));
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
		return;
	};

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

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
					}}
				/>
				<DynamicDeliveryField
					title={`Details: `}
					tableHead={
						<>
							{[
								'order number',
								'color',
								'po',
								'style',
								'count length',
								'shade Recipe',
								'order quantity',
								'quantity',
								'coning production quantity',
								'coning production quantity in kg',
								'total quantity',
								'balance quantity',
								'remarks',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'>
									{item}
								</th>
							))}
						</>
					}>
					{orderEntryField.map((item, index) => (
						<tr
							key={item.id}
							className={cn(
								'relative cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'
							)}>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`batch_entry[${index}].order_number`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].color`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].po`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].style`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].count_length`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].shade_recipe_name`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].order_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`batch_entry[${index}].quantity`)}
							</td>

							<td className={rowClass}>
								<Input
									label={`batch_entry[${index}].coning_production_quantity`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.coning_production_quantity
									}
									register={register}
								/>
							</td>
							<td className={rowClass}>
								<Input
									label={`batch_entry[${index}].coning_production_quantity_in_kg`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.coning_production_quantity_in_kg
									}
									register={register}
								/>
							</td>

							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].total_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].balance_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].batch_remarks`
								)}
							</td>
						</tr>
					))}
				</DynamicDeliveryField>
				<div className='modal-action'>
					<button
						type='submit'
						className='text-md btn btn-primary btn-block'>
						Save
					</button>
				</div>
			</form>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
