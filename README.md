# checkers-web-app

### Usage

#### Development

Use the following command to start `nodemon` and the Express.js server

```bash
npm run dev
```

#### Docker

Use the following commands to build and run the Docker image locally

```bash
docker build . -t checkers-web-app
docker run -p 3000:3000 -e PORT=3000 checkers-web-app
```

<br>

### Deployment

Use the following commands to push and deploy a local Docker image to Heroku

```bash
heroku container:push web -a unity-checkers
heroku container:release web -a unity-checkers
```
