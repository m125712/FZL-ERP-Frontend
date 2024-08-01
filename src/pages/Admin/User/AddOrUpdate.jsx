import { AddModal } from "@/components/Modal";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, PasswordInput, ReactSelect, Textarea } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { PASSWORD, USER_NULL, USER_SCHEMA } from "@util/Schema";
import * as yup from "yup";

export default function Index({
	modalId = "",
	setUsers,
	updateUser = { id: null, department_designation: null },
	setUpdateUser,
}) {
	var schema = USER_SCHEMA;

	if (updateUser?.id == null) {
		schema = {
			...USER_SCHEMA,
			pass: PASSWORD,
			repeatPass: PASSWORD.oneOf(
				[yup.ref("pass")],
				"Passwords do not match"
			),
		};
	}
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(schema, USER_NULL);

	useFetchForRhfReset(`/user/${updateUser?.id}`, updateUser?.id, reset);

	const onClose = () => {
		setUpdateUser((prev) => ({
			...prev,
			id: null,
			department_designation: null,
		}));
		reset(USER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateUser?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await useUpdateFunc({
				uri: `/user/${updateUser?.id}/${data?.name}`,
				itemId: updateUser.id,
				data: data,
				updatedData: updatedData,
				setItems: setUsers,
				onClose: onClose,
			});

			return;
		}

		// New item
		const updatedData = {
			...data,
			status: 1,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/user",
			data: updatedData,
			setItems: setUsers,
			onClose: onClose,
		});
	};

	const { value: userDepartment } = useFetch(
		"/user-department-designation/value/label"
	);

	return (
		<AddModal
			id={modalId}
			title={updateUser?.id !== null ? "Update User" : "New User"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div className="flex flex-col gap-2 md:flex-row">
				<FormField
					label="department_designation"
					title="Department"
					errors={errors}
				>
					<Controller
						name={"department_designation"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Department"
									options={userDepartment}
									value={userDepartment?.find(
										(item) =>
											item.value ==
											getValues("department_designation")
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<Input label="name" {...{ register, errors }} />
				<Input label="email" {...{ register, errors }} />
			</div>
			<div className="mb-4 flex flex-col gap-2 md:flex-row">
				<Input label="ext" {...{ register, errors }} />
				<Input label="phone" {...{ register, errors }} />
				<Textarea label="remarks" {...{ register, errors }} />
			</div>

			{updateUser?.id === null && (
				<div className="mb-4 flex flex-col gap-2 md:flex-row">
					<PasswordInput
						title="Password"
						label="pass"
						{...{ register, errors }}
					/>
					<PasswordInput
						title="Repeat Password"
						label="repeatPass"
						{...{ register, errors }}
					/>
				</div>
			)}
		</AddModal>
	);
}
