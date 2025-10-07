import { useState } from 'react';

export const useFileManagement = (control, setValue, getValues, MAX_FILES) => {
	const [fileCount, setFileCount] = useState(1);

	const addFile = () => {
		if (fileCount < MAX_FILES) {
			setFileCount((prev) => prev + 1);
		}
	};

	const removeFile = (index) => {
		if (fileCount > 1) {
			setValue(`file_${index}`, null);

			// Shift remaining files up
			for (let i = index; i < fileCount - 1; i++) {
				const nextFile = getValues(`file_${i + 1}`);
				setValue(`file_${i}`, nextFile);
			}

			// Clear the last file field
			setValue(`file_${fileCount - 1}`, null);
			setFileCount((prev) => prev - 1);
		}
	};

	const hasFiles = () => {
		for (let i = 0; i < fileCount; i++) {
			if (getValues(`file_${i}`)) return true;
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
