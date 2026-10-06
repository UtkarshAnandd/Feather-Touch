import fs from 'node:fs';
import path from 'node:path';

const siteDataPath = process.env.SITE_DATA_FILE || path.resolve('src/_data/site.json');

if (!fs.existsSync(siteDataPath)) {
  console.error(`Error: Site data file not found at ${siteDataPath}`);
  process.exit(1);
}

const site = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

const checks = [
  { id: 1, name: 'Phone display (contact.phoneDisplay)', pass: Boolean(site.contact?.phoneDisplay) },
  { id: 2, name: 'Phone E.164 (contact.phoneE164)', pass: Boolean(site.contact?.phoneE164) },
  { id: 3, name: 'WhatsApp display (contact.whatsappDisplay)', pass: Boolean(site.contact?.whatsappDisplay) },
  { id: 4, name: 'WhatsApp digits (contact.whatsappDigits)', pass: Boolean(site.contact?.whatsappDigits) },
  { id: 5, name: 'Email address (contact.email)', pass: Boolean(site.contact?.email) },
  { id: 6, name: 'Street address (address.streetAddress)', pass: Boolean(site.address?.streetAddress) },
  { id: 7, name: 'Locality (address.locality)', pass: Boolean(site.address?.locality) },
  { id: 8, name: 'Postal code (address.postalCode)', pass: Boolean(site.address?.postalCode) },
  { id: 9, name: 'School hours (hours.school)', pass: Boolean(site.hours?.school) },
  { id: 10, name: 'Admissions session label (admissions.sessionLabel)', pass: Boolean(site.admissions?.sessionLabel) },
  { id: 11, name: 'Content sign-off (launch.contentSignOff)', pass: site.launch?.contentSignOff === true },
  { id: 12, name: 'Privacy policy approved (launch.privacyPolicyApproved)', pass: site.launch?.privacyPolicyApproved === true },
];

const failed = checks.filter(c => !c.pass);

if (failed.length > 0) {
  console.error(`Launch gate check FAILED: ${failed.length} required item(s) unfulfilled:`);
  for (const item of failed) {
    console.error(`  [FAIL] Item ${item.id}: ${item.name}`);
  }
  process.exit(1);
} else {
  console.log('Launch gate check PASSED: All 12 required launch conditions verified.');
  process.exit(0);
}
