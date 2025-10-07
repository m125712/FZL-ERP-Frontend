import { useEffect } from 'react';
import { useParams } from 'react-router';

import { Footer } from '@/components/Modal/ui';
import { Input, SectionEntryBody, Textarea } from '@/ui';

import { FileUploadSection } from './FileUploadSeciton';
import { useFileManagement } from './useFileManagement';

export default function ComplainBox({
	register,
	errors,
	getValues,
	Controller,
	control,
	setValue,
	MAX_FILES,
}) {
	const { uuid } = useParams();
	const isUpdate = uuid !== undefined;

	// ===== FILE MANAGEMENT =====
	const { fileCount, addFile, removeFile, hasFiles } = useFileManagement(
		control,
		setValue,
		getValues,
		MAX_FILES
	);
	// ===== UTILITY FUNCTIONS =====
	const initializeFileFields = (setValue) => {
		for (let i = 0; i < MAX_FILES; i++) {
			setValue(`file_${i}`, null);
		}
	};

	// ===== SIDE EFFECTS =====
	useEffect(() => {
		initializeFileFields(setValue);
	}, [setValue]);

	return (
		<SectionEntryBody title='Complain'>
			<div className='space-y-6'>
				{/* Basic Information */}
				<div className='grid grid-cols-2 gap-4'>
					<Input label='name' {...{ register, errors }} />
					<Input label='issue_department' {...{ register, errors }} />
				</div>

				{/* Descriptions */}
				<div className='grid grid-cols-2 gap-4'>
					<Textarea label='description' {...{ register, errors }} />
					<Textarea
						label='root_cause_analysis'
						{...{ register, errors }}
					/>
				</div>

				{/* Solutions */}
				<div className='grid grid-cols-3 gap-4'>
					<Textarea label='solution' {...{ register, errors }} />
					<Textarea label='future_proof' {...{ register, errors }} />
					<Textarea label='remarks' {...{ register, errors }} />
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
					/>
				</div>
			</div>

			<Footer buttonClassName='!btn-primary' />
		</SectionEntryBody>
	);
}
