import { useEffect } from 'react';
import { useOtherMarketing } from '@/state/Other';
import {
	useMaterialBooking,
	useMaterialBookingByUUID,
	useMaterialInfo,
} from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInputSelect, ReactSelect, Textarea } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import { MATERIAL_BOOKING_NULL, MATERIAL_BOOKING_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateMaterialDetails = {
		uuid: null,
	},
	setUpdateMaterialDetails,
}) {
	const { url, updateData } = useMaterialBooking();
	const { data } = useMaterialBookingByUUID(updateMaterialDetails?.uuid);
	const { data: marketing } = useOtherMarketing();
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		context,
	} = useRHF(
		{
			...MATERIAL_BOOKING_SCHEMA,
			quantity: MATERIAL_BOOKING_SCHEMA.quantity.max(
				updateMaterialDetails?.max_quantity,
				'Beyond Max Quantity'
			),
		},
		MATERIAL_BOOKING_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(MATERIAL_BOOKING_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialDetails?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateMaterialDetails?.uuid}`,
				uuid: updateMaterialDetails?.uuid,
				updatedData,
				onClose,
			});

			invalidateMaterialInfo();

			return;
		}

		// invalidateMaterialByDyes();
	};

	const selectUnit = [
		{ label: 'kg', value: 'kg' },
		{ label: 'Litre', value: 'ltr' },
		{ label: 'Meter', value: 'mtr' },
		{ label: 'Piece', value: 'pcs' },
		{ label: 'Set', value: 'set' },
		{ label: 'Roll', value: 'roll' },
		{ label: 'Gallon', value: 'gallon' },
		{ label: 'Lbs', value: 'lbs' },
	];

	return (
		<AddModal
			id={modalId}
			title={'Update Booking'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='marketing_uuid' title='Marketing' errors={errors}>
				<Controller
					name={'marketing_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Material Type'
								options={marketing}
								value={marketing?.filter(
									(item) =>
										item.value ===
										getValues('marketing_uuid')
								)}
								onChange={(e) => onChange(e.value)}
								// isDisabled={
								// 	updateMaterialDetails?.uuid !== null
								// }
							/>
						);
					}}
				/>
			</FormField>
			<JoinInputSelect
				//defaultUnitValue='kg'
				label='quantity'
				join='unit'
				sub_label={`Max: ${updateMaterialDetails?.max_quantity}`}
				option={selectUnit}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
