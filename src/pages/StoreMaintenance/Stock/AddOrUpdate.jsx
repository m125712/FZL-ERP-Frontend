import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useOtherMaterialByParams,
	useOtherMaterialSection,
	useOtherMaterialType,
} from '@/state/Other';
import { useMaterialInfo, useMaterialInfoByUUID } from '@/state/Store';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import {
	CheckBox,
	FormField,
	Input,
	JoinInputSelect,
	ReactSelect,
	Textarea,
} from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { MATERIAL_NULL, MATERIAL_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateMaterialDetails = {
		uuid: null,
		section_uuid: null,
		type_uuid: null,
	},
	setUpdateMaterialDetails,
}) {
	const { user } = useAuth();
	const { invalidateQuery, updateData, postData } = useMaterialInfo(
		'maintenance',
		false
	);
	const { data } = useMaterialInfoByUUID(updateMaterialDetails?.uuid);
	const { data: section } = useOtherMaterialSection('maintenance');
	const { data: materialType } = useOtherMaterialType('maintenance');
	const { invalidateQuery: invalidateMaterialByDyes } =
		useOtherMaterialByParams('type=dyes');
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		context,
	} = useRHF(MATERIAL_SCHEMA, MATERIAL_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			uuid: null,
			section_uuid: null,
			type_uuid: null,
		}));
		reset(MATERIAL_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialDetails?.uuid !== null) {
			const updatedData = {
				...data,
				is_priority_material: data.is_priority_material ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/material/info/${updateMaterialDetails?.uuid}`,
				uuid: updateMaterialDetails?.uuid,
				updatedData,
				onClose,
			});
			invalidateQuery();
			return;
		}

		// Add Item
		const updatedData = {
			...data,
			is_priority_material: data.is_priority_material ? 1 : 0,
			uuid: nanoid(),
			store_type: 'maintenance',
			created_at: GetDateTime(),
			created_by: user?.uuid,
		};

		await postData.mutateAsync({
			url: '/material/info',
			newData: updatedData,
			onClose,
		});
		invalidateMaterialByDyes();
		invalidateQuery();
	};

	const selectUnit = [
		{ label: 'kg', value: 'kg' },
		{ label: 'Litre', value: 'ltr' },
		{ label: 'Meter', value: 'mtr' },
		{ label: 'Piece', value: 'pcs' },
		{ label: 'Set', value: 'set' },
		{ label: 'Roll', value: 'roll' },
		{ label: 'Gallon', value: 'gallon' },
		{ label: 'Lbs', value: 'lbs' },
	];

	return (
		<AddModal
			id={modalId}
			title={
				updateMaterialDetails?.uuid !== null
					? 'Update Material'
					: 'Material'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div className='mb-4 flex flex-col gap-2 rounded bg-base-200 p-2 md:flex-row'>
				<FormField label='section_uuid' title='Section' errors={errors}>
					<Controller
						name={'section_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Section'
									options={section}
									value={section?.filter(
										(item) =>
											item.value ===
											getValues('section_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={
									// 	updateMaterialDetails?.uuid !== null
									// }
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='type_uuid' title='Type' errors={errors}>
					<Controller
						name={'type_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Material Type'
									options={materialType}
									value={materialType?.filter(
										(item) =>
											item.value ===
											getValues('type_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={
									// 	updateMaterialDetails?.uuid !== null
									// }
								/>
							);
						}}
					/>
				</FormField>
				<div className='mt-6 flex items-center text-sm'>
					<div className='w-40 rounded-md border border-secondary/30 px-1'>
						<CheckBox
							height='h-[2.9rem]'
							label='is_priority_material'
							title='Priority Material'
							{...{ register, errors }}
						/>
					</div>
				</div>
			</div>
			<div className='mb-4 flex flex-col gap-2 rounded bg-base-200 p-2 md:flex-row'>
				<Input label='name' {...{ register, errors }} />
				<Input label='short_name' {...{ register, errors }} />
				<Input label='average_lead_time' {...{ register, errors }} />
				<JoinInputSelect
					//defaultUnitValue='kg'
					label='threshold'
					join='unit'
					option={selectUnit}
					{...{ register, errors }}
				/>
			</div>
			<div className='mb-4 flex flex-col gap-2 rounded bg-base-200 p-2 md:flex-row'>
				<Input label='index' {...{ register, errors }} />
				<Input label='remarks' {...{ register, errors }} />
				<Textarea label='description' {...{ register, errors }} />
			</div>
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
