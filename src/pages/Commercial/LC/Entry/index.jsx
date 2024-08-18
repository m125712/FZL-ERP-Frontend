import { useFetch, useRHF } from '@/hooks';
import { DynamicField, FormField, ReactSelect, RemoveButton } from '@/ui';
import { useAuth } from '@context/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useCommercialLC } from '@/state/Commercial';
import Header from './Header';
import { LC_NULL, LC_SCHEMA } from '@util/Schema';
import { useFetchForRhfReset } from '@/hooks';
import { useFieldArray } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { DevTool } from '@hookform/devtools';
import { format } from 'date-fns';
import GetDateTime from '@/util/GetDateTime';
import nanoid from '@/lib/nanoid';

export default function Index() {
	const {
		url: commercialLcUrl,
		postData,
		updateData,
		deleteData,
	} = useCommercialLC();
	const { lc_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const isUpdate = lc_uuid !== undefined;

	const { value: pi } = useFetch('/other/pi/value/label');

	console.log({
		pi,
	});

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

	console.log({
		errors,
	});

	// purchase
	const {
		fields: piFields,
		append: PiAppend,
		remove: PiRemove,
	} = useFieldArray({
		control,
		name: 'pi',
	});

	useFetchForRhfReset(`/commercial/lc/${lc_uuid}`, lc_uuid, reset);

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const handelPiAppend = () => {
		PiAppend({
			uuid: '',
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

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			return;
		}

		const formatDate = (dateString) =>
			dateString ? format(new Date(dateString), 'yyyy-MM-dd') : '';

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
			...item,
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

	return (
		<div className='container mx-auto mt-4 px-2 pb-2 md:px-4'>
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
							isUpdate,
						}}
					/>

					<DynamicField
						title='Details'
						handelAppend={handelPiAppend}
						tableHead={['PI', 'Action'].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'>
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
																inItem.value ==
																getValues(
																	`pi[${index}].uuid`
																)
														)}
														onChange={(e) => {
															onChange(e.value);
														}}
														menuPortalTarget={
															document.body
														}
														// isDisabled={
														// 	purchase_description_uuid !==
														// 	undefined
														// }
													/>
												);
											}}
										/>
									</FormField>
								</td>

								<td
									className={`w-16 border-l-4 border-l-primary ${rowClass}`}>
									<RemoveButton
										onClick={() => PiRemove(index)}
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

			<DevTool control={control} placement='top-left' />
		</div>
	);
}
