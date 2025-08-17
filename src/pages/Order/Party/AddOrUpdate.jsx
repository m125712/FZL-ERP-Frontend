import { useAuth } from '@/context/auth';
import { useOrderFactory, useOrderParty } from '@/state/Order';
import { useOtherParty } from '@/state/Other';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { PARTY_NULL, PARTY_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateParty = {
		uuid: null,
	},
	setUpdateParty,
}) {
	const { url, updateData, postData } = useOrderParty();
	const { invalidateQuery: invalidatePartyAll } = useOtherParty();
	const { invalidateQuery: invalidateOrderFactory } = useOrderFactory();

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		PARTY_SCHEMA,
		PARTY_NULL
	);

	const { user } = useAuth();

	useFetchForRhfReset(
		`${url}/${updateParty?.uuid}`,
		updateParty?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateParty((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(PARTY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateParty?.uuid !== null && updateParty?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `${url}/${updateParty?.uuid}`,
				uuid: updateParty?.uuid,
				updatedData,
				onClose,
			});

			invalidatePartyAll();

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidatePartyAll();
		invalidateOrderFactory();
	};

	return (
		<AddModal
			id={modalId}
			title={updateParty?.uuid !== null ? 'Update Party' : 'Party'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='address' rows={2} {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
