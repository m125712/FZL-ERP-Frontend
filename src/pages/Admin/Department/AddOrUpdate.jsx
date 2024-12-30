import { useAuth } from '@/context/auth';
import {
	useAdminDepartments,
	useAdminDesignations,
	useAdminUsers,
} from '@/state/Admin';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { USER_DEPARTMENT_NULL, USER_DEPARTMENT_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateDepartment = {
		uuid: null,
	},
	setUpdateDepartment,
}) {
	const { user } = useAuth();
	const { url, updateData, postData } = useAdminDepartments();
	const { invalidateQuery: invalidateUsers } = useAdminUsers();
	const { invalidateQuery: invalidateDesignations } = useAdminDesignations();
	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		USER_DEPARTMENT_SCHEMA,
		USER_DEPARTMENT_NULL
	);

	useFetchForRhfReset(
		`${url}/${updateDepartment?.uuid}`,
		updateDepartment?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateDepartment((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(USER_DEPARTMENT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateDepartment?.uuid !== null &&
			updateDepartment?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateDepartment?.uuid}`,
				uuid: updateDepartment?.uuid,
				updatedData,
				onClose,
			});
			invalidateUsers();
			invalidateDesignations();

			return;
		}

		// Add new item
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
		invalidateUsers();
		invalidateDesignations();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateDepartment?.uuid !== null
					? 'Update Department'
					: 'Department'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='department' {...{ register, errors }} />
			<Textarea label='remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
