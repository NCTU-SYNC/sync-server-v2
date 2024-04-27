// interface Message {
//   ruleId: string;
//   severity: number;
//   message: string;
//   line: number;
//   column: number;
//   nodeType: string;
// }

// interface LintResult {
//   filePath: string;
//   messages: Message[];
//   errorCount: number;
//   warningCount: number;
//   fixableErrorCount: number;
//   fixableWarningCount: number;
//   source?: string;
// }

let severityMap = new Map([
  [1, 'warning'],
  [2, 'error'],
]);

module.exports = function (results) {
  let result_str = '';

  for (let result of results) {
    if (result.messages.length > 0) {
      for (let msg of result.messages) {
        const { ruleId, severity, message, line, column } = msg;
        result_str += `::${severityMap.get(severity)} file=${result.filePath},line=${line},col=${column},title=${ruleId}::${message}`;
      }
    }
  }
  return result_str;
};
