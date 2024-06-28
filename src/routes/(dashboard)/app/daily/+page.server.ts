import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';

export const load: PageServerLoad = async ({ locals }) => {
	const tzOffset = new Date().getTimezoneOffset();
	const startDate = dayjs().subtract(tzOffset, 'minute').toDate();
	startDate.setHours(0, 0, 0, 0);

	const endDate = dayjs().subtract(tzOffset, 'minute').toDate();
	endDate.setHours(23, 59, 59, 999);

	let schedules = await locals.pb?.collection('schedule').getFullList<{
		id: string;
		title: string;
		job: string[];
		completed: number;
		expand: { job: { status: string }[] };
	}>({
		filter: `employee.id?="${locals.user?.id}" && scheduled_date>="${startDate
			.toISOString()
			.replace('T', ' ')}" && scheduled_date<="${endDate.toISOString().replace('T', ' ')}"`,
		expand: 'job',
		fields: 'job, expand.job.status, id, title'
	});

	console.log(new Date());
	console.log(startDate);

	schedules = schedules?.map((s) => {
		const completed =
			s.expand?.job.filter((j) => j.status === 'COMPLETED' || j.status === 'CANCELED').length /
			s.expand?.job.length;
		return {
			...s,
			completed: completed * 100
		};
	});
	return { schedules };
};
