import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'SSPŠ GAMING API',
            version: '1.0.0',
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
    apis: ['./versions/v1/src/Auth/controllers/users.js', './versions/v1/src/Auth/models/User.js'],

};

const specs = swaggerJSDoc(options);

const router = express.Router();

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(specs));

export default router;