#!/usr/bin/env bash

runTestsAndGenerateReport()
{
    echo "== Starting cypress tests =="
    npm run cypress:test:report -- -b electron -c ${CERBERUS_WORKFLOW_SERVICE_URL} -e dev
    TEST_RUN_STATUS=$?
     echo "######## TEST RUN STATUS : TEST_RUN_STATUS #######"
}

getSecrets()
{
    mkdir -p cypress/fixtures/users
    node get_secrets.js
}

setVariables()
{
    REPORT_DATE=$(date +%Y%m%d)
    REPORT_TIME=$(date +%H%M%S)
    S3_BUCKET_LOCATION="s3://${S3_BUCKET_NAME}/test-reports"
    S3_TEST_REPORT="${AUTH_REALM}/cerberus-tests/${REPORT_DATE}/${JOB_NAME}/${REPORT_TIME}"
}

uploadReport()
{
    s3cmd --region=eu-west-2 --access_key=${S3_ACCESS_KEY} --secret_key=${S3_SECRET_KEY} put --recursive mochawesome-report/ ${S3_BUCKET_LOCATION}/${S3_TEST_REPORT}/ --no-mime-magic --guess-mime-type

    REPORT_UPLOAD_STATUS=$?

    echo "######## REPORT UPLOAD STATUS : $REPORT_UPLOAD_STATUS #######"
}

createReportUrl()
{
    REPORT_FULL_URL="${REPORT_BASE_URL}/${S3_TEST_REPORT}/mochawesome.html"
    echo "######## REPORT FULL URL : $REPORT_FULL_URL #######"
}

getSecrets
setVariables
runTestsAndGenerateReport
uploadReport
createReportUrl
