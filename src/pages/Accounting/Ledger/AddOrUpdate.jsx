import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { FormField, Input, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import {
	useAccLedger,
	useAccLedgerByUUID,
	useOtherAccGroup,
} from './config/query';
import { LEDGER_NULL, LEDGER_SCHEMA } from './config/schema';
import { restrictionOptions, typeOptions } from './utils';

export default function Index({
	modalId = '',
	updateItem = {
		uuid: null,
	},
	setUpdateItem,
}) {
	const { user } = useAuth();

	const { data, updateData, postData } = useAccLedgerByUUID(updateItem?.uuid);
	const { invalidateQuery } = useAccLedger();
	const { data: groupOptions } = useOtherAccGroup(updateItem?.uuid);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(LEDGER_SCHEMA, LEDGER_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateItem((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(LEDGER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateItem?.uuid !== null && updateItem?.uuid !== undefined) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};

			await updateData.mutateAsync({
				url: `/acc/ledger/${updateItem?.uuid}`,
				uuid: updateItem?.uuid,
				updatedData,
				onClose,
			});

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
			url: '/acc/ledger',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id={modalId}
			title={updateItem?.uuid !== null ? 'Update Ledger' : 'Ledger'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div className='grid grid-cols-2 gap-4'>
				<Input label='name' {...{ register, errors }} />
				<Input label='category' {...{ register, errors }} />
				<Input label='account_no' {...{ register, errors }} />

				<FormField label='group_uuid' title='Group' errors={errors}>
					<Controller
						name={'group_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Group'
									options={groupOptions}
									value={groupOptions?.filter(
										(item) =>
											item.value ==
											getValues('group_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='type' title='Type' errors={errors}>
					<Controller
						name={'type'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Type'
									options={typeOptions}
									value={typeOptions?.filter(
										(item) =>
											item.value == getValues('type')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='restrictions'
					title='Restriction'
					errors={errors}
				>
					<Controller
						name={'restrictions'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Restriction'
									options={restrictionOptions}
									value={restrictionOptions?.filter(
										(item) =>
											item.value ==
											getValues('restrictions')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>

				<Input label='vat_deduction' {...{ register, errors }} />

				<Input label='tax_deduction' {...{ register, errors }} />

				<FormField label='is_active' title='Active' errors={errors}>
					<Controller
						name={'is_active'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<SwitchToggle
									onChange={(e) => {
										onChange(e);
									}}
									checked={getValues('is_active')}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
