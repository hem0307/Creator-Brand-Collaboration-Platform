/**
 * Simulated Developer-Console Email Sender for CreatorSync
 * Outputs mock emails to the node server terminal.
 */
export const sendMockEmail = ({ to, subject, body }) => {
  console.log('\n========================================================================');
  console.log(`📧 [MOCK EMAIL DISPATCH]`);
  console.log(`------------------------------------------------------------------------`);
  console.log(`TO:      ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`------------------------------------------------------------------------`);
  console.log(`BODY:\n${body}`);
  console.log('========================================================================\n');
};
