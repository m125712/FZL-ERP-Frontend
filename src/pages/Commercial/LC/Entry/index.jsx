import { useFetch, useRHF } from '@/hooks';
import { DynamicField, FormField, ReactSelect, RemoveButton } from '@/ui';
import { useAuth } from '@context/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useCommercialLC, useCommercialLCPIByUUID } from '@/state/Commercial';
import Header from './Header';
import { LC_NULL, LC_SCHEMA } from '@util/Schema';
import { useFieldArray } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { DevTool } from '@hookform/devtools';
import { format } from 'date-fns';
import GetDateTime from '@/util/GetDateTime';
import nanoid from '@/lib/nanoid';
import { Suspense, useEffect, useState } from 'react';
import { UpdateModal } from '@/components/Modal';

export default function Index() {
	const { lc_uuid } = useParams();
	const { url: commercialLcUrl, postData, updateData } = useCommercialLC();
	const { data, invalidateQuery } = useCommercialLCPIByUUID(lc_uuid);

	const { user } = useAuth();
	const navigate = useNavigate();

	const [deletablePi, setDeletablePi] = useState([]);
	const [updateItem, setUpdateItem] = useState({
		itemId: null,
		itemName: null,
	});

	const isUpdate = lc_uuid !== undefined;

	const { value: pi } = useFetch('/other/pi/value/label');

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		watch,
	} = useRHF(LC_SCHEMA, LC_NULL);

	// purchase
	const {
		fields: piFields,
		append: PiAppend,
		remove: PiRemove,
	} = useFieldArray({
		control,
		name: 'pi',
	});

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const handelPiAppend = () => {
		PiAppend({
			lc_uuid,
		});
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
	};

	const handlers = {
		NEW_ROW: handelPiAppend,
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const handleDeletePi = (uuid) => {
		if (!isUpdate || !uuid || deletablePi.includes(uuid)) return;

		setDeletablePi((prev) => [...prev, uuid]);
	};

	// Submit
	const onSubmit = async (data) => {
		const formatDate = (dateString) =>
			dateString ? format(new Date(dateString), 'yyyy-MM-dd') : '';

		const lc_uuid = data.uuid;

		// Update
		if (isUpdate) {
			const updated_at = GetDateTime();
			const lc_updated_data = {
				...data,
				lc_date: formatDate(data?.lc_date),
				payment_date: formatDate(data?.payment_date),
				acceptance_date: formatDate(data?.acceptance_date),
				maturity_date: formatDate(data?.maturity_date),
				handover_date: formatDate(data?.handover_date),
				shipment_date: formatDate(data?.shipment_date),
				expiry_date: formatDate(data?.expiry_date),
				ud_received: data.ud_received ? 1 : 0,
				ud_no: data.ud_no ? 1 : 0,
				problematical: data.problematical ? 1 : 0,
				epz: data.epz ? 1 : 0,
				production_complete: data.production_complete ? 1 : 0,
				lc_cancel: data.lc_cancel ? 1 : 0,
				updated_at,
			};

			// Update LC data
			await updateData.mutateAsync({
				url: `${commercialLcUrl}/${data?.uuid}`,
				updatedData: lc_updated_data,
				isOnCloseNeeded: false,
			});

			// Update Deletable Pi
			if (deletablePi.length > 0) {
				const deletable_pi_promises = deletablePi.map(async (item) => {
					await updateData.mutateAsync({
						url: `/commercial/pi-lc-null/${item}`,
						isOnCloseNeeded: false,
					});
				});

				await Promise.all(deletable_pi_promises)
					.then(() => {
						setDeletablePi([]);
						invalidateQuery();
					})
					.catch((err) => console.log(err));
			}

			// Update Pi Numbers
			const pi_numbers = [...data.pi].map((item) => ({
				...item,
				lc_uuid,
			}));

			const pi_numbers_promise = [
				...pi_numbers.map(
					async (item) =>
						await updateData.mutateAsync({
							url: `/commercial/pi-lc-uuid/${item.uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			await Promise.all(pi_numbers_promise)
				.then(() => reset(LC_NULL))
				.then(() => {
					invalidateQuery();
					navigate(`/commercial/lc/details/${lc_uuid}`);
				})
				.catch((err) => console.log(err));
			return;
		}

		// Add new item
		const new_lc_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		const lc_new_data = {
			...data,
			uuid: new_lc_uuid,
			lc_date: formatDate(data?.lc_date),
			payment_date: formatDate(data?.payment_date),
			acceptance_date: formatDate(data?.acceptance_date),
			maturity_date: formatDate(data?.maturity_date),
			handover_date: formatDate(data?.handover_date),
			shipment_date: formatDate(data?.shipment_date),
			expiry_date: formatDate(data?.expiry_date),
			ud_received: data.ud_received ? 1 : 0,
			ud_no: data.ud_no ? 1 : 0,
			problematical: data.problematical ? 1 : 0,
			epz: data.epz ? 1 : 0,
			production_complete: data.production_complete ? 1 : 0,
			lc_cancel: data.lc_cancel ? 1 : 0,
			created_at,
			created_by,
		};

		// delete pi field from data to be sent
		delete lc_new_data['pi'];

		await postData.mutateAsync({
			url: commercialLcUrl,
			newData: lc_new_data,
			isOnCloseNeeded: false,
		});

		// Update Pi Numbers
		const pi_numbers = [...data.pi].map((item) => ({
			uuid: item.uuid,
			lc_uuid: new_lc_uuid,
		}));

		const pi_numbers_promise = [
			...pi_numbers.map(
				async (item) =>
					await updateData.mutateAsync({
						url: `/commercial/pi-lc-uuid/${item.uuid}`,
						updatedData: item,
						isOnCloseNeeded: false,
					})
			),
		];
		await Promise.all(pi_numbers_promise)
			.then(() => reset(LC_NULL))
			.then(() => {
				navigate(`/commercial/lc/details/${new_lc_uuid}`);
			})
			.catch((err) => console.log(err));
	};

	const handlePIRemove = (index) => {
		if (getValues(`pi[${index}].id`) !== undefined) {
			setUpdateItem({
				itemId: getValues(`pi[${index}].uuid`),
				itemName: getValues(`pi[${index}].id`),
			});
			window['lc_pi_delete'].showModal();
		}

		PiRemove(index);
	};

	return (
		<div>
			<HotKeys {...{ keyMap, handlers }}>
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
							watch,
						}}
					/>

					<DynamicField
						title='Details'
						handelAppend={handelPiAppend}
						tableHead={['PI', 'Action'].map((item) => (
							<th
								key={item}
								scope='col'
								className='text-secondary-content group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide transition duration-300 first:pl-2'>
								{item}
							</th>
						))}>
						{piFields.map((item, index) => (
							<tr key={item.id} className='w-full'>
								<td className={`pl-1 ${rowClass}`}>
									<FormField
										label={`pi[${index}].uuid`}
										title='Material'
										is_title_needed='false'
										errors={errors}>
										<Controller
											name={`pi[${index}].uuid`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Material'
														options={pi}
														value={pi?.find(
															(inItem) =>
																inItem.value ===
																getValues(
																	`pi[${index}].uuid`
																)
														)}
														onChange={(e) => {
															handleDeletePi(
																getValues(
																	`pi[${index}].uuid`
																)
															);
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

								<td
									className={`w-16 border-l-4 border-l-primary ${rowClass}`}>
									<RemoveButton
										onClick={() => {
											handlePIRemove(index);
										}}
										showButton={piFields.length > 1}
									/>
								</td>
							</tr>
						))}
					</DynamicField>

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
				<UpdateModal
					modalId={'lc_pi_delete'}
					title={'PI'}
					updateItem={updateItem}
					setUpdateItem={setUpdateItem}
					url={`/commercial/pi-lc-null`}
					updateData={updateData}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</div>
	);
}
