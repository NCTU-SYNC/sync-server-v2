const path = require('path');

const severityMap = new Map([
  [1, 'warning'],
  [2, 'error'],
]);

function constructMessage(type, file, line, col, title, message) {
  return `::${type} file=${file},line=${line},col=${col},title=${title}::${message}`;
}

module.exports = function (results) {
  const messages = [];

  for (const result of results) {
    const relatedPath = path.relative(process.cwd(), result.filePath);

    if (result.messages.length > 0) {
      for (const {
        ruleId,
        severity,
        message,
        line,
        column,
      } of result.messages) {
        const messageType = severityMap.get(severity);
        const constructedMessage = constructMessage(
          messageType,
          relatedPath,
          line,
          column,
          ruleId,
          message,
        );
        messages.push(constructedMessage + '\n');
      }
    }
  }

  return messages.join('');
};
