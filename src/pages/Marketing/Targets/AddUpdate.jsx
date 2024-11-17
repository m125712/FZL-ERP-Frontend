import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useMarketingTargetDetails,
	useMarketingTargets,
} from '@/state/Marketing';
import { useOtherMarketing } from '@/state/Other';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, JoinInput, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { MARKETING_TARGET_NULL, MARKETING_TARGET_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	addUpdate = {
		uuid: null,
		marketing_uuid: null,
		year: null,
		month: null,
		amount: null,
		remarks: null,
	},
	setAddUpdate,
}) {
	const isUpdate = addUpdate?.uuid !== null;
	const { data: marketing } = useOtherMarketing();
	const { invalidateQuery } = useMarketingTargets();
	const { data, postData, updateData } = useMarketingTargetDetails(
		addUpdate?.uuid
	);
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
	} = useRHF(MARKETING_TARGET_SCHEMA, MARKETING_TARGET_NULL);

	useEffect(() => {
		if (data && isUpdate) {
			reset(data);
		}
	}, [data, isUpdate]);

	const onClose = () => {
		setAddUpdate((prev) => ({
			...prev,
			uuid: null,
			marketing_uuid: null,
			year: null,
			month: null,
			amount: null,
			remarks: null,
		}));
		reset(MARKETING_TARGET_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		if (isUpdate) {
			const targetDataUpdated = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/public/marketing-team-member-target/${data?.uuid}`,
				updatedData: targetDataUpdated,
				onClose,
			});

			invalidateQuery();
			return;
		}

		const targetData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/public/marketing-team-member-target',
			newData: targetData,
			onClose,
		});

		invalidateQuery();
		return;
	};

	return (
		<AddModal
			id={modalId}
			title={
				isUpdate ? 'Update Marketing Targets' : 'Add Marketing Targets'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label={`marketing_uuid`}
				title='Marketing'
				errors={errors}>
				<Controller
					name={`marketing_uuid`}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								// menuPortalTarget={document.body}
								placeholder='Select Party'
								options={marketing}
								value={marketing?.find(
									(item) =>
										item.value ===
										getValues(`marketing_uuid`)
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='Year'
				label='year'
				unit='YYYY'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Month'
				label='month'
				unit='MM'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Amount'
				label='amount'
				unit='$'
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
