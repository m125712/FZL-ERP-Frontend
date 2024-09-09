import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommercialBank, useCommercialBankByUUID } from '@/state/Commercial';
import { Input, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { BANK_NULL, BANK_SCHEMA } from '@util/Schema';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	updateBank = {
		uuid: null,
	},
	setUpdateBank,
}) {
	const { user } = useAuth();
	const { url, updateData, postData } = useCommercialBank();
	const { register, handleSubmit, errors, reset, context } = useRHF(
		BANK_SCHEMA,
		BANK_NULL
	);

	const { data: bank } = useCommercialBankByUUID(updateBank?.uuid);

	useEffect(() => {
		if (bank) {
			reset(bank);
		}
	}, [bank]);

	const onClose = () => {
		setUpdateBank((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(BANK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateBank?.uuid !== null && updateBank?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateBank?.uuid}`,
				uuid: updateBank?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
			created_by: user?.uuid,
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateBank?.uuid !== null ? 'Update Bank' : 'Bank'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input label='swift_code' {...{ register, errors }} />
			<Textarea label='address' rows='2' {...{ register, errors }} />
			<Textarea label='policy' rows='3' {...{ register, errors }} />
			<Textarea label='remarks' rows='3' {...{ register, errors }} />
		</AddModal>
	);
}
