import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useCommercialManualPI,
	useCommercialManualPIDetails,
} from '@/state/Commercial';
import { useThreadOrderInfo } from '@/state/Thread';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { configure, HotKeys } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import DynamicFormSpreadSheet from '@/ui/Dynamic/DynamicFormSpreadSheet';
import SwitchToggle from '@/ui/Others/SwitchToggle';

import nanoid from '@/lib/nanoid';
import { MANUAL_PI_NULL, MANUAL_PI_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

export default function Index() {
	const { updateData, postData, deleteData } = useThreadOrderInfo();

	const { invalidateQuery: invalidateCommercialManualPI } =
		useCommercialManualPI();
	const { manual_pi_uuid } = useParams();
	const { data } = useCommercialManualPIDetails(manual_pi_uuid);
	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = manual_pi_uuid !== undefined;

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
		trigger,
		clearErrors,
	} = useRHF(MANUAL_PI_SCHEMA, MANUAL_PI_NULL);

	useEffect(() => {
		manual_pi_uuid !== undefined
			? (document.title = `Thread Shade Recipe: Update ${manual_pi_uuid}`)
			: (document.title = 'Thread Shade Recipe: Entry');
	}, []);

	const isZipper = [
		{ label: 'Yes', value: true },
		{ label: 'No', value: false },
	];

	useEffect(() => {
		if (data && isUpdate) {
			reset(data);
		}
	}, [data, isUpdate]);

	// manual_pi_entry
	const {
		fields: threadOrderInfoEntryField,
		append: threadOrderInfoEntryAppend,
		remove: threadOrderInfoEntryRemove,
		update: threadOrderInfoEntryUpdate,
	} = useFieldArray({
		control,
		name: 'manual_pi_entry',
	});

	const [zipperAll, setZipperAll] = useState();

	useEffect(() => {
		if (zipperAll !== null) {
			threadOrderInfoEntryField.forEach((item, index) => {
				setValue(
					`manual_pi_entry[${index}].is_zipper`,
					zipperAll ? true : false
				);
			});
		}
	}, [zipperAll, threadOrderInfoEntryField]);

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			const { manual_pi_entry } = value;
			if (manual_pi_entry?.length > 0) {
				const allZipper = manual_pi_entry.every(
					(item) => item.is_zipper === true
				);
				const allNonZipper = manual_pi_entry.every(
					(item) => item.is_zipper === false
				);

				if (allZipper) {
					setZipperAll(true);
				} else if (allNonZipper) {
					setZipperAll(false);
				} else {
					setZipperAll(null);
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleThreadOrderInfoEntryRemove = (index) => {
		if (getValues(`manual_pi_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`manual_pi_entry[${index}].uuid`),
				itemName: getValues(`manual_pi_entry[${index}].uuid`),
			});
			window['order_info_entry_delete'].showModal();
		}
		threadOrderInfoEntryRemove(index);
	};

	const handleThreadOrderInfoEntryAppend = () => {
		threadOrderInfoEntryAppend({
			order_number: '',
			po: '',
			style: '',
			size: '',
			item: '',
			specification: '',
			quantity: 0,
			unit_price: 0,
			is_zipper: false,
		});
	};
	const onClose = () => reset(MANUAL_PI_NULL);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			const manual_pi_updated_data = {
				...data,
				updated_at: GetDateTime(),
			};

			const manual_pi_updated_promise = await updateData.mutateAsync({
				url: `/commercial/manual-pi/${data?.uuid}`,
				updatedData: manual_pi_updated_data,
				isOnCloseNeeded: false,
			});

			const manual_pi_entries_updated_promise = data.manual_pi_entry.map(
				async (item) => {
					if (item.uuid === undefined) {
						item.manual_pi_uuid = manual_pi_uuid;
						item.created_at = GetDateTime();
						item.uuid = nanoid();
						return await postData.mutateAsync({
							url: '/commercial/manual-pi-entry',
							newData: item,
							isOnCloseNeeded: false,
						});
					} else {
						item.updated_at = GetDateTime();
						const updatedData = {
							...item,
							updated_at: GetDateTime(),
						};
						return await updateData.mutateAsync({
							url: `/commercial/manual-pi-entry/${item.uuid}`,
							updatedData,
							isOnCloseNeeded: false,
						});
					}
				}
			);

			try {
				await Promise.all([
					manual_pi_updated_promise,
					...manual_pi_entries_updated_promise,
				])
					.then(() => reset(MANUAL_PI_NULL))
					.then(() => {
						invalidateCommercialManualPI();
						navigate(`/commercial/manual-pi/${data?.uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		const new_manual_pi_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		// Create Shade Recipe description
		const manual_pi_data = {
			...data,
			uuid: new_manual_pi_uuid,
			created_at,
			created_by,
		};

		// delete shade_recipe field from data to be sent
		delete manual_pi_data['manual_pi_entry'];

		const manual_pi_promise = await postData.mutateAsync({
			url: '/commercial/manual-pi',
			newData: manual_pi_data,
			isOnCloseNeeded: false,
		});

		// Create Shade Recipe entries
		const order_info_entries = [...data.manual_pi_entry].map((item) => ({
			...item,
			manual_pi_uuid: new_manual_pi_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
		}));

		const manual_pi_entries_promise = [
			...order_info_entries.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/commercial/manual-pi-entry',
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		try {
			await Promise.all([manual_pi_promise, ...manual_pi_entries_promise])
				.then(() => reset(MANUAL_PI_NULL))
				.then(() => {
					invalidateCommercialManualPI();
					navigate(`/commercial/manual-pi/${new_manual_pi_uuid}`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	// Check if uuid is valuuid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`manual_pi_entry[${index}]`);
			threadOrderInfoEntryAppend({ ...item, uuid: undefined });
		},
		[getValues, threadOrderInfoEntryAppend]
	);

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
		ENTER: 'enter',
	};

	const handlers = {
		NEW_ROW: handleThreadOrderInfoEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(threadOrderInfoEntryField.length - 1),
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const headerButtons = [
		<div className='flex items-center gap-2'>
			<label className='text-sm'>Zipper All</label>
			<SwitchToggle
				checked={zipperAll}
				onChange={() => setZipperAll(!zipperAll)}
			/>
		</div>,
	];

	return (
		<div>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'>
					<Header
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
							isUpdate,
						}}
					/>

					<DynamicFormSpreadSheet
						title='Details'
						fieldArrayName='manual_pi_entry'
						handelAppend={handleThreadOrderInfoEntryAppend}
						handleRemove={handleThreadOrderInfoEntryRemove}
						headerButtons={headerButtons}
						columnsDefs={[
							{
								header: 'O/N',
								accessorKey: 'order_number',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Po',
								accessorKey: 'po',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Style',
								accessorKey: 'style',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Size',
								accessorKey: 'size',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Item',
								accessorKey: 'item',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Specification',
								accessorKey: 'specification',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Quantity',
								accessorKey: 'quantity',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Unit Price',
								accessorKey: 'unit_price',
								type: 'text',
								readOnly: false,
							},
							{
								header: 'Zipper',
								accessorKey: 'is_zipper',
								type: 'select',
								options: isZipper,
								readOnly: false,
							},
							// {
							// 	header: 'Count Length',
							// 	accessorKey: 'count_length_uuid',
							// 	type: 'select',
							// 	options: countLength || [],
							// 	readOnly: false,
							// },
							{
								header: 'Actions',
								type: 'action',
							},
						]}
						{...{
							formContext: {
								register,
								watch,
								setValue,
								getValues,
								clearErrors,
								errors,
							},
							fields: threadOrderInfoEntryField,
							append: threadOrderInfoEntryAppend,
							remove: threadOrderInfoEntryRemove,
							update: threadOrderInfoEntryUpdate,
						}}
					/>

					<div className='modal-action'>
						<button
							type='submit'
							className='text-md btn btn-primary btn-block'>
							Save
						</button>
					</div>
				</form>
			</HotKeys>
			<Suspense>
				<DeleteModal
					modalId={'order_info_entry_delete'}
					title={'Order info Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={threadOrderInfoEntryField}
					url={'/commercial/manual-pi-entry'}
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
