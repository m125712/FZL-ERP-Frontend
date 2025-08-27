import { useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useCommonMaterialTrxByUUID } from '@/state/Common';
import { useDyeingBatchDetailsByUUID } from '@/state/Dyeing';
import { useOtherMachines } from '@/state/Other';
import {
	useMaterialInfo,
	useMaterialTrxAgainstOrderDescription,
} from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import { cn } from '@/lib/utils';
import GetDateTime from '@/util/GetDateTime';
import {
	DYEING_BATCH_YARN_ISSUE_NULL,
	DYEING_BATCH_YARN_ISSUE_SCHEMA,
} from '@/util/Schema';
import getTransactionArea from '@/util/TransactionArea';

export default function Index({
	modalId = '',
	updatedData = {
		uuid: null,
		trx_to: null,
		trx_quantity: null,
		stock: null,
	},
	setUpdatedData,
}) {
	const { data, updateData } = useDyeingBatchDetailsByUUID(updatedData?.uuid);
	const { data: machine } = useOtherMachines();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, context, getValues, watch } =
		useRHF(DYEING_BATCH_YARN_ISSUE_SCHEMA, DYEING_BATCH_YARN_ISSUE_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdatedData((prev) => ({
			...prev,
			uuid: null,
			trx_to: null,
			trx_quantity: null,
			stock: null,
		}));
		reset(DYEING_BATCH_YARN_ISSUE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updatedData?.uuid !== null) {
			const updatedData = {
				...data,
				yarn_issued_date: GetDateTime(),
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};
			await updateData.mutateAsync({
				url: `/zipper/dyeing-batch/${updatedData?.uuid}`,
				uuid: updatedData?.uuid,
				updatedData,
				onClose,
			});
			return;
		}
	};
	const res = machine?.find(
		(item) => item.value == getValues('machine_uuid')
	);
	const getTotal = useCallback(
		(dyeing_batch_entry) => {
			let totalQty = 0;
			let totalCalTape = 0;
			let totalProduction = 0;

			dyeing_batch_entry?.forEach((item, index) => {
				totalQty += Number(item.quantity);

				const top = parseFloat(item.top) || 0;
				const bottom = parseFloat(item.bottom) || 0;
				const size = parseFloat(item.size) || 0;
				const quantity = parseFloat(item.quantity) || 0;
				const production_quantity_in_kg =
					parseFloat(item.production_quantity_in_kg) || 0;
				const dyedMtrPerKg = parseFloat(item.dyed_mtr_per_kg) || 1;

				const itemTotal =
					watch(`dyeing_batch_entry[${index}].order_type`) === 'tape'
						? (top + bottom + quantity) / 100 / dyedMtrPerKg
						: ((top + bottom + size) * quantity) /
							100 /
							dyedMtrPerKg;
				totalCalTape += itemTotal;
				totalProduction += production_quantity_in_kg;
			});

			return { totalQty, totalCalTape, totalProduction };
		},
		[watch()]
	);
	return (
		<AddModal
			id={modalId}
			title={`Batch Number: ${updatedData?.batch_id}`}
			subTitle={
				<div className='flex flex-col gap-1 pl-2 text-sm text-black'>
					<span className='bold'>{`Machine Capacity (KG): ${res?.min_capacity || 0} - 
														${res?.max_capacity || 0}`}</span>
					<span
						className={cn(
							getTotal(getValues('dyeing_batch_entry'))
								.totalCalTape > parseFloat(res?.max_capacity) ||
								getTotal(getValues('dyeing_batch_entry'))
									.totalCalTape <
									parseFloat(res?.min_capacity)
								? 'text-error'
								: ''
						)}
					>{`Batch Quantity (KG): ${Number(getTotal(getValues('dyeing_batch_entry')).totalCalTape).toFixed(3)}`}</span>
					<span
						className={cn(
							getTotal(getValues('dyeing_batch_entry'))
								.totalProduction >
								getTotal(getValues('dyeing_batch_entry'))
									.totalCalTape
								? 'text-red-500'
								: ''
						)}
					>{`Production Quantity (KG): ${Number(getTotal(getValues('dyeing_batch_entry')).totalProduction).toFixed(3)}`}</span>
					<span>{`Batch Quantity (PCS): ${getTotal(getValues('dyeing_batch_entry')).totalQty}`}</span>
				</div>
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label='yarn_issued' {...{ register, errors }} />

			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
