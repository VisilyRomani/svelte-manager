import type { PageServerLoad } from './$types';
import z from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

type TUser = {
	id: string;
	first_name: string;
	last_name: string;
};

// type TJob = {
// 	address: string;
// 	expand: {

// 	};
// };

const ScheduleValidate = z.object({
	title: z.string(),
	employee: z.array(z.string()).min(1, 'Must select at least one employee'),
	job: z
		.map(
			z.string(),
			z.object({
				address: z.string(),
				id: z.string(),
				notes: z.string(),
				order: z.number(),
				expand: z.object({
					address: z.object({ address: z.string() }),
					task: z.array(
						z.object({
							service: z.string(),
							price: z.number(),
							count: z.number()
						})
					)
				})
			})
		)
		.refine((t) => t.size > 0, { message: 'Must select at least one Job' })
		.default(new Map()),
	dates: z.array(z.date()).min(1, 'Must select at least one date').default([])
});

export const load: PageServerLoad = async ({ locals, request }) => {
	const jobList = await locals.pb?.collection('job').getFullList({
		filter: 'status = "PENDING" || status = "RESCHEDULE"',
		expand: 'address, task, address.client, task.service'
	});

	const userList = await locals.pb
		?.collection('users')
		.getFullList<TUser>({ fields: 'id,first_name,last_name' });

	const scheduleForm = await superValidate(request, ScheduleValidate);

	return { jobList, userList, scheduleForm };
};

export const actions = {
	createSchedule: async ({ locals, request }) => {
		const scheduleForm = await superValidate(request, ScheduleValidate);

		console.log(scheduleForm.errors);

		if (!scheduleForm.valid) {
			return fail(400, { scheduleForm });
		}
		locals.pb;
	}
};
