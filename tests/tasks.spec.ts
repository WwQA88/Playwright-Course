import { expect, test } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { taskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TaskPage } from './support/pages/tasks'

import data from './fixtures/tasks.json'

let tasksPage: TaskPage

test.beforeEach(({ page }) => {
    tasksPage = new TaskPage(page)
})

test.describe('Cadastro', () => {
    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {

        const task = data.sucsess as taskModel
        await deleteTaskByHelper(request, task.name)       

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('nao deve permitir tarefa duplicada', async ({ request }) => {

        const task = data.duplicated as taskModel
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)     

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('Campo obrigatorio', async () => {
        const task = data.required as taskModel      

        await tasksPage.go()
        await tasksPage.create(task)
        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('Atualizacao', () => {
    test('deve concluir uma tarefa', async ({ request }) => {
        const task = data.update as taskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
       
        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('Exclusao', () => {
    test('deve excluir uma tarefa', async ({ request }) => {
        const task = data.delete as taskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})

