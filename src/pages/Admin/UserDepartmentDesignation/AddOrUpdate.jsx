import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { USER_DEPARTMENT_NULL, USER_DEPARTMENT_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setDepartment,
	updateDepartment = {
		id: null,
	},
	setUpdateDepartment,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		USER_DEPARTMENT_SCHEMA,
		USER_DEPARTMENT_NULL
	);

	useFetchForRhfReset(
		`/user-department-designation/${updateDepartment?.id}`,
		updateDepartment?.id,
		reset
	);

	const onClose = () => {
		setUpdateDepartment((prev) => ({
			...prev,
			id: null,
		}));
		reset(USER_DEPARTMENT_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateDepartment?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/user-department-designation/${updateDepartment?.id}/${data?.name}`,
				itemId: updateDepartment.id,
				data: data,
				updatedData: updatedData,
				setItems: setDepartment,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/user-department-designation",
			data: updatedData,
			setItems: setDepartment,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateDepartment?.id !== null
					? "Update Department"
					: "Department"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label="department" {...{ register, errors }} />
			<Input label="designation" {...{ register, errors }} />
		</AddModal>
	);
}
