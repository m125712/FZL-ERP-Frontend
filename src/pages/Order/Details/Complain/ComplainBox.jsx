import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAccess } from '@/hooks';

import { Footer } from '@/components/Modal/ui';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import { FileUploadSection } from './FileUploadSeciton';
import { useFileManagement } from './useFileManagement';
import { issueDepartment } from './utils';

export default function ComplainBox({
	register,
	errors,
	getValues,
	Controller,
	control,
	setValue,
	MAX_FILES,
	FileCount,
	existingFileUrls,
}) {
	const { uuid } = useParams();
	const isUpdate = uuid !== undefined;
	const haveAccess = useAccess('order__complain');

	// ===== FILE MANAGEMENT =====
	const { fileCount, addFile, removeFile, hasFiles } = useFileManagement(
		control,
		setValue,
		getValues,
		MAX_FILES,
		FileCount
	);
	// ===== UTILITY FUNCTIONS =====
	const initializeFileFields = (setValue) => {
		for (let i = 1; i <= MAX_FILES; i++) {
			// Start from 1, not 0
			setValue(`file_${i}`, null);
		}
	};
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && existingFileUrls) {
			existingFileUrls.forEach((url, idx) => {
				setValue(`file_${idx + 1}`, url);
			});
		}
	}, [mounted, existingFileUrls, setValue]);

	// ===== SIDE EFFECTS =====
	useEffect(() => {
		initializeFileFields(setValue);
	}, [setValue]);

	return (
		<SectionEntryBody title='Complain'>
			<div className='space-y-6'>
				{/* Basic Information */}
				<div className='grid grid-cols-3 gap-4'>
					<FormField
						label='is_resolved'
						title='Resolved'
						errors={errors}
					>
						<Controller
							name={'is_resolved'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<SwitchToggle
										onChange={(e) => {
											onChange(e);
										}}
										disabled={
											!haveAccess.includes(
												'resolve_complain'
											) || !isUpdate
										}
										checked={getValues('is_resolved')}
									/>
								);
							}}
						/>
					</FormField>
					<Input
						title='Complain Type'
						label='name'
						disabled={
							!haveAccess.includes('complain_entry') ||
							getValues('is_resolved')
						}
						{...{ register, errors }}
					/>

					{/* <Input label='issue_department' {...{ register, errors }} /> */}
					<FormField
						label={`issue_department`}
						title='Issue Department'
						dynamicerror={errors?.issue_department}
					>
						<Controller
							name={'issue_department'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Issue Department'
										options={issueDepartment}
										isDisabled={
											!haveAccess.includes(
												'complain_entry'
											) || getValues('is_resolved')
										}
										value={issueDepartment?.find(
											(item) =>
												item.value ==
												getValues(`issue_department`)
										)}
										onChange={(e) => {
											onChange(e.value);
											setValue(
												`issue_department`,
												e.value
											);
										}}
										menuPortalTarget={document.body}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<Textarea
					label='description'
					disabled={
						!haveAccess.includes('complain_entry') ||
						getValues('is_resolved')
					}
					{...{ register, errors }}
				/>
				{/* Descriptions */}
				<div className='grid grid-cols-2 gap-4'>
					<Textarea
						label='root_cause_analysis'
						disabled={
							!haveAccess.includes('resolve_complain') ||
							!isUpdate ||
							getValues('is_resolved')
						}
						{...{ register, errors }}
					/>
					<Textarea
						label='solution'
						disabled={
							!haveAccess.includes('resolve_complain') ||
							!isUpdate ||
							getValues('is_resolved')
						}
						{...{ register, errors }}
					/>
				</div>

				{/* Solutions */}
				<div className='grid grid-cols-2 gap-4'>
					<Textarea
						label='future_proof'
						disabled={
							!haveAccess.includes('resolve_complain') ||
							!isUpdate ||
							getValues('is_resolved')
						}
						{...{ register, errors }}
					/>
					<Textarea
						label='remarks'
						disabled={
							!haveAccess.includes('resolve_complain') ||
							!isUpdate ||
							getValues('is_resolved')
						}
						{...{ register, errors }}
					/>
				</div>

				{/* File Upload Section */}
				<div className='border-t pt-4'>
					<FileUploadSection
						fileCount={fileCount}
						addFile={addFile}
						removeFile={removeFile}
						Controller={Controller}
						control={control}
						errors={errors}
						isUpdate={isUpdate}
						MAX_FILES={MAX_FILES}
						disabled={
							!haveAccess.includes('complain_entry') ||
							getValues('is_resolved')
						}
					/>
				</div>
			</div>

			<Footer buttonClassName='!btn-primary' />
		</SectionEntryBody>
	);
}
