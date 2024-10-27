import { useAuth } from '@/context/auth';
import { useDeliveryVehicle } from '@/state/Delivery';
import { DevTool } from '@hookform/devtools';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { CheckBox, FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import GetDateTime from '@/util/GetDateTime';
import {

	DELIVERY_VEHICLE_NULL,
	DELIVERY_VEHICLE_SCHEMA,
} from '@/util/Schema';

export default function VehicleForm({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { url, updateData, postData } = useDeliveryVehicle();
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		watch,
		setValue,
	} = useRHF(DELIVERY_VEHICLE_SCHEMA, DELIVERY_VEHICLE_NULL);

	useFetchForRhfReset(`${url}/${update?.uuid}`, update?.uuid, reset);
	const vehicleTypes = [
		{ value: 'truck', label: 'Truck' },
		{ value: 'bike', label: 'Bike' },
		{ value: 'cng', label: 'CNG' },
	];

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(DELIVERY_VEHICLE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (update?.uuid !== null && update?.uuid !== undefined) {
			const updatedData = {
				...data,
				active: data.active ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${update?.uuid}`,
				uuid: update?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		const newData = {
			...data,
			uuid: nanoid(),
			active: data.active ? 1 : 0,
			type: data.type,
			name: data.name,
			number: data.number,
			driver_name: data.driver_name,
			created_by: user?.uuid,
			created_at: GetDateTime(),
			active: data.active ? 1 : 0,
		};

		await postData.mutateAsync({
			url,
			newData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={update?.uuid !== null ? 'Update Vehicle' : 'Add Vehicle'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<CheckBox
				label='active'
				title='Active'
				{...{ register, errors }}
				checked={Boolean(watch('active'))}
				onChange={(e) => setValue('active', e.target.checked)}
			/>
			<FormField label='type' title='Vehicle Type' errors={errors}>
				<Controller
					name='type'
					control={control}
					render={({ field }) => (
						<ReactSelect
							options={vehicleTypes}
							value={vehicleTypes.find(
								(option) => option.value === field.value
							)}
							onChange={(option) => field.onChange(option.value)}
							placeholder='Select Vehicle Type'
						/>
					)}
				/>
			</FormField>

			<Input label='name' title='Name' {...{ register, errors }} />

			<Input label='number' title='Number' {...{ register, errors }} />

			<Input
				label='driver_name'
				title='Driver Name'
				{...{ register, errors }}
			/>

			<Input label='remarks' title='Remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
