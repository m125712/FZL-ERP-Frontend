import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import {
	useFetch,
	useFetchForRhfReset,
	useFetchFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { Need } from '@/util/Need';
import {
	COMMON_COIL_TO_DYEING_NULL,
	COMMON_COIL_TO_DYEING_SCHEMA,
} from '@util/Schema';
import { set } from 'date-fns';
import { useEffect, useState } from 'react';
import { useCommonCoilToDyeing } from '@/state/Common';

export default function Index({
	modalId = '',
	setCoil,
	order_id,
	entryUUID,
	setEntryUUID,
	updateCoilLog = {
		id: null,
		trx_from: null,
		trx_to: null,
		item_name: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		coil_stock: null,
		dying_and_iron_stock: null,
		finishing_stock: null,
		order_entry_id: null,
		zipper_number_name: null,
	},
	setUpdateCoilLog,
}) {
	const { data, url, updateData, postData, deleteData, isLoading, isError } =
		useCommonCoilToDyeing();
	const [orderInfo, setOrderInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	// const MAX_QUANTITY =
	// 	updateCoilLog?.coil_stock + updateCoilLog?.dying_and_iron_stock;
	// const schema = {
	// 	...COMMON_COIL_TO_DYEING_SCHEMA,
	// 	trx_quantity: COMMON_COIL_TO_DYEING_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	// };

	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(COMMON_COIL_TO_DYEING_SCHEMA, COMMON_COIL_TO_DYEING_NULL);

	useFetchForRhfReset(
		`/zipper/tape-coil-to-dyeing/${entryUUID?.uuid}`,
		entryUUID?.uuid,
		reset
	);

	console.log(getValues());
	useEffect(() => {
		useFetchFunc(
			`/order/description/from/${updateCoilLog?.order_entry_id}`,
			setOrderInfo,
			setLoading,
			setError
		);
	}, [updateCoilLog?.order_entry_id]);

	const getMaxQuantity = () => {
		if (orderInfo === null) return 0;
		let need =
			Need({
				item: updateCoilLog?.item_name,
				stopper_type: orderInfo[0]?.stopper_type_name,
				zipper_number: updateCoilLog?.zipper_number_name,
				end_type: orderInfo[0]?.end_type_name,
				size: parseFloat(orderInfo[0]?.size),
				pcs: orderInfo[0]?.quantity,
			}) - orderInfo[0]?.given_tape_for_coil;
		return need == null || undefined ? 0 : need.toFixed(3);
	};

	const onClose = () => {
		setEntryUUID(() => ({
			uuid: null,
		}));
		reset(COMMON_COIL_TO_DYEING_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (entryUUID?.uuid !== null) {
			const updatedData = {
				...data,
				order_entry_id: updateCoilLog?.order_entry_id,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/tape-coil-to-dyeing/${updatedData?.uuid}`,
				updatedData: updatedData,
				onClose
			});
			// console.log('Form data', updatedData);

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`Coil SFG Transfer Log`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label='Order Entry ID'
				title='Order Entry ID'
				errors={errors}>
				<Controller
					name={'order_description_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={order_id}
								value={order_id?.find(
									(item) =>
										item.value ==
										getValues('order_description_uuid')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={true}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='trx_quantity'
				sub_label={`Max: ${Number(getValues('max_trf_qty'))}`} //  Max For This Order: ${getMaxQuantity()}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
