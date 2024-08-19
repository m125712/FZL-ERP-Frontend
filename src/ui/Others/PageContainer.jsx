import cn from '@/lib/cn';
import Breadcrumbs from './Breadcrumbs';

const PageContainer = ({
	children,
	title = 'Page Title',
	breadcrumbs,
	className,
}) => {
	return (
		<>
			<div className='space-y-1 border-b border-primary/10 bg-primary/5 py-5'>
				<h2 className='container mx-auto text-xl font-semibold capitalize'>
					{title}
				</h2>

				{breadcrumbs && breadcrumbs?.length > 0 && (
					<div className='container mx-auto'>
						<Breadcrumbs items={breadcrumbs} />
					</div>
				)}
			</div>
			<div className={cn('container mx-auto py-10', className)}>
				{children}
			</div>
		</>
	);
};

export default PageContainer;
