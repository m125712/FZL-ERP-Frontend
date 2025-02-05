import cn from '@/lib/cn';

import CopyButton from './CopyButton';
import RemoveButton from './RemoveButton';

export default function ActionButtons({
	duplicateClick,
	removeClick,
	showDuplicateButton = true,
	showRemoveButton,
	className,
}) {
	return (
		<div className={cn('flex w-10 gap-2')}>
			<CopyButton
				onClick={duplicateClick}
				showButton={showDuplicateButton}
			/>
			<RemoveButton onClick={removeClick} showButton={showRemoveButton} />
		</div>
	);
}
