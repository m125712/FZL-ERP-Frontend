import { Suspense, useEffect, useState } from 'react';
import { useUtility, useUtilityByUUID } from '@/state/Maintenance';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { useNavigate, useParams } from 'react-router';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { DynamicField, FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { UTILITY_NULL, UTILITY_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';
import {
	getDefaultUnitCost,
	getDefaultVoltageRatio,
	PREDEFINED_UTILITY_TYPES,
	utilityEntryTypeOptions,
} from './utils';

export default function Index() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { utility_uuid } = useParams();

	// const { url: utilityEntryUrl } = useUtilityEntry();
	const { url: utilityUrl, updateData, postData, deleteData } = useUtility();
	const { data } = useUtilityByUUID(utility_uuid);

	useEffect(() => {
		utility_uuid !== undefined
			? (document.title = 'Update Utility: ' + utility_uuid)
			: (document.title = 'Utility Entry');
	}, [utility_uuid]);

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
		setValue,
		formState: { errors: formErrors },
	} = useRHF(UTILITY_SCHEMA, UTILITY_NULL);
	console.log(formErrors);

	const isUpdate = utility_uuid !== undefined;
	const offDay = watch('off_day');

	// utility_entries
	const { fields: utilityEntryField, append: utilityEntryAppend } =
		useFieldArray({
			control,
			name: 'utility_entries',
		});
	useEffect(() => {
		if (data) {
			reset(data);
		} else {
			// Initialize with 6 predefined entries for new utility
			const initialEntries = PREDEFINED_UTILITY_TYPES.map((type) => ({
				type,
				reading: 0,
				voltage_ratio: getDefaultVoltageRatio(type),
				unit_cost: getDefaultUnitCost(type),
				remarks: '',
			}));
			setValue('utility_entries', initialEntries);
		}
	}, [data, reset, setValue]);
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleUtilityEntryAppend = () => {
		if (offDay) return;
		utilityEntryAppend({
			type: '',
			reading: '',
			voltage_ratio: '',
			unit_cost: '',
			remarks: '',
		});
	};
	// Submit
	const onSubmit = async (data) => {
		const created_at = GetDateTime();
		const created_by = user?.uuid;

		// Update item
		if (isUpdate) {
			const utility_data = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			// delete utility_entries field from data to be sent
			delete utility_data['utility_entries'];

			const utility_promise = await updateData.mutateAsync({
				url: `${utilityUrl}/${data?.uuid}`,
				updatedData: utility_data,
				isOnCloseNeeded: false,
			});

			const newEntries = data.utility_entries
				.filter((item) => item.uuid === undefined)
				.map((item) => ({
					...item,
					utility_uuid: utility_uuid,
					created_at,
					created_by,
					uuid: nanoid(),
				}));

			const updatedEntries = data.utility_entries
				.filter((item) => item.uuid !== undefined)
				.map((item) => ({
					...item,
					updated_at: GetDateTime(),
					updated_by: user?.uuid,
				}));

			const utility_entries_promise = [
				...updatedEntries.map(async (item) => {
					return await updateData.mutateAsync({
						url: `/maintain/utility-entry/${item.uuid}`,
						updatedData: item,
						isOnCloseNeeded: false,
					});
				}),

				newEntries.length > 0 &&
					(await postData.mutateAsync({
						url: '/maintain/utility-entry',
						newData: newEntries,
						isOnCloseNeeded: false,
					})),
			];

			try {
				await Promise.all([utility_promise, ...utility_entries_promise])
					.then(() => reset(UTILITY_NULL))
					.then(() => {
						navigate(`/maintenance/utility/${utility_uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		const new_utility_uuid = nanoid();

		// Create utility
		const utility_data = {
			...data,
			uuid: new_utility_uuid,
			created_at,
			created_by,
		};

		// delete utility_entries field from data to be sent
		delete utility_data['utility_entries'];

		const utility_promise = await postData.mutateAsync({
			url: utilityUrl,
			newData: utility_data,
			isOnCloseNeeded: false,
		});

		// Create utility entries
		const utility_entries = [...data.utility_entries].map((item) => ({
			...item,
			utility_uuid: new_utility_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
		}));

		const utility_entries_promise = [
			await postData.mutateAsync({
				url: '/maintain/utility-entry',
				newData: utility_entries,
				isOnCloseNeeded: false,
			}),
		];

		try {
			await Promise.all([utility_promise, ...utility_entries_promise])
				.then(() => reset(UTILITY_NULL))
				.then(() => {
					navigate(`/maintenance/utility/${new_utility_uuid}`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
	};

	const handlers = {
		NEW_ROW: handleUtilityEntryAppend,
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide  p-3';

	return (
		<FormProvider {...form}>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col'
				>
					<div className='space-y-6'>
						<Header
							{...{
								register,
								errors,
								control,
								getValues,
								Controller,
								watch,
								isUpdate,
								offDay,
								setValue,
							}}
						/>

						<DynamicField
							title='Utility Entries'
							showAppendButton={false}
							tableHead={[
								'Type',
								'Reading',
								'Voltage Ratio',
								'Unit Cost',
								'Remarks',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-4 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'
								>
									{item}
								</th>
							))}
						>
							{utilityEntryField.map((item, index) => (
								<tr key={item.id} className=''>
									<td className={`${rowClass}`}>
										<FormField
											label={`utility_entries[${index}].type`}
											title='Type'
											is_title_needed='false'
											dynamicerror={
												errors?.utility_entries?.[index]
													?.type
											}
										>
											<Controller
												name={`utility_entries[${index}].type`}
												control={control}
												render={({
													field: { onChange, value },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Type'
															options={
																utilityEntryTypeOptions
															}
															value={
																utilityEntryTypeOptions.find(
																	(opt) =>
																		opt.value ===
																		value
																) || null
															}
															onChange={(opt) =>
																onChange(
																	opt?.value
																)
															}
															menuPortalTarget={
																document.body
															}
															isDisabled={true}
														/>
													);
												}}
											/>
										</FormField>
									</td>
									<td className={`w-48 ${rowClass}`}>
										<Input
											title='reading'
											label={`utility_entries[${index}].reading`}
											is_title_needed='false'
											type='number'
											step='any'
											dynamicerror={
												errors?.utility_entries?.[index]
													?.reading
											}
											register={register}
											disabled={offDay}
										/>
									</td>
									<td className={`w-48 ${rowClass}`}>
										<Input
											title='voltage_ratio'
											label={`utility_entries[${index}].voltage_ratio`}
											is_title_needed='false'
											type='number'
											step='any'
											dynamicerror={
												errors?.utility_entries?.[index]
													?.voltage_ratio
											}
											register={register}
											disabled={offDay}
										/>
									</td>
									<td className={`w-48 ${rowClass}`}>
										<Input
											title='unit_cost'
											label={`utility_entries[${index}].unit_cost`}
											is_title_needed='false'
											type='number'
											step='any'
											dynamicerror={
												errors?.utility_entries?.[index]
													?.unit_cost
											}
											register={register}
											disabled={offDay}
										/>
									</td>
									<td className={`w-48 ${rowClass}`}>
										<Input
											title='remarks'
											label={`utility_entries[${index}].remarks`}
											is_title_needed='false'
											dynamicerror={
												errors?.utility_entries?.[index]
													?.remarks
											}
											register={register}
											disabled={offDay}
										/>
									</td>
								</tr>
							))}
						</DynamicField>
					</div>

					<Footer buttonClassName='!btn-primary' />
				</form>
			</HotKeys>
			<Suspense>
				<DeleteModal
					modalId={'utility_entry_delete'}
					title={'Utility Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={utilityEntryField}
					url='/maintain/utility-entry'
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
