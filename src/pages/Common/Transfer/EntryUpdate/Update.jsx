import { useDyeingTransfer } from '@/state/Dyeing';
import { useMetalTMProduction } from '@/state/Metal';
import {
	useNylonMFProduction,
	useNylonPlasticFinishingProduction,
} from '@/state/Nylon';
import { useVislonTMP } from '@/state/Vislon';
import { DevTool } from '@hookform/devtools';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	UPDATE_DYEING_TRANSFER_NULL,
	UPDATE_DYEING_TRANSFER_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTransfer = {
		uuid: null,
	},
	setUpdateTransfer,
}) {
	const { url, updateData } = useDyeingTransfer();
	const { invalidateQuery: invalidateNylonMFProduction } =
		useNylonMFProduction();
	const { invalidateQuery: invalidateNylonPFProduction } =
		useNylonPlasticFinishingProduction();
	const { invalidateQuery: invalidateMetalTMProduction } =
		useMetalTMProduction();
	const { invalidateQuery: invalidateQueryVislonTMP } = useVislonTMP();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		getValues,
		Controller,
	} = useRHF(UPDATE_DYEING_TRANSFER_SCHEMA, UPDATE_DYEING_TRANSFER_NULL);

	useFetchForRhfReset(
		`${url}/${updateTransfer?.uuid}`,
		updateTransfer?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateTransfer((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(UPDATE_DYEING_TRANSFER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateTransfer?.uuid !== null &&
			updateTransfer?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateTransfer?.uuid}`,
				uuid: updateTransfer?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		invalidateNylonMFProduction();
		invalidateNylonPFProduction();
		invalidateMetalTMProduction();
		invalidateQueryVislonTMP();
	};

	const { value: order_id } = useFetch(
		`/other/order/description/value/label`
	); // * get order id and set them as value & lables for select options

	return (
		<AddModal
			id={modalId}
			title={
				updateTransfer?.uuid !== null ? 'Update Transfer' : 'Transfer'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label='order_description_uuid'
				title='Order Entry ID'
				errors={errors}>
				<Controller
					name='order_description_uuid'
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select User'
								options={order_id}
								value={order_id?.filter(
									(item) =>
										item.value ==
										getValues('order_description_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>

			<JoinInput
				label='trx_quantity'
				title='Transfer Quantity'
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
