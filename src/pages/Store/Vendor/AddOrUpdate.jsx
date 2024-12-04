import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useOtherVendor } from '@/state/Other';
import { usePurchaseVendor, usePurchaseVendorByUUID } from '@/state/Store';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input } from '@/ui';

import nanoid from '@/lib/nanoid';
import { VENDOR_NULL, VENDOR_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateVendor = {
		uuid: null,
	},
	setUpdateVendor,
}) {
	const { user } = useAuth();
	const { invalidateQuery: invalidateVendor } = useOtherVendor();
	const { url, updateData, postData } = usePurchaseVendor();
	const { data } = usePurchaseVendorByUUID(updateVendor?.uuid);

	const { register, handleSubmit, errors, reset, context, control } = useRHF(
		VENDOR_SCHEMA,
		VENDOR_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateVendor((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(VENDOR_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateVendor?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateVendor?.uuid}`,
				uuid: updateVendor?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			created_at: GetDateTime(),
			created_by: user?.uuid,
			uuid: nanoid(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});

		invalidateVendor();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateVendor?.uuid !== null ? 'Update Vendor' : 'Create Vendor'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='name' {...{ register, errors }} />
			<Input
				label='contact_name'
				title='Person'
				{...{ register, errors }}
			/>
			<Input
				label='contact_number'
				title='Phone Number'
				{...{ register, errors }}
			/>
			<Input label='email' {...{ register, errors }} />
			<Input label='office_address' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
