const Hapi  = require('hapi');
const Inert = require('inert');
const { resolve } = require('path');

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: process.env.PODCST_WEB_ROOT,
      }
    }
  }
});

server.connection({
  port: '9141'
});

server.register(Inert);

const indexPath = 'index.html';

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
      directory: {
          path: '.',
          redirectToSlash: true,
          index: true
      }
  }
});

server.ext('onPostHandler', (request, reply) => {
  const response = request.response;
  if (
    response.isBoom &&
    response.output.statusCode === 404
  ) {
    return reply.file(indexPath).code(200);
  }

  return reply.continue();
});

server.start().then(() => console.log(`Server up on ${server.info.uri}`));
