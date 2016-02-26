## TODO

- ES2015 everywhere, currently the webpack and test configs aren't
  babel'd.
- Hot reloading server code (https://github.com/jlongster/backend-with-webpack does this).
  You have to restart the server when you change code in `/api` or your
  server entry, which is a pain.
- Redux + data loading (probably just keep it in the blueprint)
- Server side test runner (for the stuff in /api)
- HTTPS/SPDY/HTTP2 support

## Running tests

There aren't many yet, but anyway:

```
npm test
```

If you write some tests, please keep them as high level as possible,
only test what the user would do.

## Hacking

```sh
# in the root of your repo fork
npm link
cd blueprint
npm install
# go to bed
# wake up
npm link react-project
npm start
```

Now it's running. Making changes to the blueprint are lovely and reload
right away, but if you make changes to any server code it's a giant
pain, please help, but anyway you need to:

```sh
# quit the server with ^C
# get back to the root of the repo
cd ..
npm run build
cd blueprint
npm start
```

If we had server hot-reloading this would be way better.

