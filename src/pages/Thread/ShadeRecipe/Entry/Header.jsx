import { Input, SectionEntryBody, Textarea } from "@/ui";
import { useParams } from "react-router-dom";

export default function Header({ register, errors, getValues }) {
	const { id, thread_shade_recipe_uuid } = useParams();

	return (
		<div className="flex flex-col gap-4">
			<SectionEntryBody title="Shade Recipe">
				<div className="flex flex-col gap-1 px-2 text-secondary-content md:flex-row">
					<Input
						label="name"
						title="Name"
						defaultValue={getValues("name")}
						disabled={thread_shade_recipe_uuid !== undefined}
						{...{ register, errors }}
					/>
					<Input
						label="sub_streat"
						title="Sub Streat"
						defaultValue={getValues("sub_streat")}
						{...{ register, errors }}
					/>
				</div>
				<div className="flex flex-col gap-1 px-2 text-secondary-content md:flex-row">
					<Input
						label="lab_status"
						title="Lab Status"
						defaultValue={getValues("lab_status")}
						{...{ register, errors }}
					/>
					<Textarea label="remarks" {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
