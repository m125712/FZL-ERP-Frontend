import { useEffect } from 'react';
import {
	useMetalTMProduction,
	useMetalTMTrxLog,
	useMetalTMTrxLogByUUID,
} from '@/state/Metal';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	NUMBER_REQUIRED,
	SFG_TRANSFER_LOG_NULL,
	SFG_TRANSFER_LOG_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingLog = {
		uuid: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		teeth_molding_prod: null,
		finishing_stock: null,
		order_entry_uuid: null,
	},
	setUpdateTeethMoldingLog,
}) {
	const { invalidateQuery } = useMetalTMProduction();
	const { updateData } = useMetalTMTrxLog();
	const { data: dataByUUID } = useMetalTMTrxLogByUUID(
		updateTeethMoldingLog.uuid,
		{
			enabled: updateTeethMoldingLog.uuid !== null,
		}
	);
	const MAX_QUANTITY =
		Number(updateTeethMoldingLog?.teeth_molding_prod) +
		Number(updateTeethMoldingLog?.trx_quantity);
	const schema = {
		...SFG_TRANSFER_LOG_SCHEMA,
		trx_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
			MAX_QUANTITY
		),
	};

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
	} = useRHF(schema, SFG_TRANSFER_LOG_NULL);

	useEffect(() => {
		if (dataByUUID) {
			reset(dataByUUID);
		}
	}, [dataByUUID]);

	const onClose = () => {
		setUpdateTeethMoldingLog((prev) => ({
			...prev,
			uuid: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			order_description: null,
			order_quantity: null,
			teeth_molding_prod: null,
			finishing_stock: null,
			order_entry_uuid: null,
		}));
		reset(SFG_TRANSFER_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTeethMoldingLog?.uuid !== null) {
			const updatedData = {
				...data,
				order_entry_uuid: updateTeethMoldingLog?.order_entry_uuid,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/finishing-batch-transaction/${updateTeethMoldingLog?.uuid}`,
				updatedData,
				onClose,
			});

			invalidateQuery();

			return;
		}
	};

	const transactionArea = [
		{ label: 'Dying and Iron', value: 'dying_and_iron_stock' },
		{ label: 'Teeth Molding', value: 'teeth_molding_stock' },
		{ label: 'Teeth Coloring', value: 'teeth_coloring_stock' },
		{ label: 'Finishing', value: 'finishing_stock' },
		{ label: 'Slider Assembly', value: 'slider_assembly_stock' },
		{ label: 'Coloring', value: 'coloring_stock' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Teeth Molding SFG Transfer Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='trx_to' title='Trx to' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('trx_to')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									updateTeethMoldingLog?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='Transaction Quantity'
				label='trx_quantity'
				sub_label={`MAX: ${MAX_QUANTITY} pcs`}
				unit='PCS'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
