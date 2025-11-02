import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useIssueByUUID } from '@/state/Maintenance';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, ReactSelect, Textarea } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import { cn } from '@/lib/utils';
import { ISSUE_MAINTAIN_NULL, ISSUE_MAINTAIN_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	maintain = {
		uuid: null,
	},
	setMaintain,
}) {
	const { user } = useAuth();
	const { data, updateData, url } = useIssueByUUID(maintain?.uuid);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		watch,
		control,
		Controller,
		context,
		getValues,
	} = useRHF(ISSUE_MAINTAIN_SCHEMA, ISSUE_MAINTAIN_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setMaintain((prev) => ({
			...prev,
			uuid: null,
		}));

		reset(ISSUE_MAINTAIN_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			maintain_condition: data?.maintain_condition,
			...(data?.maintain_condition !== 'waiting' && {
				maintain_by: user?.uuid,
				maintain_date: GetDateTime(),
			}),
			maintenance_desc: data?.maintenance_desc,
			parts_details: data?.parts_details,
			updated_at: GetDateTime(),
			updated_by: user?.uuid,
		};

		await updateData.mutateAsync({
			url,
			updatedData,
			onClose,
		});

		return;
	};

	const options = [
		{ value: 'okay', label: 'Okay' },
		{ value: 'waiting', label: 'Waiting' },
		{ value: 'rejected', label: 'Rejected' },
		{ value: 'ongoing', label: 'On Going' },
	];

	return (
		<AddModal
			id={modalId}
			title={'Procurement'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField
				label='maintain_condition'
				title='Maintain Status'
				errors={errors}
			>
				<Controller
					name={'maintain_condition'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								className={cn(
									watch('maintain_condition') === 'waiting' &&
										'bg-red-100',
									watch('maintain_condition') ===
										'rejected' && 'bg-red-500',
									watch('maintain_condition') === 'ongoing' &&
										'bg-yellow-100',
									watch('maintain_condition') === 'okay' &&
										'bg-green-100'
								)}
								placeholder='Select status'
								options={options}
								value={options?.filter(
									(item) =>
										item.value ===
										getValues('maintain_condition')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<Textarea label='maintenance_desc' {...{ register, errors }} />
			<Textarea label='parts_details' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
