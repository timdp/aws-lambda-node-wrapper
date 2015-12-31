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

## Usage

0. Make sure you have Node.js and [Gulp](http://gulpjs.com/) installed.
1. Clone this repository and `npm install` it.
2. Create a Lambda function. By default, this app uses `node-wrapper` in the
`eu-west-1` region; you can change that in `gulpfile.babel.js`.
3. Run `gulp deploy` to deploy the function.
4. Run the Lambda function.
5. View the logs.

## Findings

- Because zip files don't support permissions, you need to `chmod` the `node`
binary at runtime. However, the file is read-only, so you need to copy it
to `/tmp` first. Obviously, this implies a performance hit.

- With the 512 MB Lambda configuration, copying `node` takes about 300 ms, and
spawning the (trivial) child script adds another 300 ms. Even if your code isn't
time-critical, this slowdown will still impact your AWS bill.

- Even without the latest Node, deploying a Lambda is a hassle due to the fact
that you need to include the required `node_modules` manually. For the sake of
simplicity, this app only relies on `babel-runtime`.

## Author

[Tim De Pauw](https://github.com/timdp)

## License

MIT
