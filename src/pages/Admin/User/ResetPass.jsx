import { useAuth } from '@/context/auth';
import { useAdminUsers } from '@/state/Admin';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { PasswordInput } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import { RESET_PASSWORD_NULL, RESET_PASSWORD_SCHEMA } from '@/util/Schema';

export default function Index({
	modalId = '',
	resPass = { id: null, name: null },
	setResPass,
}) {
	const { updateData } = useAdminUsers();
	const { user } = useAuth();

	const { register, handleSubmit, errors, context } = useRHF(
		RESET_PASSWORD_SCHEMA,
		RESET_PASSWORD_NULL
	);

	const onClose = () => {
		setResPass((prev) => ({
			...prev,
			id: null,
			name: null,
		}));
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (resPass?.uuid !== null && resPass?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_by: user?.uuid,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/hr/user/password/${resPass.uuid}`,
				uuid: resPass.uuid,
				updatedData,
				onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={
				resPass?.uuid !== null
					? 'Reset Password: ' + resPass?.name
					: 'Reset Password'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<PasswordInput
				title='Reset Password'
				label='pass'
				// is_title_needed="false"
				{...{ register, errors }}
			/>
			<PasswordInput
				title='Confirm Password'
				label='repeatPass'
				// is_title_needed="false"
				{...{ register, errors }}
			/>
		</AddModal>
	);
}
