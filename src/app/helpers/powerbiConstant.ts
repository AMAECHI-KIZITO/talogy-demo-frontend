// Success Image element
const successElement = document.createElement('img');
successElement.className = 'status-img';
successElement.src = 'assets/svg/sucess.png';

// Error Image element
const errorElement = document.createElement('img');
errorElement.className = 'status-img';
errorElement.src = 'assets/svg/error.png';

// Endpoint to get report config
const reportUrl = 'https://aka.ms/CaptureViewsReportEmbedConfig';

const errorClass = 'error';
const successClass = 'success';

// To show / hide the report container
const hidden = 'hidden';

// To position the display message
const position = 'position';

export { errorClass, errorElement, hidden, position, reportUrl, successClass, successElement };