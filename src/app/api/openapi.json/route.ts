
import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'CourseNote API',
      version: '1.0.0',
      description: 'API documentation for the CourseNote application. Note: Operations are backed by Server Actions.',
    },
    servers: [
      {
        url: '/', // Assuming API calls are relative to the app's root
        description: 'Current Server',
      },
    ],
    components: {
      schemas: {
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'ObjectId', description: 'MongoDB ObjectId as a string' },
            title: { type: 'string' },
            description: { type: 'string' },
            startDate: { type: 'string', format: 'date', nullable: true },
            endDate: { type: 'string', format: 'date', nullable: true },
          },
          required: ['title', 'description'],
        },
        CourseInput: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 2 },
            description: { type: 'string', minLength: 5, maxLength: 500 },
            startDate: { type: 'string', format: 'date', nullable: true },
            endDate: { type: 'string', format: 'date', nullable: true },
          },
          required: ['title', 'description'],
        },
        Note: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'ObjectId', description: 'MongoDB ObjectId as a string' },
            title: { type: 'string' },
            content: { type: 'string' },
            courseId: { type: 'string', format: 'ObjectId', description: "String representation of the Course's ObjectId" },
            createdAt: { type: 'string', format: 'date-time' },
          },
          required: ['title', 'content', 'courseId', 'createdAt'],
        },
        NoteInput: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 2 },
            content: { type: 'string', minLength: 5 },
            courseId: { type: 'string', description: "Course ID to associate the note with" },
          },
          required: ['title', 'content', 'courseId'],
        },
        ErrorResponse: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
      },
    },
    paths: {
      '/courses': { // Simulates /api/courses via Server Actions
        get: {
          summary: 'Get all courses',
          tags: ['Courses'],
          responses: {
            '200': {
              description: 'A list of courses.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Course' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Add a new course',
          tags: ['Courses'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseInput' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Course created successfully.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Course' },
                },
              },
            },
             '400': {
                description: 'Invalid input',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
      },
      '/courses/{courseId}': { // Simulates /api/courses/{id}
        get: {
          summary: 'Get a course by ID',
          tags: ['Courses'],
          parameters: [
            {
              name: 'courseId',
              in: 'path',
              required: true,
              description: 'ID of the course to retrieve.',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Details of the course.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Course' },
                },
              },
            },
            '404': {
              description: 'Course not found.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
        put: {
          summary: 'Update an existing course',
          tags: ['Courses'],
          parameters: [
            {
              name: 'courseId',
              in: 'path',
              required: true,
              description: 'ID of the course to update.',
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseInput' }, // Could be a Partial<CourseInput>
              },
            },
          },
          responses: {
            '200': {
              description: 'Course updated successfully.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Course' },
                },
              },
            },
            '404': {
              description: 'Course not found.',
               content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
        delete: {
          summary: 'Delete a course',
          tags: ['Courses'],
          parameters: [
            {
              name: 'courseId',
              in: 'path',
              required: true,
              description: 'ID of the course to delete.',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '204': { description: 'Course deleted successfully.' },
            '404': {
              description: 'Course not found.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
      },
      '/notes': { // Simulates /api/notes
        get: {
          summary: 'Get all notes',
          tags: ['Notes'],
          responses: {
            '200': {
              description: 'A list of notes.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Note' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Add a new note',
          tags: ['Notes'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NoteInput' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Note created successfully.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Note' },
                },
              },
            },
            '400': {
                description: 'Invalid input',
                 content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
      },
      '/notes/{noteId}': { // Simulates /api/notes/{id}
        get: {
          summary: 'Get a note by ID',
          tags: ['Notes'],
          parameters: [
            {
              name: 'noteId',
              in: 'path',
              required: true,
              description: 'ID of the note to retrieve.',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Details of the note.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Note' },
                },
              },
            },
            '404': {
                description: 'Note not found.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
        put: {
          summary: 'Update an existing note',
          tags: ['Notes'],
          parameters: [
            {
              name: 'noteId',
              in: 'path',
              required: true,
              description: 'ID of the note to update.',
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                 // Assuming only title and content can be updated for an existing note
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', minLength: 2 },
                        content: { type: 'string', minLength: 5 },
                    },
                    required: ['title', 'content']
                }
              },
            },
          },
          responses: {
            '200': {
              description: 'Note updated successfully.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Note' },
                },
              },
            },
            '404': {
                description: 'Note not found.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
        delete: {
          summary: 'Delete a note',
          tags: ['Notes'],
          parameters: [
            {
              name: 'noteId',
              in: 'path',
              required: true,
              description: 'ID of the note to delete.',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '204': { description: 'Note deleted successfully.' },
            '404': {
                description: 'Note not found.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            },
          },
        },
      },
      '/courses/{courseId}/notes': {
        get: {
            summary: 'Get all notes for a specific course',
            tags: ['Notes'],
            parameters: [
                {
                    name: 'courseId',
                    in: 'path',
                    required: true,
                    description: 'ID of the course to retrieve notes for.',
                    schema: { type: 'string' },
                },
            ],
            responses: {
                '200': {
                    description: 'A list of notes for the specified course.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Note' },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Course not found.',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
                },
            },
        },
      }
    },
    tags: [
        { name: 'Courses', description: 'Operations related to courses' },
        { name: 'Notes', description: 'Operations related to notes' }
    ]
  };
  return NextResponse.json(openApiSpec);
}
