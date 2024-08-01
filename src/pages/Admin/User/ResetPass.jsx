import { AddModal } from "@/components/Modal";
import { useRHF, useUpdateFunc } from "@/hooks";
import { PasswordInput } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { RESET_PASSWORD_NULL, RESET_PASSWORD_SCHEMA } from "@/util/Schema";

export default function Index({
	modalId = "",
	resPass = { id: null, name: null },
	setResPass,
	setUsers,
}) {
	const { register, handleSubmit, errors } = useRHF(
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
		if (resPass?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/user/pass/${resPass?.id}/${resPass?.name}`,
				itemId: resPass.id,
				data: data,
				updatedData: updatedData,
				setItems: setUsers,
				onClose: onClose,
			});

			return;
		}
	};

	return (
		<AddModal
			id={modalId}
			title={
				resPass?.id !== null
					? "Reset Password: " + resPass?.name
					: "Reset Password"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<PasswordInput
				title="Reset Password"
				label="pass"
				// is_title_needed="false"
				{...{ register, errors }}
			/>
			<PasswordInput
				title="Confirm Password"
				label="repeatPass"
				// is_title_needed="false"
				{...{ register, errors }}
			/>
		</AddModal>
	);
}
