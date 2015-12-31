# Node Wrapper for AWS Lambda

[![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

Runs recent versions of Node.js on AWS Lambda. Tested with Node.js v4.2.4.

## Rationale

[AWS Lambda](https://aws.amazon.com/lambda/)
is sweet but at the time of this writing, it still
[runs on Node.js v0.10.36](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html),
which is ancient. The docs
[suggest](https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/)
including your own `node` binary in the package zip. This little app
demonstrates that concept.

## Findings

- Because zip files don't support permissions, you need to `chmod` the `node`
binary at runtime. However, the file is read-only, so you need to copy it
to `/tmp` first. Obviously, this implies a performance hit.

- With the 512 MB Lambda configuration, copying `node` takes about 300 ms, and
spawning the (trivial) child script adds another 300 ms. Even if your code isn't
time-critical, this slowdown will still impact your AWS bill.

- Even without the latest Node, deploying a lambda is a hassle due to the fact
that you need to include the required `node_modules` manually. Solutions such as
[grunt-aws-lambda](https://www.npmjs.com/package/grunt-aws-lambda) alleviate
this. For the sake of simplicity, this app only relies on `babel-runtime` and
its deployment script includes that module explicitly.

## Caveats

- The deployment script `deploy.cmd` is Windows-only (hence the name) and
assumes that you have `7z` and `aws` in your `PATH`. It shouldn't be too
difficult to port to your environment.

- This is just a quick experiment. Don't expect too much.

## Author

[Tim De Pauw](https://github.com/timdp)

## License

MIT
