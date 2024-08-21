import { AddModal } from '@/components/Modal';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useMaterialInfo } from '@/state/Store';
import { FormField, Input, JoinInputSelect, ReactSelect, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { MATERIAL_NULL, MATERIAL_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateMaterialDetails = {
		uuid: null,
		section_uuid: null,
		type_uuid: null,
	},
	setUpdateMaterialDetails,
}) {
	const { url, updateData, postData } = useMaterialInfo();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(MATERIAL_SCHEMA, MATERIAL_NULL);

	useFetchForRhfReset(
		`/material/info/${updateMaterialDetails?.uuid}`,
		updateMaterialDetails?.uuid,
		reset
	);

	const { value: section } = useFetch('/other/material-section/value/label');
	const { value: materialType } = useFetch(
		'/other/material-type/value/label'
	);

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
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateMaterialDetails?.uuid}`,
				uuid: updateMaterialDetails?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add Item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	const selectUnit = [
		{ label: 'kg', value: 'kg' },
		{ label: 'Litre', value: 'ltr' },
		{ label: 'Meter', value: 'mtr' },
		{ label: 'Piece', value: 'pcs' },
	];

	return (
		<AddModal
			id={modalId}
			title={
				updateMaterialDetails?.uuid !== null
					? 'Update Material'
					: 'Material'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			<div className='mb-4 flex flex-col gap-2 rounded bg-primary/5 p-2 md:flex-row'>
				<FormField label='section_id' title='Section' errors={errors}>
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
									isDisabled={
										updateMaterialDetails?.uuid !== null
									}
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
									isDisabled={
										updateMaterialDetails?.uuid !== null
									}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='mb-4 flex flex-col gap-2 rounded bg-primary/5 p-2 md:flex-row'>
				<Input label='name' {...{ register, errors }} />
				<Input label='short_name' {...{ register, errors }} />
				<JoinInputSelect
					//defaultUnitValue='kg'
					label='threshold'
					join='unit'
					option={selectUnit}
					{...{ register, errors }}
				/>
			</div>
			<div className='mb-4 flex flex-col gap-2 rounded bg-primary/5 p-2 md:flex-row'>
				<Input label='remarks' {...{ register, errors }} />
				<Textarea label='description' {...{ register, errors }} />
			</div>
		</AddModal>
	);
}
