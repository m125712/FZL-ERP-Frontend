import { useEffect } from 'react';
import { useCommonTapeSFG, useCommonTapeTransferByUUID } from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import { TAPE_TO_COIL_TRX_NULL, TAPE_TO_COIL_TRX_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTapeLog = {
		uuid: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		trx_quantity: null,
		stock_quantity: null,
	},
	setUpdateTapeLog,
}) {
	const { data, url, updateData } = useCommonTapeTransferByUUID(
		updateTapeLog?.uuid
	);
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();

	const MAX_QUANTITY =
		Number(updateTapeLog?.stock_quantity) +
		Number(updateTapeLog?.trx_quantity);

	const schema = {
		...TAPE_TO_COIL_TRX_SCHEMA,
		trx_quantity: TAPE_TO_COIL_TRX_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};

	const {
		register,
		handleSubmit,
		errors,
		reset,
		context,
		getValues,
		Controller,
		control,
	} = useRHF(schema, TAPE_TO_COIL_TRX_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateTapeLog((prev) => ({
			...prev,
			uuid: null,
			trx_quantity: null,
		}));
		reset(TAPE_TO_COIL_TRX_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTapeLog?.uuid !== null && updateTapeLog?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});
			invalidateCommonTapeSFG();
			return;
		}
	};

	const styles = [
		...(getValues('order_type') === 'tape'
			? [
					{
						label: getValues('style') + ' ' + getValues('color'),
						value: getValues('sfg_uuid'),
					},
				]
			: []),
	];

	return (
		<AddModal
			id={modalId}
			title={`Tape Log of ${updateTapeLog?.type_of_zipper}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			{getValues('order_type') === 'tape' && (
				<>
					<FormField
						label={`sfg_uuid`}
						title='Style-Color'
						is_title_needed='false'
					>
						<Controller
							name={`sfg_uuid`}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										menuPortalTarget={document.body}
										placeholder='Select Style'
										options={styles}
										value={styles?.filter(
											(item) =>
												item.value ===
												getValues(`sfg_uuid`)
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
						label={`trx_quantity_in_meter`}
						title='Quantity in Meter'
						// placeholder={`Max: ${}`}  // TODO: fix this with schema
						unit='M'
						{...{ register, errors }}
					/>
				</>
			)}
			<Input
				label='trx_quantity'
				sub_label={`Max: ${Number(updateTapeLog?.stock_quantity) + Number(updateTapeLog?.trx_quantity)}`}
				placeholder={`Max: ${Number(updateTapeLog?.stock_quantity) + Number(updateTapeLog?.trx_quantity)}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
