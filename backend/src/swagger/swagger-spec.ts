export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Recipe API',
    version: '1.0.0',
    description: 'REST API for managing recipes, ingredients, and steps'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    }
  ],
  paths: {
    '/recipes': {
      get: {
        summary: 'Get all recipes',
        tags: ['Recipes'],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Recipe' }
                }
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      post: {
        summary: 'Create a new recipe',
        tags: ['Recipes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecipeInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Recipe created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Recipe' }
              }
            }
          },
          '400': {
            description: 'Invalid input'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/recipes/{id}': {
      get: {
        summary: 'Get recipe by ID',
        tags: ['Recipes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Recipe' }
              }
            }
          },
          '404': {
            description: 'Recipe not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      put: {
        summary: 'Update recipe',
        tags: ['Recipes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecipeInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Recipe updated successfully'
          },
          '404': {
            description: 'Recipe not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      delete: {
        summary: 'Delete recipe',
        tags: ['Recipes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Recipe deleted successfully'
          },
          '404': {
            description: 'Recipe not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/ingredients': {
      get: {
        summary: 'Get all ingredients',
        tags: ['Ingredients'],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Ingredient' }
                }
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      post: {
        summary: 'Create a new ingredient',
        tags: ['Ingredients'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/IngredientInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Ingredient created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Ingredient' }
              }
            }
          },
          '400': {
            description: 'Invalid input'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/ingredients/{id}': {
      get: {
        summary: 'Get ingredient by ID',
        tags: ['Ingredients'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Ingredient' }
              }
            }
          },
          '404': {
            description: 'Ingredient not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      put: {
        summary: 'Update ingredient',
        tags: ['Ingredients'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/IngredientInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Ingredient updated successfully'
          },
          '404': {
            description: 'Ingredient not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      delete: {
        summary: 'Delete ingredient',
        tags: ['Ingredients'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Ingredient deleted successfully'
          },
          '404': {
            description: 'Ingredient not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/recipes/{recipeId}/ingredients': {
      get: {
        summary: 'Get ingredients by recipe ID',
        tags: ['Ingredients'],
        parameters: [
          {
            name: 'recipeId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Ingredient' }
                }
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/steps': {
      get: {
        summary: 'Get all steps',
        tags: ['Steps'],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Step' }
                }
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      post: {
        summary: 'Create a new step',
        tags: ['Steps'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StepInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Step created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Step' }
              }
            }
          },
          '400': {
            description: 'Invalid input'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/steps/{id}': {
      get: {
        summary: 'Get step by ID',
        tags: ['Steps'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Step' }
              }
            }
          },
          '404': {
            description: 'Step not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      put: {
        summary: 'Update step',
        tags: ['Steps'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StepInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Step updated successfully'
          },
          '404': {
            description: 'Step not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      delete: {
        summary: 'Delete step',
        tags: ['Steps'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Step deleted successfully'
          },
          '404': {
            description: 'Step not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/recipes/{recipeId}/steps': {
      get: {
        summary: 'Get steps by recipe ID',
        tags: ['Steps'],
        parameters: [
          {
            name: 'recipeId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Step' }
                }
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Recipe: {
        type: 'object',
        properties: {
          Id: { type: 'integer' },
          Title: { type: 'string' },
          ServingSize: { type: 'string' },
          Photos: { type: 'string', format: 'binary', nullable: true }
        }
      },
      RecipeInput: {
        type: 'object',
        required: ['Title', 'ServingSize'],
        properties: {
          Title: { type: 'string' },
          ServingSize: { type: 'string' },
          Photos: { type: 'string', format: 'binary', nullable: true }
        }
      },
      Ingredient: {
        type: 'object',
        properties: {
          Id: { type: 'integer' },
          Ingredient: { type: 'string' },
          Qty: { type: 'number', nullable: true },
          Unit: { type: 'string', nullable: true },
          RecipeId: { type: 'integer' }
        }
      },
      IngredientInput: {
        type: 'object',
        required: ['Ingredient', 'RecipeId'],
        properties: {
          Ingredient: { type: 'string' },
          Qty: { type: 'number', nullable: true },
          Unit: { type: 'string', nullable: true },
          RecipeId: { type: 'integer' }
        }
      },
      Step: {
        type: 'object',
        properties: {
          Id: { type: 'integer' },
          Steps: { type: 'string' },
          Duration: { type: 'string', nullable: true },
          RecipeId: { type: 'integer' },
          Photos: { type: 'string', format: 'binary', nullable: true }
        }
      },
      StepInput: {
        type: 'object',
        required: ['Steps', 'RecipeId'],
        properties: {
          Steps: { type: 'string' },
          Duration: { type: 'string', nullable: true },
          RecipeId: { type: 'integer' },
          Photos: { type: 'string', format: 'binary', nullable: true }
        }
      }
    }
  }
};
