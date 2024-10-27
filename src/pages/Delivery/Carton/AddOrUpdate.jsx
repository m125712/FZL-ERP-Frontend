import { useAuth } from '@/context/auth';
import { useDeliveryCarton } from '@/state/Delivery';
import { DevTool } from '@hookform/devtools';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { CheckBox, FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	DELIVERY_CARTON_NULL,
	DELIVERY_CARTON_SCHEMA,

} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { url, updateData, postData } = useDeliveryCarton();
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		getValues,
		context,
		Controller,
		watch,
		setValue,
	} = useRHF(DELIVERY_CARTON_SCHEMA, DELIVERY_CARTON_NULL);

	const usedForOptions = [
		{ value: 'zipper', label: 'Zipper' },
		{ value: 'thread', label: 'Thread' },
		{ value: 'bag', label: 'Bag' },
	];

	useFetchForRhfReset(`${url}/${update?.uuid}`, update?.uuid, reset);

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(DELIVERY_CARTON_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (update?.uuid !== null && update?.uuid !== undefined) {
			const updatedData = {
				...data,
				active: data.active ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${update?.uuid}`,
				uuid: update?.uuid,
				updatedData,
				onClose,
			});
			return;
		}

		const newData = {
			...data,
			uuid: nanoid(),
			active: data.active ? 1 : 0,
			created_by: user?.uuid,
			created_by_name: user?.name,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={update?.uuid !== null ? 'Update Carton' : 'Add Carton'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<CheckBox
				label='active'
				title='Active'
				{...{ register, errors }}
				checked={Boolean(watch('active'))}
				onChange={(e) => setValue('active', e.target.checked)}
			/>
			<Input label='size' title='Size' {...{ register, errors }} />
			<Input label='name' title='Name' {...{ register, errors }} />

			<FormField label='used_for' title='Used For' errors={errors}>
				<Controller
					name='used_for'
					control={control}
					render={({ field }) => (
						<ReactSelect
							options={usedForOptions}
							value={usedForOptions.find(
								(option) => option.value === field.value
							)}
							onChange={(option) => field.onChange(option.value)}
							placeholder='Select Usage Type'
						/>
					)}
				/>
			</FormField>

			<Input label='remarks' title='Remarks' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
