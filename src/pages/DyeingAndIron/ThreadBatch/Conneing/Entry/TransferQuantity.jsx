import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonTapeRM, useCommonTapeRMLog } from '@/state/Common';
import {
	useDyeingBatch,
	useDyeingThreadBatch,
	useDyeingThreadBatchEntry,
} from '@/state/Dyeing';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_THREAD_BATCH_ENTRY_TRANSFER_NULL,
	DYEING_THREAD_BATCH_ENTRY_TRANSFER_SCHEMA,
} from '@util/Schema';
import * as yup from 'yup';

export default function Index({
	modalId = '',
	transfer = {
		batch_entry_uuid: null,
		transfer_quantity: null,
	},
	setTransfer,
}) {
	const { url, updateData } = useDyeingThreadBatchEntry();

	//const MAX_QUANTITY = transfer?.tape_making;

	// const schema = {
	// 	used_quantity: DYEING_THREAD_BATCH_ENTRY_TRANSFER_SCHEMA.remaining.max(transfer?.tape_making),
	// 	wastage: DYEING_THREAD_BATCH_ENTRY_TRANSFER_SCHEMA.remaining.max(
	// 		MAX_QUANTITY,
	// 		'Must be less than or equal ${MAX_QUANTITY}'
	// 	),
	// };

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		//schema,
		DYEING_THREAD_BATCH_ENTRY_TRANSFER_SCHEMA,
		DYEING_THREAD_BATCH_ENTRY_TRANSFER_NULL
	);
	useFetchForRhfReset(
		`${url}/${transfer?.batch_entry_uuid}`,
		transfer?.batch_entry_uuid,
		reset
	);

	const onClose = () => {
		setTransfer((prev) => ({
			...prev,
			batch_entry_uuid: null,
			transfer_quantity: null,
			//batch_id: null,
		}));
		reset(DYEING_THREAD_BATCH_ENTRY_TRANSFER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		console.log(transfer?.batch_entry_uuid, 'onsubmit');
		const updatedData = {
			...data,
		};
		await updateData.mutateAsync({
			url: `${url}/${transfer?.batch_entry_uuid}`,
			uuid: transfer?.batch_entry_uuid,
			updatedData,
			onClose,
		});

		return;
	};

	return (
		<AddModal
			id={modalId}
			title={
				transfer?.transfer_quantity !== null
					? `Update Transfer Quantity  `
					: `Transfer Quantity  `
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='transfer_quantity' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
