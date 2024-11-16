import * as admin from 'firebase-admin';
export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    const defaultApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env['PROJECT_ID'],
        clientEmail: process.env['CLIENT_EMAIL'],
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDiuXZ/xTh6dMsz\nQW7+f6vZruM6sy05K0nFEg9loIdF/J16/tj0vRdFN3TreGoF2Ui44SJnpuZ9Tmc1\nYi8/KN0MCcw0h+2ToMM4/ps/td5lNnvLAEL6L9z3g8SARrAW8O1tjdb/JYLqS+MG\niFtkE1l8fsWOENZt+FmEgYrusY0PbVOkKoHL+gnY6RObtsC5S4mMJmtIQwmFbAjT\nrVGIBvX4gdW8pvAASGj9QyurHRLBk/v1ZUxCesyKpzRcycdoVKD5TeArw/qKcsck\nyxHEZbwa38eC3qvpCgworc4vUKS7ZuPJyyZ5HUaPDdzyLMoi2clGp0AC0yhAe80j\nTGtFJ9BnAgMBAAECggEACjnrSmAO6BcUgz9UTk5b5fmpbiBezdFSBn2GDENtVo7K\nW53bE07kGc8iiuxne9QNH6mn75zrkINUzGedUe/56G0YtNXctWfu5kc1oW4GlfIb\nK1DbtIUsJk3fMxn9H0vGqcZYCDIc8YxytPy5go4M3zyolHvV8CffgcaGCbYgcq2Z\n+Gq+nsIf6zK6cOjWISIRHMwXrt+n7DZxWYQFIbauFwaPZYwfRih/Fzw1PVQXyYK0\nD9HgHbU/ukNcZsPCKR+ygD8GsGBJllwJPxXqP2zojAWpJK2FjsOPezPokyYIPsdb\noX79NnlZKIf8eWFoGy0c6lnVTqh59xRANTWlw860AQKBgQDyMgZ217pqjkDX24ug\nSQ0nFjHBegCLeHwog0MZdLqZcOPrDDxf0AcjSEhAVZ1PLbslqqAi3JJ9qHchNgow\n4R2Iiopm5oUwv1RyUf9YZ6xXzNPGrAIm4fZ/dKoBFIN/TG8BkrhwzpUSQuMl5gZV\ns3Lf36diJ/p/DXrycgmQLu/KgQKBgQDvpbHPPZ+xiXmsBSrdEEUeUMj5OVvihaFz\niy/Kzggih+gvncBnHTjZpiUkA0iWZ6MBuMMWulB0VqlvdbeKU8j33+ih2kq+Ie2F\nZb977kqKrR6b1I1X+BVvBMg8u0/L/QhNh4+H0BHDNCpIE5vCrJyZFKlK7sisAlA+\nrfuVVOEW5wKBgQCivbSURK8xjHbL1O1EffHFkudKD3WwQfyDqHf88e+0zSOJPEaR\nRxKUxawu9phmrN71F2rVIguZPgsWmN5OK+YRaq5HKJzUvau7yZdfywIGWU7wT4J+\nqBVfXYAii6s0baKllvYybs3CYImLXL5i9dq5zeoGTcDHgMJdiP0eEjv0gQKBgCp9\nkn1QS9RKr8wUTnlLvTWW1Ut7JBOR5gJ6l0q6JS8aMczfh5HA2Keekc9E1cX1Mi3H\n+K868bDu/LPKh3R7TpLEnJa2AbKciWSxmbX7ljPoZhjzIuyKDCLXEjnSbF+aybIV\naxmFhuC5ixWkhGWL/WgXBb1HgUUeU+QJLSZZGl/ZAoGAEpUOdzHg/4k9FX/rjA5H\nmRmJLgOT/KkCs9g8HD9PhRpW61MiQGJdgrq8TXrGwrZ89h/R9czqb0Ok9IusVUMk\nfD6mMlAeaAkoZhU8i+SSWMy6MYfGncKjuxrxOOuPjYHIiKI4FpmLHwDIdgfB9gZ3\n1dwtYI4ueSBOMB8p1Wy8I1o=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
      }),
    });
    return { defaultApp };
  },
};