import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useDyeingBatchDetailsByUUID } from '@/state/Dyeing';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import {
	DYEING_BATCH_YARN_ISSUE_NULL,
	DYEING_BATCH_YARN_ISSUE_SCHEMA,
} from '@/util/Schema';

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
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, context } = useRHF(
		DYEING_BATCH_YARN_ISSUE_SCHEMA,
		DYEING_BATCH_YARN_ISSUE_NULL
	);

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

	return (
		<AddModal
			id={modalId}
			title={`Batch Number: ${updatedData?.batch_id}`}
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
