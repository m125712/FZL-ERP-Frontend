import { useAuth } from '@/context/auth';
import { useMaintenanceMachine } from '@/state/Maintenance';
import { useOtherCountLength, useOtherSectionMachine } from '@/state/Other';
import { useThreadCountLength } from '@/state/Thread';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { FormField, Input, ReactSelect, Switch } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	MAINTENANCE_MACHINE_NULL,
	MAINTENANCE_MACHINE_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import { sections } from './Utils';

export default function Index({
	modalId = '',
	updateCountLength = {
		uuid: null,
	},
	setUpdateCountLength,
}) {
	const { url, updateData, postData } = useMaintenanceMachine();
	const { invalidateQuery: invalidateOtherCountLength } =
		useOtherSectionMachine();
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(MAINTENANCE_MACHINE_SCHEMA, MAINTENANCE_MACHINE_NULL);

	useFetchForRhfReset(
		`${url}/${updateCountLength?.uuid}`,
		updateCountLength?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateCountLength((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(MAINTENANCE_MACHINE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateCountLength?.uuid !== null &&
			updateCountLength?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateCountLength?.uuid}`,
				uuid: updateCountLength?.uuid,
				updatedData,
				onClose,
			});
			invalidateOtherCountLength();
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

		invalidateOtherCountLength();
	};
	return (
		<AddModal
			id={modalId}
			title={
				updateCountLength?.uuid !== null
					? `Update Section Machine ${getValues('section_machine_id')}`
					: 'Section Machine'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Switch label='status' {...{ register, errors }} />
			<FormField label='section' title='Section' errors={errors}>
				<Controller
					name={'section'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Section'
								options={sections}
								value={sections?.filter(
									(item) => item.value == getValues('section')
								)}
								onChange={(e) => onChange(e.value)}
								// isDisabled={order_info_id !== undefined}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='name' {...{ register, errors }} />

			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
