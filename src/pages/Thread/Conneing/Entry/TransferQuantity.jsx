import { useDyeingThreadBatchEntry } from '@/state/Dyeing';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import {
	DYEING_THREAD_BATCH_ENTRY_TRANSFER_NULL,
	DYEING_THREAD_BATCH_ENTRY_TRANSFER_SCHEMA,
} from '@util/Schema';

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
			isSmall={true}
		>
			<Input label='transfer_quantity' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
