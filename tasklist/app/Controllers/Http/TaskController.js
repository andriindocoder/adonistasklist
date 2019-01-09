'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
	async index({view}){
		const tasks = await Task.all()

		return view.render('tasks.index',{tasks: tasks.toJSON() })
	}

	async store({request, response, session}){
		//validate form input
		const validation = await validate(request.all(), {
			title: 'required|min:3|max:255'
		})

		//show error message if validation fails
		if(validation.fails()){
			session.withErrors(validation.messages())
					.flashAll()

			return response.redirect('back')
		}

		// save to database
		const task = new Task()
		task.title = request.input('title')
		await task.save()

		// Pass success message to session
		session.flash({ notification: 'Task Added!'})

		return response.redirect('back')
	}

	async destroy({params,session,response}){
		const task = await Task.find(params.id)
		await task.delete()

		session.flash({ notification: 'Task Deleted'})

		return response.redirect('back')
	}
}

module.exports = TaskController
