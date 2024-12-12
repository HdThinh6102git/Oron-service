// import * as admin from 'firebase-admin';


// export const firebaseAdminProvider = {
//   provide: 'FIREBASE_ADMIN',
//   useFactory: () => {
//     const defaultApp = admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: process.env['PROJECT_ID'],
//         clientEmail: process.env['CLIENT_EMAIL'],
//         privateKey: process.env['PRIVATE_KEY']?.replace(/\\n/g, '\n'),
//       }),
//     });
//     return { defaultApp };
//   },
// };

import * as admin from 'firebase-admin';
import * as path from 'path';

export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    // Resolve the path to the service account JSON file
    const serviceAccountPath = path.resolve(
      __dirname,
      '../../../src/oron-service-firebase-adminsdk-jpw76-8def68ae16.json' // Update this path to the actual location of your JSON file
    );

    // Import the JSON file
    const serviceAccount = require(serviceAccountPath);

    // Initialize Firebase Admin with the JSON file
    const defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    return { defaultApp };
  },
};
