fs = require('fs');

contents = `
window._env = {}
window._env.VUE_APP_GOOGLE_CLIENT_ID="${process.env.VUE_APP_GOOGLE_CLIENT_ID}"
window._env.VUE_APP_VAPID_PUBLIC_KEY="${process.env.VUE_APP_VAPID_PUBLIC_KEY}"
window._env.VUE_APP_SENTRY_URL="${process.env.VUE_APP_SENTRY_URL}"
`

fs.writeFile('dist/env.js', contents, function (err) {
  if (err) return console.log(err);
  console.log('Written configuration to js file');
});
