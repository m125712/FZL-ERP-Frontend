import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useDeliveryReturnQuantity,
	useDeliveryReturnQuantityByUUID,
} from '@/state/Delivery';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { CheckBox, FormField, Input, ReactSelect } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';
import {
	RETURN_QUANTITY_UPDATE_NULL,
	RETURN_QUANTITY_UPDATE_SCHEMA,
} from '@/util/Schema';

export default function VehicleForm({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { data, url, updateData } = useDeliveryReturnQuantityByUUID(
		update?.uuid
	);

	const { invalidateQuery } = useDeliveryReturnQuantity();

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
	} = useRHF(RETURN_QUANTITY_UPDATE_SCHEMA, RETURN_QUANTITY_UPDATE_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(RETURN_QUANTITY_UPDATE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (update?.uuid !== null && update?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url,
				uuid: update?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={'Update Order'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input
				label='fresh_quantity'
				title='Fresh Quantity'
				{...{ register, errors }}
			/>

			<Input
				label='repair_quantity'
				title='Repair Quantity'
				{...{ register, errors }}
			/>

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
