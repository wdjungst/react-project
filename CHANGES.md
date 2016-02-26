## 0.0.5

- allow apps to add express middleware before express routing starts
- fixed init issues #8, #9
- added hook for server data hydration

## 0.0.4

- switched from `prompt-sync` to `prompt` because all of the issues so
  far came from `prompt-sync` :(.
- cleaned up package.json dependencies, many were dev dependencies

## 0.0.3

- `start` now checks dependencies so when you upgrade React Project, you
  know how to update your app to work with it.

- added some default security stuff to the web server.

