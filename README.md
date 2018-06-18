# Tweet Streaming Service App
[Netflix Edge Insights Senior UI Engineer Applicant Exercise](https://tweet-service.herokuapp.com/senior-ui-engineer.html)

## Setup
Run `npm install` and then `npm start`. View http://localhost:3000/ in the
browser.

## Usage
Add conditions and submit to filter tweets from the stream. The regex value is
in the format e.g. `/foo|bar/`

## Notes
* Use multiple web workers to process streaming data. The number of
workers depends on the number of logical processors available to run threads on
the computer (`navigator.hardwareConcurrency`).

* Data from the stream goes to a buffer, which will dispatch to each worker
evenly when the buffer is full.

* App sends condition data to the worker for filtering data when conditions are
submitted, and keeps receiving results from works.
