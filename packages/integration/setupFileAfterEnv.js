const { setDefaultOptions } = require("expect-puppeteer");
const MAX_INT32 = require("const-max-int32");

// Effectively disable Jest test timeouts, instead relying on expect-puppeteer
// calls to timeout. This avoids the possibility of the Jest timeout for a test
// being less than the sum of all the expect-puppeteer timeouts inside a test
// (some of which may have been customized to deal with long-running tasks).
jest.setTimeout(MAX_INT32);

// Extend the default expect-puppeteer timeout
setDefaultOptions({ timeout: 1000 });
