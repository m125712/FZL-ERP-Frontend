import { useEffect } from 'react';
import { useDyeingTransferByUUID } from '@/state/Dyeing';
import { useMetalTMProduction } from '@/state/Metal';
import {
	useNylonMFProduction,
	useNylonPlasticFinishingProduction,
} from '@/state/Nylon';
import { useOtherOrderDescription } from '@/state/Other';
import { useVislonTMP } from '@/state/Vislon';
import { Watch } from 'lucide-react';
import * as yup from 'yup';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
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
	const { data, url, updateData } = useDyeingTransferByUUID(
		updateTransfer?.uuid
	);
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
		watch,
	} = useRHF(
		{
			...UPDATE_DYEING_TRANSFER_SCHEMA,
			trx_quantity: UPDATE_DYEING_TRANSFER_SCHEMA.trx_quantity
				.max(yup.ref('max_trx_quantity'), 'Beyond Max Quantity')
				.moreThan(0, 'Must be greater than 0'),
		},
		UPDATE_DYEING_TRANSFER_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

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
				url: `${url}`,
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

	const { data: order_id } = useOtherOrderDescription(); // * get order id and set them as value & lables for select options

	const styles = [
		...(getValues('order_type') === 'tape'
			? [
					{
						value: getValues('sfg_uuid'),
						label: getValues('style') + ' ' + getValues('color'),
					},
				]
			: []),
	];
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
								isDisabled={true}
							/>
						);
					}}
				/>
			</FormField>
			{getValues('order_type') === 'tape' && (
				<>
					<FormField
						label='sfg_uuid'
						title='Style-Color'
						errors={errors}>
						<Controller
							name='sfg_uuid'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select styler'
										options={styles}
										value={styles?.filter(
											(item) =>
												item.value ==
												getValues('sfg_uuid')
										)}
										// onChange={(e) => {
										// 	onChange(e.value);
										// }}
										isDisabled={true}
									/>
								);
							}}
						/>
					</FormField>
					<JoinInput
						label='trx_quantity_in_meter'
						title='Transfer QTY (M)'
						unit='M'
						{...{ register, errors }}
					/>
				</>
			)}

			<JoinInput
				label='trx_quantity'
				title='Transfer Quantity'
				sub_label={`Max: ${watch('max_trx_quantity')}`}
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
