import cn from '@/lib/cn';
import { useState } from 'react';

function Tabs(
	props = {
		tabs: [],
		defaultActiveTab: 0,
		tabSize: 'sm' || 'md' || 'lg',
		width: '',
		align: 'left' || 'center' || 'right',
		isDisabledContent: true,
		className: '',
		children: '',
	}
) {
	const {
		align,
		className,
		defaultActiveTab,
		isDisabledContent,
		tabSize,
		tabs,
		width,
		children,
	} = props || {};
	const [activeTab, setActiveTab] = useState(defaultActiveTab || 0);

	return (
		<>
			<div
				className={cn(
					'mb-4 w-[400px]',
					width,
					align === 'center'
						? 'mx-auto'
						: align === 'right'
							? 'ml-auto'
							: '',
					className
				)}>
				<div
					role='tablist'
					className={cn(
						`tabs-boxed tabs bg-primary/10 tabs-${tabSize}`
					)}>
					{tabs?.map((tab, index) => (
						<a
							role='tab'
							key={index}
							className={cn(
								'tab',
								index === activeTab && 'tab-active'
							)}
							onClick={() => setActiveTab(index)}>
							{tab.label}
						</a>
					))}
				</div>
			</div>

			{!isDisabledContent && <div>{tabs?.[activeTab].content}</div>}

			{isDisabledContent &&
				children(
					tabs?.find((tab, index) => index === activeTab),
					tabs
				)}
		</>
	);
}

export default Tabs;
