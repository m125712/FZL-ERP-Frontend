import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useCommercialManualPI,
	useCommercialManualPIDetails,
} from '@/state/Commercial';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import HandsonSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet'; //! why it is must??

import SwitchToggle from '@/ui/Others/SwitchToggle';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { MANUAL_PI_NULL, MANUAL_PI_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';
import ManualPiSpreadsheet from './spreadsheets/manual-pi-spreadsheet';
import ThreadManualPiSpreadsheet from './spreadsheets/thread-manual-pi-spreadsheet';

export default function Index() {
	const { invalidateQuery: invalidateCommercialManualPI } =
		useCommercialManualPI();
	const { manual_pi_uuid } = useParams();
	const { data, updateData, postData, deleteData } =
		useCommercialManualPIDetails(manual_pi_uuid);
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
		formState,
		clearErrors,
		context: form,
	} = useRHF(MANUAL_PI_SCHEMA, MANUAL_PI_NULL);

	useEffect(() => {
		manual_pi_uuid !== undefined
			? (document.title = `Manual PI: Update ${manual_pi_uuid}`)
			: (document.title = 'Manual PI: Entry');
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
		fields: zipperEntryField,
		append: zipperEntryAppend,
		remove: zipperEntryRemove,
		update: zipperEntryUpdate,
	} = useFieldArray({
		control,
		name: 'manual_zipper_pi_entry',
	});
	const {
		fields: threadEntryField,
		append: threadEntryAppend,
		remove: threadEntryRemove,
		update: threadEntryUpdate,
	} = useFieldArray({
		control,
		name: 'manual_thread_pi_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleZipperEntryRemove = (index) => {
		if (getValues(`manual_zipper_pi_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`manual_zipper_pi_entry[${index}].uuid`),
				itemName: getValues(`manual_zipper_pi_entry[${index}].uuid`),
			});
			window['order_info_entry_delete'].showModal();
		}
		zipperEntryRemove(index);
	};

	const handleZipperEntryAppend = () => {
		zipperEntryAppend({
			order_number: '',
			po: '',
			style: '',
			size: '',
			item: '',
			specification: '',
			quantity: 0,
			unit_price: 0,
		});
	};
	const handleThreadEntryRemove = (index) => {
		if (getValues(`manual_thread_pi_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`manual_thread_pi_entry[${index}].uuid`),
				itemName: getValues(`manual_thread_pi_entry[${index}].uuid`),
			});
			window['order_info_entry_delete'].showModal();
		}
		threadEntryRemove(index);
	};

	const handleThreadEntryAppend = () => {
		threadEntryAppend({
			order_number: '',
			po: '',
			style: '',
			size: '',
			item: '',
			specification: '',
			quantity: 0,
			unit_price: 0,
		});
	};

	// Submit
	const onSubmit = async (data) => {
		const manual_pi_entry = data?.manual_zipper_pi_entry.concat(
			data?.manual_thread_pi_entry
		);
		// Update
		if (isUpdate) {
			const manual_pi_updated_data = {
				...data,
				updated_by: user?.uuid,
				updated_at: GetDateTime(),
			};

			const manual_pi_updated_promise = await updateData.mutateAsync({
				url: `/commercial/manual-pi/${data?.uuid}`,
				updatedData: manual_pi_updated_data,
				isOnCloseNeeded: false,
			});

			const manual_pi_entries_updated_promise = manual_pi_entry.map(
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
							updated_by: user?.uuid,
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
		const order_info_entries = manual_pi_entry.map((item) => ({
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

	const handleZipperCopy = (index) => {
		const field = form.watch('manual_zipper_pi_entry')[index];

		// const length = form.watch('manual_pi_entry').length;
		// let newIndex;
		// if (length > 0) {
		// 	// Get the index value of the previous row
		// 	const previousIndex = form.getValues(
		// 		`manual_pi_entry.${length - 1}.index`
		// 	);
		// 	newIndex = previousIndex ? previousIndex + 1 : length + 1;
		// } else {
		// 	// For the first row, set index to 1
		// 	newIndex = length + 1;
		// }

		zipperEntryAppend({
			// index: newIndex,
			order_number: field.order_number,
			po: field.po,
			style: field.style,
			size: field.size,
			item: field.item,
			specification: field.specification,
			quantity: field.quantity,
			unit_price: field.unit_price,
			is_zipper: field.is_zipper,
		});
	};
	const handleThreadCopy = (index) => {
		const field = form.watch('manual_thread_pi_entry')[index];

		// const length = form.watch('manual_pi_entry').length;
		// let newIndex;
		// if (length > 0) {
		// 	// Get the index value of the previous row
		// 	const previousIndex = form.getValues(
		// 		`manual_pi_entry.${length - 1}.index`
		// 	);
		// 	newIndex = previousIndex ? previousIndex + 1 : length + 1;
		// } else {
		// 	// For the first row, set index to 1
		// 	newIndex = length + 1;
		// }

		threadEntryAppend({
			// index: newIndex,
			order_number: field.order_number,
			po: field.po,
			style: field.style,
			size: field.size,
			item: field.item,
			specification: field.specification,
			quantity: field.quantity,
			unit_price: field.unit_price,
			is_zipper: field.is_zipper,
		});
	};

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
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

				<ManualPiSpreadsheet
					title='Zipper Details'
					extraHeader={<div>asdasd</div>}
					form={form}
					fieldName='manual_zipper_pi_entry'
					handleCopy={handleZipperCopy}
					handleAdd={handleZipperEntryAppend}
					handleRemove={handleZipperEntryRemove}
				/>
				<ThreadManualPiSpreadsheet
					title='Thread Details'
					form={form}
					fieldName='manual_thread_pi_entry'
					handleCopy={handleThreadCopy}
					handleAdd={handleThreadEntryAppend}
					handleRemove={handleThreadEntryRemove}
				/>

				<Footer buttonClassName='!btn-primary' />
			</form>
			<Suspense>
				<DeleteModal
					modalId={'order_info_entry_delete'}
					title={'Order info Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={zipperEntryField}
					url={'/commercial/manual-pi-entry'}
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
