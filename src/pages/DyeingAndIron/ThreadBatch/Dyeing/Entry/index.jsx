import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useDyeingThreadBatch,
	useDyeingThreadBatchDetailsByUUID,
	useDyeingThreadBatchEntry,
} from '@/state/Dyeing';
import { useNavigate, useParams } from 'react-router';
import { useRHF } from '@/hooks';

import { CustomLink, DynamicDeliveryField, Input } from '@/ui';

import cn from '@/lib/cn';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	DYEING_THREAD_CONNEING_NULL,
	DYEING_THREAD_CONNEING_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

export default function Index() {
	const { user } = useAuth();
	const { url: threadBatchEntryUrl } = useDyeingThreadBatchEntry();
	const { url: threadBatchUrl, updateData } = useDyeingThreadBatch();
	const navigate = useNavigate();
	const { batch_con_uuid } = useParams();

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
	} = useRHF(DYEING_THREAD_CONNEING_SCHEMA, DYEING_THREAD_CONNEING_NULL);

	// batch_entry
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'batch_entry',
	});

	const { data } = useDyeingThreadBatchDetailsByUUID(batch_con_uuid);

	useEffect(() => {
		if (data && batch_con_uuid) {
			reset(data);
		}
	}, [data, batch_con_uuid]);

	const [transfer, setTransfer] = useState({
		batch_entry_uuid: null,
		transfer_quantity: null,
	});

	const getTotalQty = useCallback(
		(batch_entry) =>
			batch_entry.reduce((acc, item) => {
				return acc + Number(item.quantity);
			}, 0),
		[watch()]
	);
	const getTotalCalTape = useCallback(
		(batch_entry) =>
			batch_entry.reduce((acc, item) => {
				const expected_weight =
					parseFloat(item.quantity || 0) *
					parseFloat(item.max_weight);

				return acc + expected_weight;
			}, 0),
		[watch()]
	);
	const getTotalYarnQuantity = useCallback(
		(batch_entry) =>
			batch_entry.reduce((acc, item) => {
				return acc + parseFloat(item.yarn_quantity);
			}, 0),
		[watch()]
	);

	// Submit
	const onSubmit = async (data) => {
		// Update item

		const isCreatedAtNull = getValues('dyeing_created_at') === null;
		const threadBatchData = {
			...data,
			[isCreatedAtNull ? 'dyeing_created_at' : 'dyeing_updated_at']:
				GetDateTime(),
			status_date: data?.status !== 'pending' ? GetDateTime() : null,
			yarn_issue_created_by: user.uuid,
			yarn_issue_created_at: GetDateTime(),
		};

		// Update /commercial/pi/{uuid}
		const threadBatchPromise = updateData.mutateAsync({
			url: `${threadBatchUrl}/${data?.uuid}`,
			updatedData: threadBatchData,
			uuid: batch_con_uuid,
			isOnCloseNeeded: false,
		});

		// Update batch entries
		const updatedThreadBatchPromises = data.batch_entry.map((item) =>
			updateData.mutateAsync({
				url: `${threadBatchEntryUrl}/${item?.batch_entry_uuid}`,
				updatedData: { ...item },
				uuid: item.batch_entry_uuid,
				isOnCloseNeeded: false,
			})
		);

		try {
			await Promise.all([
				threadBatchPromise,
				...updatedThreadBatchPromises,
			])
				.then(() => reset({ ...DYEING_THREAD_CONNEING_NULL }))
				.then(() =>
					navigate(`/dyeing-and-iron/thread-batch/${batch_con_uuid}`)
				);
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<div>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						watch,
						Controller,
						totalQuantity: getTotalQty(watch('batch_entry')),
						totalWeight: getTotalCalTape(watch('batch_entry')),
					}}
				/>
				<DynamicDeliveryField
					title={`Details: `}
					tableHead={[
						'O/N',
						'Color',
						'Style',
						'Count Length',
						'Recipe',
						'Batch QTY',
						'Exp. (KG)',
						'Yarn QTY (KG)',
						'Remarks',
					].map((item) => (
						<th
							key={item}
							scope='col'
							className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'
						>
							{item}
						</th>
					))}
				>
					{orderEntryField.map((item, index) => (
						<tr
							key={item.id}
							className='relative cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'
						>
							<td className={`${rowClass}`}>
								{
									<CustomLink
										label={item.order_number}
										url={`/thread/order-info/${item.order_info_uuid}`}
									/>
								}
							</td>
							<td className={`w-32 ${rowClass}`}>{item.color}</td>
							<td className={`w-32 ${rowClass}`}>{item.style}</td>
							<td className={`${rowClass}`}>
								{item.count_length}
							</td>
							<td className={`${rowClass}`}>
								{item.recipe_name}
							</td>

							<td className={`${rowClass}`}>{item.quantity}</td>

							<td className={`${rowClass}`}>
								{Number(
									parseFloat(
										watch(
											`batch_entry[${index}].quantity`
										) || 0
									) *
										parseFloat(
											watch(
												`batch_entry[${index}].max_weight`
											)
										)
								).toFixed(3)}
							</td>
							<td className={` ${rowClass}`}>
								<Input
									label={`batch_entry[${index}].yarn_quantity`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.yarn_quantity
									}
									register={register}
								/>
							</td>
							<td className={`${rowClass}`}>
								{item.batch_remarks}
							</td>
						</tr>
					))}

					<tr
						className={cn(
							'relative cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'
						)}
					>
						{/* Span all columns up to "Expected Weight" */}

						<td className='text-right font-semibold' colSpan={6}>
							Total:
						</td>
						<td className='px-3 py-2 text-left font-semibold'>
							{Number(
								getTotalCalTape(watch('batch_entry')).toFixed(3)
							)}{' '}
							kg
						</td>
						<td className='px-3 py-2 text-left font-semibold'>
							{Number(
								getTotalYarnQuantity(
									watch('batch_entry')
								).toFixed(3)
							)}
						</td>

						{/* Empty <td> elements to maintain table structure */}
						<td></td>
					</tr>
				</DynamicDeliveryField>
				<div className='modal-action'>
					<button
						type='submit'
						className='text-md btn btn-primary btn-block'
					>
						Save
					</button>
				</div>
			</form>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
