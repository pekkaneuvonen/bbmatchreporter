export const testschema = {
    title: 'Anonymous test schema',
    description: 'Database schema for an anonymous test',
    version: 0,
    type: 'object',
    properties: {
      id: {
        type: 'string',
        primary: true
      },
      message: {
        type: 'string'
      }
    },
    required: ['message']
  }