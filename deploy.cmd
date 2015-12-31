@echo off

rem TODO Port to other platforms.

set PROFILE=node_wrapper
set REGION=eu-west-1
set FUNCTION=node-wrapper
set TMP_DIR=.tmp

call gulp cleanbuild
del %TMP_DIR%\archive.zip
mkdir %TMP_DIR%
call 7z a %TMP_DIR%\archive.zip ^
  index.js ^
  lib ^
  vendor ^
  node_modules\core-js ^
  node_modules\babel-runtime
call aws lambda update-function-code ^
  --profile %PROFILE% ^
  --region %REGION% ^
  --function-name %FUNCTION% ^
  --zip-file fileb://%TMP_DIR%/archive.zip
