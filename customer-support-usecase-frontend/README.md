# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deployment

After cloning the repository, Create an .env file. in the root of the project. Refer to example.env.
Put the following value as the VITE_SESSION_ID: 656f20b414828b118cef987b

### With HTTP Proxy
If you are inside a VPN and require a proxy for internet communication, follow these steps
```bash
$ cd customer-support-usecase-frontend/
$ export http_proxy=proxy_name
$ sudo docker build -t customer_support_usecase_frontend --build-arg HTTP_PROXY=$http_proxy --build-arg HTTPS_PROXY=$http_proxy --build-arg NO_PROXY="$no_proxy" --build-arg http_proxy=$http_proxy --build-arg https_proxy=$http_proxy --build-arg no_proxy="$no_proxy" .
$ sudo docker run --name customer_support_usecase_frontend -d -p 3001:5173 customer_support_usecase_frontend
```
App will run at port 3001

### Without HTTP Proxy
```bash
$ cd customer-support-usecase-backend/
$ sudo docker build -t customer_support_usecase_frontend  .
$ sudo docker run --name customer_support_usecase_frontend -d -p 3001:5173 customer_support_usecase_frontend
```

App will run at port 3001
