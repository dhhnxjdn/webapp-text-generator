const translation = {
  common: {
    welcome: 'Welcome to use',
    appUnavailable: 'App is unavailable',
    appUnkonwError: 'App is unavailable',
    optional: 'Optional',
  },
  generation: {
    tabs: {
      create: 'Single run',
      batch: 'Run Batch',
      saved: 'Saved',
    },
    queryTitle: 'Query content',
    completionResult: 'Completion result',
    queryPlaceholder: 'Write your query content...',
    run: 'Execute',
    copy: 'Copy',
    title: 'Run result',
    resultTitle: 'Run result',
    noData: 'Your result will appear here.',
    inputPlaceholder: 'Enter the content required by this workflow',
    fillSample: 'Fill in a sample',
    howto: {
      title: 'How to use',
      subtitle: 'Complete the form and run the workflow',
      step1: 'Fill in the required content on the left',
      step2: 'Click Run and wait for the workflow to finish',
      step3: 'View, copy, or download the result here',
    },
    csvUploadTitle: 'Drag and drop your CSV file here, or ',
    browse: 'browse',
    csvStructureTitle: 'The CSV file must conform to the following structure:',
    downloadTemplate: 'Download the template here',
    field: 'Field',
    batchFailed: {
      info: '{{num}} failed executions',
      retry: 'Retry',
      outputPlaceholder: 'No output content',
    },
    errorMsg: {
      empty: 'Please input content in the uploaded file.',
      fileStructNotMatch: 'The uploaded CSV file not match the struct.',
      emptyLine: 'Row {{rowIndex}} is empty',
      invalidLine: 'Row {{rowIndex}}: {{varName}} value can not be empty',
      moreThanMaxLengthLine: 'Row {{rowIndex}}: {{varName}} value can not be more than {{maxLength}} characters',
      atLeastOne: 'Please input at least one row in the uploaded file.',
    },
    privacyPolicyLeft:
      'Please read the ',
    privacyPolicyMiddle:
      'privacy policy',
    privacyPolicyRight:
      ' provided by the app developer.',
  },
  errorMessage: {
    valueOfVarRequired: 'Variables value can not be empty',
    queryRequired: 'Request text is required.',
    waitForResponse: 'Please wait for the response to the previous message to complete.',
    waitForImgUpload: 'Please wait for the image to upload',
  },
}

export default translation
