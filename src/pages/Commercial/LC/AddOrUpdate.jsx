import { AddModal } from '@/components/Modal';
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import { CheckBox, FormField, Input, ReactSelect, Textarea } from '@/ui';
import { DateInput } from '@/ui/Core';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { LC_NULL, LC_SCHEMA } from '@util/Schema';
import { format } from 'date-fns';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Section = ({ title, children }) => (
	<div className='flex flex-col gap-1 rounded-md bg-primary/20 p-2'>
		<span className='ml-1 text-xl font-bold'>{title}</span>
		<div className='text-secondary-content flex flex-col gap-1 md:flex-row'>
			{children}
		</div>
	</div>
);

// UPDATE IS NOT WORKING
export default function Index({
	modalId = '',
	setLc,
	updateLc = {
		id: null,
	},
	setUpdateLc,
}) {
	const { user } = useAuth();
	const isUpdate = updateLc?.id !== null;

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

	const onClose = () => {
		setUpdateLc((prev) => ({
			...prev,
			id: null,
		}));
		reset(LC_NULL);
		window[modalId].close();
	};

	useFetchForRhfReset(`/lc/${updateLc?.id}`, updateLc?.id, reset);
	const { value: party } = useFetch('/party/value/label');

	const [isProblematic, setIsProblematic] = useState(
		typeof getValues('problematical') !== 'boolean' &&
			getValues('problematical') === 1
			? true
			: false
	);
	const [isEpz, setIsEpz] = useState(
		typeof getValues('epz') !== 'boolean' && getValues('epz') === 1
			? true
			: false
	);
	const [isProdComplete, setIsProdComplete] = useState(
		typeof getValues('production_complete') !== 'boolean' &&
			getValues('production_complete') === 1
			? true
			: false
	);
	const [isLcCancel, setIsLcCancel] = useState(
		typeof getValues('lc_cancel') !== 'boolean' &&
			getValues('lc_cancel') === 1
			? true
			: false
	);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			const lc_data = {
				...data,
				updated_at: GetDateTime(),
			};
			await useUpdateFunc({
				uri: `/lc/${updateLc?.id}/${data?.lc_number}`,
				itemId: data.id,
				data: data,
				updatedData: lc_data,
				setItems: setLc,
				onClose: onClose,
			}).catch((err) => console.error(`Error updating data: ${err}`));

			return;
		}

		const formatDate = (dateString) =>
			dateString ? format(new Date(dateString), 'yyyy-MM-dd') : '';

		// Add
		const updatedData = {
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
			problematical: isProblematic ? 1 : 0,
			epz: isEpz ? 1 : 0,
			production_complete: isProdComplete ? 1 : 0,
			lc_cancel: isLcCancel ? 1 : 0,
			created_at: GetDateTime(),
			issued_by: user.id,
		};

		await usePostFunc({
			uri: '/lc',
			data: updatedData,
			setItems: setLc,
			onClose: onClose,
		});
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const atSight = [
		{ value: null, label: '---' },
		{ value: 0, label: 'At Sight / 0 Day' },
		{ value: 30, label: '30' },
		{ value: 60, label: '60' },
		{ value: 90, label: '90' },
		{ value: 120, label: '120' },
		{ value: 150, label: '150' },
		{ value: 180, label: '180' },
	];

	return (
		<AddModal
			id={modalId}
			title={updateLc?.id !== null ? 'Update Lc' : 'Lc'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			<div className='flex flex-col gap-2'>
				<div className='flex gap-1 overflow-auto text-sm md:justify-end'>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='Problematic'
							label='problematical'
							text='text-primary-content'
							defaultChecked={isProblematic}
							onChange={(e) => setIsProblematic(e.target.checked)}
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='EPZ'
							label='epz'
							text='text-primary-content'
							defaultChecked={isEpz}
							onChange={(e) => setIsEpz(e.target.checked)}
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='Production Complete'
							label='production_complete'
							text='text-primary-content'
							defaultChecked={isProdComplete}
							onChange={(e) =>
								setIsProdComplete(e.target.checked)
							}
							{...{ register, errors }}
						/>
					</div>
					<div className='rounded-md bg-primary px-1'>
						<CheckBox
							title='Cancelled'
							label='lc_cancel'
							text='text-primary-content'
							defaultChecked={isLcCancel}
							onChange={(e) => setIsLcCancel(e.target.checked)}
							{...{ register, errors }}
						/>
					</div>
				</div>
				<Section title='File Details'>
					<FormField label='party_id' title='Party' errors={errors}>
						<Controller
							name={'party_id'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Party'
										options={party}
										value={party?.find(
											(item) =>
												item.value ===
												getValues('party_id')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>
					<Input label='file_no' {...{ register, errors }} />
					<Input
						label='lc_number'
						disabled={updateLc?.id != null}
						{...{ register, errors }}
					/>
					<DateInput
						label='lc_date'
						Controller={Controller}
						control={control}
						selected={watch('lc_date')}
					/>
				</Section>
				<Section title='Commercial Details'>
					<Input
						label='commercial_executive'
						{...{ register, errors }}
					/>
					<Input label='party_bank' {...{ register, errors }} />
					<DateInput
						label='shipment_date'
						Controller={Controller}
						control={control}
						selected={watch('shipment_date')}
					/>{' '}
					<DateInput
						label='expiry_date'
						Controller={Controller}
						control={control}
						selected={watch('expiry_date')}
					/>
				</Section>
				<Section title='Progression'>
					<Input
						label='ldbc_fdbc'
						title='LDBC/FDBC'
						{...{ register, errors }}
					/>
					<DateInput
						label='handover_date'
						Controller={Controller}
						control={control}
						selected={watch('handover_date')}
					/>
					<DateInput
						label='acceptance_date'
						Controller={Controller}
						control={control}
						selected={watch('acceptance_date')}
					/>
					<DateInput
						label='maturity_date'
						Controller={Controller}
						control={control}
						selected={watch('maturity_date')}
					/>
					<DateInput
						label='payment_date'
						Controller={Controller}
						control={control}
						selected={watch('payment_date')}
					/>
					<Input label='payment_value' {...{ register, errors }} />
				</Section>
				<Section title='Others'>
					<Input label='ud_no' {...{ register, errors }} />
					<DateInput
						label='ud_received'
						Controller={Controller}
						control={control}
						selected={watch('ud_received')}
					/>
					<FormField
						label='at_sight'
						title='Payment Rec.'
						errors={errors}>
						<Controller
							name='at_sight'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Payment Receiving'
										options={atSight}
										value={atSight?.find(
											(item) =>
												item.value ==
												getValues('at_sight')
										)}
										onChange={(e) => {
											const value = parseInt(e.value);
											onChange(value);
										}}
									/>
								);
							}}
						/>
					</FormField>
					<DateInput
						label='amd_date'
						Controller={Controller}
						control={control}
						selected={watch('amd_date')}
					/>
					<Input label='amd_count' {...{ register, errors }} />
					<Textarea label='remarks' {...{ register, errors }} />
				</Section>
			</div>
		</AddModal>
	);
}
