import { Suspense, useEffect, useState } from 'react';
import {
	useCommercialPI,
	useCommercialPIByOrderInfo,
	useCommercialPIDetailsByUUID,
	useCommercialPIEntry,
	useCommercialPThreadByOrderInfo,
} from '@/state/Commercial';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import SubmitButton from '@/ui/Others/Button/SubmitButton';

import nanoid from '@/lib/nanoid';
import { PI_NULL, PI_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';
import Thread from './Thread';
import Zipper from './Zipper';

export default function Index() {
	const { pi_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const { url: commercialPiEntryUrl } = useCommercialPIEntry();
	const {
		url: commercialPiUrl,
		postData,
		updateData,
		deleteData,
	} = useCommercialPI();

	const isUpdate = pi_uuid !== undefined;

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
	} = useRHF(PI_SCHEMA, PI_NULL);

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const { data: pi_details_by_uuid } = useCommercialPIDetailsByUUID(pi_uuid);

	useEffect(() => {
		if (isUpdate) {
			reset(pi_details_by_uuid);
		}
	}, [pi_details_by_uuid, isUpdate]);

	useEffect(() => {
		if (!isUpdate) return;
		if (watch('order_info_uuids') === null) return;

		const updatedPiEntries = getValues('pi_cash_entry').map((item) => {
			if (!watch('order_info_uuids').includes(item.order_info_uuid)) {
				return {
					...item,
					isDeletable: true,
				};
			}

			return item;
		});

		setValue('pi_cash_entry', updatedPiEntries);
	}, [isUpdate, watch('order_info_uuids')]);

	// Fetch zipper entries by order info ids
	const { data: pi_cash_entry_by_order_info } = useCommercialPIByOrderInfo(
		isUpdate
			? `${watch('new_order_info_uuids')?.join(',')}`
			: `${watch('order_info_uuids')?.join(',')}`,
		watch('party_uuid'),
		watch('marketing_uuid'),
		isUpdate ? 'is_update=true' : ''
	);

	useEffect(() => {
		if (isUpdate) {
			if (pi_cash_entry_by_order_info?.pi_cash_entry?.length > 0) {
				setValue(
					'new_pi_cash_entry',
					pi_cash_entry_by_order_info?.pi_cash_entry
				);
			} else {
				setValue('new_pi_cash_entry', []);
			}
		} else {
			if (pi_cash_entry_by_order_info?.pi_cash_entry?.length > 0) {
				setValue(
					'pi_cash_entry',
					pi_cash_entry_by_order_info?.pi_cash_entry
				);
			} else {
				setValue('pi_cash_entry', []);
			}
		}
	}, [isUpdate, pi_cash_entry_by_order_info]);

	// Fetch thread entries by thread order info ids
	const { data: pi_cash_entry_thread_by_order_info } =
		useCommercialPThreadByOrderInfo(
			isUpdate
				? `${watch('new_order_info_thread_uuids')?.join(',')}`
				: `${watch('thread_order_info_uuids')?.join(',')}`,
			watch('party_uuid'),
			watch('marketing_uuid'),
			isUpdate ? 'is_update=true' : ''
		);

	useEffect(() => {
		if (isUpdate) {
			if (
				pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
					?.length > 0
			) {
				setValue(
					'new_pi_cash_entry_thread',
					pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
				);
			} else {
				setValue('new_pi_cash_entry_thread', []);
			}
		} else {
			if (
				pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
					?.length > 0
			) {
				setValue(
					'pi_cash_entry_thread',
					pi_cash_entry_thread_by_order_info?.pi_cash_entry_thread
				);
			} else {
				setValue('pi_cash_entry_thread', []);
			}
		}
	}, [isUpdate, pi_cash_entry_thread_by_order_info]);

	// Submit
	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			const commercialPiData = {
				order_info_uuids: JSON.stringify(
					data?.order_info_uuids?.concat(data?.new_order_info_uuids)
				),
				thread_order_info_uuids: JSON.stringify(
					data?.thread_order_info_uuids?.concat(
						data?.new_order_info_thread_uuids
					)
				),
				bank_uuid: data?.bank_uuid,
				validity: data?.validity,
				payment: data?.payment,
				remarks: data?.remarks,
				weight: data?.weight,
				updated_at: GetDateTime(),
			};

			// pi entry update
			let updatedableCommercialPiEntryPromises = data.pi_cash_entry
				.filter(
					(item) => item.pi_cash_quantity > 0 && !item.isDeletable
				)
				.map(async (item) => {
					if (item.uuid && item.pi_cash_quantity >= 0) {
						const updatedData = {
							pi_cash_quantity: item.pi_cash_quantity,
							is_checked: item.is_checked,
							updated_at: GetDateTime(),
						};

						return updateData.mutateAsync({
							url: `${commercialPiEntryUrl}/${item?.uuid}`,
							updatedData: updatedData,
							uuid: item.uuid,
							isOnCloseNeeded: false,
						});
					}
					return null;
				});

			// pi entry delete
			let deleteableCommercialPiEntryPromises = data.pi_cash_entry
				.filter((item) => item.isDeletable)
				.map(async (item) =>
					deleteData.mutateAsync({
						url: `${commercialPiEntryUrl}/${item?.uuid}`,
						isOnCloseNeeded: false,
					})
				);

			// pi entry new
			const newPiEntryData =
				data?.new_pi_cash_entry?.length > 0
					? [...data?.new_pi_cash_entry]
							.filter(
								(item) => item.is_checked && item.quantity > 0
							)
							.map((item) => ({
								...item,
								uuid: nanoid(),
								is_checked: true,
								sfg_uuid: item?.sfg_uuid,
								pi_cash_quantity: item?.pi_cash_quantity,
								pi_cash_uuid: data.uuid,
								created_at: GetDateTime(),
								remarks: item?.remarks || null,
							}))
					: [];

			const newPiEntryPromises = newPiEntryData.map((item) =>
				postData.mutateAsync({
					url: commercialPiEntryUrl,
					newData: item,
					isOnCloseNeeded: false,
				})
			);

			// pi thread entry update
			let updatedableCommercialPiEntryThreadPromises =
				data.pi_cash_entry_thread
					.filter(
						(item) => item.pi_cash_quantity > 0 && !item.isDeletable
					)
					.map(async (item) => {
						if (item.uuid && item.pi_cash_quantity >= 0) {
							const updatedData = {
								pi_cash_quantity: item.pi_cash_quantity,
								is_checked: item.is_checked,
								updated_at: GetDateTime(),
							};

							return updateData.mutateAsync({
								url: `${commercialPiEntryUrl}/${item?.uuid}`,
								updatedData: updatedData,
								uuid: item.uuid,
								isOnCloseNeeded: false,
							});
						}
						return null;
					});

			// pi thread entry delete
			let deleteableCommercialPiEntryThreadPromises =
				data.pi_cash_entry_thread
					.filter((item) => item.isDeletable)
					.map(async (item) =>
						deleteData.mutateAsync({
							url: `${commercialPiEntryUrl}/${item?.uuid}`,
							isOnCloseNeeded: false,
						})
					);

			// pi thread entry new
			const newPiEntryThreadData =
				data?.new_pi_cash_entry_thread?.length > 0
					? [...data?.new_pi_cash_entry_thread]
							.filter(
								(item) => item.is_checked && item.quantity > 0
							)
							.map((item) => ({
								...item,
								uuid: nanoid(),
								is_checked: true,
								pi_cash_quantity: item?.pi_cash_quantity,
								pi_cash_uuid: data.uuid,
								created_at: GetDateTime(),
								remarks: item?.remarks || null,
							}))
					: [];

			const newPiEntryThreadPromises = newPiEntryThreadData.map((item) =>
				postData.mutateAsync({
					url: commercialPiEntryUrl,
					newData: item,
					isOnCloseNeeded: false,
				})
			);

			try {
				const commercialPiPromise = await updateData.mutateAsync({
					url: `/commercial/pi-cash/${data?.uuid}`,
					updatedData: commercialPiData,
					uuid: data.uuid,
					isOnCloseNeeded: false,
				});

				const updatedId = commercialPiPromise?.data?.[0]?.updatedId;

				await Promise.all([
					...updatedableCommercialPiEntryPromises,
					...newPiEntryPromises,
					...deleteableCommercialPiEntryPromises,
					...updatedableCommercialPiEntryThreadPromises,
					...newPiEntryThreadPromises,
					...deleteableCommercialPiEntryThreadPromises,
				])
					.then(() => reset(Object.assign({}, PI_NULL)))
					.then(() => {
						navigate(`/commercial/pi/${updatedId}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		var new_pi_uuid = nanoid();
		const created_at = GetDateTime();

		const commercialPiData = {
			...data,
			uuid: new_pi_uuid,
			order_info_uuids: JSON.stringify(data?.order_info_uuids),
			thread_order_info_uuids: JSON.stringify(
				data?.thread_order_info_uuids
			),
			created_at,
			created_by: user.uuid,
			is_pi: 1,
		};

		delete commercialPiData['is_all_checked'];
		delete commercialPiData['is_all_checked_thread'];
		delete commercialPiData['pi_cash_entry'];
		delete commercialPiData['pi_cash_entry_thread'];
		delete commercialPiData['new_pi_cash_entry_thread'];
		delete commercialPiData['new_pi_cash_entry'];
		delete commercialPiData['new_order_info_thread_uuids'];
		delete commercialPiData['new_order_info_uuids'];

		const commercialPiEntryData = [...data.pi_cash_entry]
			.filter((item) => item.is_checked && item.quantity > 0)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				is_checked: true,
				sfg_uuid: item?.sfg_uuid,
				pi_cash_quantity: item?.pi_cash_quantity,
				pi_cash_uuid: new_pi_uuid,
				created_at,
				remarks: item?.remarks || null,
			}));

		const commercialPiThreadEntryData = [...data.pi_cash_entry_thread]
			.filter((item) => item.is_checked && item.quantity > 0)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				is_checked: true,
				sfg_uuid: item?.sfg_uuid,
				pi_cash_quantity: item?.pi_cash_quantity,
				pi_cash_uuid: new_pi_uuid,
				created_at,
				remarks: item?.remarks || null,
			}));

		if (
			commercialPiEntryData.length === 0 &&
			commercialPiThreadEntryData.length === 0
		) {
			alert('Select at least one item to proceed.');
		} else {
			// create new /commercial/pi
			await postData.mutateAsync({
				url: commercialPiUrl,
				newData: commercialPiData,
				isOnCloseNeeded: false,
			});

			// create new /commercial/pi-entry
			const commercial_pi_cash_entry_promises = commercialPiEntryData.map(
				(item) =>
					postData.mutateAsync({
						url: commercialPiEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
			);

			// create new /commercial/pi-entry-thread
			const commercial_pi_cash_entry_thread_promises =
				commercialPiThreadEntryData.map((item) =>
					postData.mutateAsync({
						url: commercialPiEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
				);

			try {
				await Promise.all([
					...commercial_pi_cash_entry_promises,
					...commercial_pi_cash_entry_thread_promises,
				])
					.then(() => reset(Object.assign({}, PI_NULL)))
					.then(() => {
						navigate(`/commercial/pi`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
		}
	};

	// dynamic fields
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'pi_cash_entry',
	});

	const { fields: newOrderEntryField } = useFieldArray({
		control,
		name: 'new_pi_cash_entry',
	});

	const { fields: threadEntryField } = useFieldArray({
		control,
		name: 'pi_cash_entry_thread',
	});

	const { fields: newThreadEntryField } = useFieldArray({
		control,
		name: 'new_pi_cash_entry_thread',
	});

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

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
						watch,
					}}
				/>

				{/* ZIPPER */}
				<Zipper
					{...{
						watch,
						getValues,
						control,
						errors,
						isUpdate,
						setValue,
						register,
						errors,
						orderEntryField,
						newOrderEntryField,
					}}
				/>

				{/* THREAD */}
				<Thread
					{...{
						watch,
						getValues,
						control,
						errors,
						isUpdate,
						setValue,
						register,
						errors,
						threadEntryField,
						newThreadEntryField,
					}}
				/>

				<div className='modal-action'>
					<SubmitButton />
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId={'pi_cash_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={orderEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
