import { useState } from 'react';

export const useFileManagement = (
	control,
	setValue,
	getValues,
	MAX_FILES,
	FileCount
) => {
	const [fileCount, setFileCount] = useState(FileCount || 1);

	const addFile = () => {
		if (fileCount < MAX_FILES) {
			setFileCount((prev) => prev + 1);
		}
	};

	const removeFile = (index) => {
		if (fileCount > 1) {
			const fileIndex = index + 1;

			// Clear the specific file
			setValue(`file_${fileIndex}`, null, { shouldValidate: true });

			// Shift remaining files up
			for (let i = fileIndex; i < fileCount; i++) {
				const nextFile = getValues(`file_${i + 1}`);
				setValue(`file_${i}`, nextFile, { shouldValidate: true });
			}

			// Clear the last file field
			setValue(`file_${fileCount}`, null, { shouldDirty: true });
			setFileCount((prev) => prev - 1);
		}
	};

	const hasFiles = () => {
		for (let i = 1; i <= fileCount; i++) {
			const file = getValues(`file_${i}`);
			if (file !== null && file !== undefined) return true;
		}
		return false;
	};

	return {
		fileCount,
		addFile,
		removeFile,
		hasFiles,
	};
};
