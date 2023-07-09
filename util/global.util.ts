
export const resolveOrderStage = (status: number) => {
	switch (status) {
		case 0:
			return "Leads";
		case 1:
			return "Paid";
		case 2:
			return "Approved";
		case 3:
			return "In Progress";
	}
}

export const enum OrderStages {
	Leads = 0,
	Paid = 1,
	Approved = 2,
	InProgress = 3
}
