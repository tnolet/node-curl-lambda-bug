# HTTPS bug for node-libcurl on AWS Lambda

This reproduces the intermittent error of connecting to HTTPS sites using node-libcurl on AWS Lambda Node 10.x.

## Steps to reproduce

This does the following

1. Download the `build` version of the `lambci/lambda:build-nodejs10.x` project.
2. Compile the binding and copy it to `node_modules/node-libcurl`
3. Run simple test case in `index.js` in the runtime version of that same Docker container.
4. Print some output. Is uses verbose logging in Curl.


```bash
# Build the binding for AWS Node 10.x using
./build.sh

# Now run the index.js in the runtime container with http://google.com. This will not fail.

./run.sh http

# Run the same with https://google.com. This will fail intermittently.

./run.sh https

```

The verbose output on the failing requests looks as follows:

```
$ ./run.sh https
START RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72 Version: $LATEST
2019-06-16T12:06:55.752Z	52fdfc07-2182-154f-163f-5f0f9a621d72	INFO	*** START HANDLER ***
2019-06-16T12:06:55.755Z	52fdfc07-2182-154f-163f-5f0f9a621d72	INFO	Using HTTPS
*   Trying 216.58.205.238...
* TCP_NODELAY set
* Connected to google.com (216.58.205.238) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
END RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72
REPORT RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72	Duration: 138.45 ms	Billed Duration: 200 ms	Memory Size: 1536 MB	Max Memory Used: 6 MB	
{
  "errorType": "Runtime.ExitError",
  "errorMessage": "RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72 Error: Runtime exited without providing a reason"
}

```

Or, in some cases as follows:

```
Tims-MBP:test tim$ ./run_docker_lambda.sh 
START RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72 Version: $LATEST
2019-06-16T11:58:04.698Z	52fdfc07-2182-154f-163f-5f0f9a621d72	INFO	*** START HANDLER ***
*   Trying 172.217.23.174...
* TCP_NODELAY set
* Connected to google.com (172.217.23.174) port 443 (#0)
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /tmp/2019-05-15.pem
  CApath: none
* SSL connection using TLSv1.2 / ECDHE-ECDSA-CHACHA20-POLY1305
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: C=US; ST=California; L=Mountain View; O=Google LLC; CN=*.google.com
*  start date: May 21 20:43:22 2019 GMT
*  expire date: Aug 13 20:31:00 2019 GMT
*  subjectAltName: host "google.com" matched cert's "google.com"
*  issuer: C=US; O=Google Trust Services; CN=Google Internet Authority G3
*  SSL certificate verify ok.
> GET / HTTP/1.1
Host: google.com
User-Agent: node-libcurl/2.0.1
Accept: */*

< HTTP/1.1 301 Moved Permanently
< Location: https://www.google.com/
< Content-Type: text/html; charset=UTF-8
< Date: Sun, 16 Jun 2019 11:58:02 GMT
< Expires: Tue, 16 Jul 2019 11:58:02 GMT
< Cache-Control: public, max-age=2592000
< Server: gws
< Content-Length: 220
< X-XSS-Protection: 0
< X-Frame-Options: SAMEORIGIN
< Alt-Svc: quic=":443"; ma=2592000; v="46,44,43,39"
< 
* Ignoring the response-body
* Connection #0 to host google.com left intact
* Issue another request to this URL: 'https://www.google.com/'
*   Trying 172.217.16.68...
* TCP_NODELAY set
* Connected to www.google.com (172.217.16.68) port 443 (#1)
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /tmp/2019-05-15.pem
  CApath: none
* SSL: couldn't create a context (handle)!
* Closing connection 1
END RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72
REPORT RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72	Duration: 343.07 ms	Billed Duration: 400 ms	Memory Size: 1536 MB	Max Memory Used: 6 MB	
{
  "errorType": "Runtime.ExitError",
  "errorMessage": "RequestId: 52fdfc07-2182-154f-163f-5f0f9a621d72 Error: Runtime exited without providing a reason"
}
```

Or in other cases it will be fine and just finish the request.