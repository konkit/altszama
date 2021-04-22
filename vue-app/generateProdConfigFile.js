fs = require('fs');

contents = `
window._env = {}
window._env.GOOGLE_CLIENT_ID="${process.env.GOOGLE_CLIENT_ID}"
window._env.VAPID_PUBLIC_KEY="${process.env.VAPID_PUBLIC_KEY}"
window._env.SENTRY_URL="${process.env.SENTRY_URL}"
`

fs.writeFile('dist/env.js', contents, function (err) {
  if (err) return console.log(err);
  console.log('Written configuration to js file');
});
