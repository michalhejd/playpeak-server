import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'SSPŠ GAMING API',
            version: process.env.npm_package_version,
            description: 'SSPŠ GAMING API',
        },
        host: 'localhost:3000',
        basePath: '/api/v1',
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Local server'
            }
        ],
        tags: [
            {
                name: 'Users',
                description: 'API for managing users'
            }
        ]
    },
    apis: ['./docs/swagger/users/endpoints.js', './docs/swagger/users/models.js', './docs/swagger/components.js'],

};

const specs = swaggerJSDoc(options);

const router = express.Router();

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(specs));

export default router;