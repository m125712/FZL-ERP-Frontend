import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { VENDOR_NULL, VENDOR_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setVendor,
	updateVendor = {
		id: null,
	},
	setUpdateVendor,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		VENDOR_SCHEMA,
		VENDOR_NULL
	);

	useFetchForRhfReset(`/vendor/${updateVendor?.id}`, updateVendor?.id, reset);

	const onClose = () => {
		setUpdateVendor((prev) => ({
			...prev,
			id: null,
		}));
		reset(VENDOR_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateVendor?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/vendor/${updateVendor?.id}/${data?.name}`,
				itemId: updateVendor.id,
				data: data,
				updatedData: updatedData,
				setItems: setVendor,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/vendor",
			data: updatedData,
			setItems: setVendor,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateVendor?.id !== null ? "Update Vendor" : "Vendor"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label="name" {...{ register, errors }} />
			<Input
				label="contact_name"
				title="Person"
				{...{ register, errors }}
			/>
			<Input
				label="contact_number"
				title="Phone Number"
				{...{ register, errors }}
			/>
			<Input label="email" {...{ register, errors }} />
			<Input label="office_address" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
