import { Elysia, t } from 'elysia'

import type { Static } from 'elysia'

export const NoteSchema = t.Object({
  id: t.Number(),
  user_id: t.Number(),
  title: t.String(),
  content: t.String(),
  tags: t.Optional(t.Array(t.String()))
})

export type Note = Static<typeof NoteSchema>

export const publicComments = new Elysia({
  tags: ['@next', 'publicComments']
})
  .get(
    '',
    async ({ set }) => {
      try {
        const notes = await getAllNotesUseCase()
        return { status: 'success', data: notes }
      } catch (e) {
        console.error(e)
        set.status = 500
        return { status: 'error', message: 'Internal Server Error' }
      }
    },
    {
      response: {
        200: t.Object({
          status: t.String(),
          data: t.Array(NoteSchema)
        }),
        500: t.Object({
          status: t.String(),
          message: t.String()
        })
      },
      detail: {
        //   tags: ['Notes'],
        summary: 'Get all notes'
        //   description: 'Retrieve a list of all notes'
      }
    }
  )
  .post(
    '',
    async ({ body, set }) => {
      try {
        const note = await createNoteUseCase(
          body.user_id,
          body.title,
          body.content
        )
        set.status = 201
        return { status: 'success', data: note }
      } catch (e) {
        console.error(e)
        set.status = 500
        return { status: 'error', message: 'Internal Server Error' }
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
        user_id: t.Number()
      }),
      response: {
        201: t.Object({
          status: t.String(),
          data: NoteSchema
        }),
        500: t.Object({
          status: t.String(),
          message: t.String()
        })
      },
      detail: {
        //   tags: ['Notes'],
        summary: 'Create a new note'
        //   description: 'Create a new note with the provided title and content'
      }
    }
  )

async function createNoteUseCase(
  user_id: number,
  title: string,
  content: string
) {
  // Simulate note creation and return the created note object
  // In a real implementation, this would interact with a database
  return {
    id: Math.floor(Math.random() * 100000), // Simulated unique ID
    user_id,
    title,
    content,
    tags: []
  }
}
async function getAllNotesUseCase(): Promise<Note[]> {
  // Simulate fetching notes from a database
  // In a real implementation, this would query a database
  return [
    {
      id: 1,
      user_id: 101,
      title: 'Sample Note 1',
      content: 'This is the content of sample note 1.',
      tags: ['sample', 'note']
    },
    {
      id: 2,
      user_id: 102,
      title: 'Sample Note 2',
      content: 'This is the content of sample note 2.',
      tags: []
    }
  ]
}
