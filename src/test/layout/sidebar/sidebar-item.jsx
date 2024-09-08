import NestedSidebarItem from './nested-sidebar-item';
import SingleSidebarItem from './single-sidebar-item';

const SidebarItem = ({ path, name, children }) => {
	if (children) {
		return (
			<NestedSidebarItem path={path} name={name}>
				{children?.map((item) => {
					if (item?.children) {
						return (
							<NestedSidebarItem key={item.path} {...item}>
								{item.children?.map((item) => {
									if (item?.children) {
										return (
											<NestedSidebarItem
												key={item.path}
												{...item}>
												{item.children?.map((item) => {
													return (
														<SingleSidebarItem
															key={item.path}
															{...item}
														/>
													);
												})}
											</NestedSidebarItem>
										);
									} else {
										return (
											<SingleSidebarItem
												key={item.path}
												{...item}
											/>
										);
									}
								})}
							</NestedSidebarItem>
						);
					} else {
						return <SingleSidebarItem key={item.path} {...item} />;
					}
				})}
			</NestedSidebarItem>
		);
	}
	return <SingleSidebarItem path={path} name={name} />;
};

export default SidebarItem;
