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

It's sort of a pain, I'm open to better ideas, but here's my workflow:

In one terminal tab I have at React project and then watch for changes,
but with a few npm link shenanigans first:

```sh
cd /path/to/react-project
npm link
npm start
```

Then in another tab I run the blueprint with some npm link shenanigans
again.

```sh
cd /path/to/react-project/create-react-project/blueprint
npm install
npm link react-project
npm install
npm start
```

Now it's running. Making changes to the blueprint UI is lovely and
reload right away, but if you make changes to any server or webpack code
you have to restart the server, which is most of the time:

```sh
^C
npm start
```

