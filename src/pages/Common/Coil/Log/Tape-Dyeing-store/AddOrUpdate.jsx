import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useCommonToDyeingAndStoreByUUID } from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	TAPE_STOCK_TRX_TO_DYING_NULL,
	TAPE_STOCK_TRX_TO_DYING_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	entry = {
		uuid: null,
		name: null,
		quantity: null,
		item_name: null,
		zipper_number: null,
		type: null,
	},
	setEntry,
}) {
	const { data, updateData } = useCommonToDyeingAndStoreByUUID(entry.uuid);

	const { user } = useAuth();
	const schema = {
		trx_quantity: TAPE_STOCK_TRX_TO_DYING_SCHEMA.trx_quantity,
		remarks: TAPE_STOCK_TRX_TO_DYING_SCHEMA.remarks,
	};

	const {
		register,
		handleSubmit,
		control,
		Controller,
		errors,
		reset,
		context,
	} = useRHF(schema, TAPE_STOCK_TRX_TO_DYING_NULL);

	useEffect(() => {
		if (data) {
			reset({
				trx_quantity: data.trx_quantity,
				remarks: data.remarks,
			});
		}
	}, [data, reset]);

	const onClose = () => {
		setEntry((prev) => ({
			...prev,
			uuid: null,
			type: null,
			quantity: null,
			zipper_number: null,
			type_of_zipper: null,
			order_entry_id: null,
		}));
		reset(TAPE_STOCK_TRX_TO_DYING_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			trx_quantity: data.trx_quantity,
			updated_by: user?.uuid,
			updated_at: GetDateTime(),
			remarks: data.remarks,
		};
		await updateData.mutateAsync({
			url: `/zipper/tape-transfer-to-dyeing/${entry.uuid}`,
			updatedData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={entry?.id !== null && entry.title}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='trx_quantity'
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
