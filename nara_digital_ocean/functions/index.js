const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function to grant admin privileges to a user
 * Call via: https://us-central1-nara-web-73384.cloudfunctions.net/makeFirstAdmin?email=user@example.com
 */
exports.makeFirstAdmin = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  const email = req.query.email;
  
  if (!email) {
    return res.status(400).send('❌ Error: Email parameter required. Usage: ?email=user@example.com');
  }

  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom admin claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    // Return success
    res.status(200).send(`
      <html>
        <head>
          <title>Admin Created</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
              text-align: center;
            }
            .success {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #10b981;
              margin: 0 0 1rem 0;
            }
            p {
              color: #666;
              margin: 0.5rem 0;
            }
            .email {
              background: #f3f4f6;
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              font-family: monospace;
              color: #1f2937;
              margin: 1rem 0;
            }
            .link {
              display: inline-block;
              margin-top: 1.5rem;
              padding: 0.75rem 1.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 0.5rem;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✅</div>
            <h1>Admin Privileges Granted!</h1>
            <p>User has been granted admin access:</p>
            <div class="email">${email}</div>
            <p><strong>UID:</strong> ${user.uid}</p>
            <p style="margin-top: 1.5rem; color: #059669;">
              <strong>✨ User can now login to the admin panel!</strong>
            </p>
            <a href="https://nara-web-73384.web.app/admin/login" class="link">
              Go to Admin Login →
            </a>
          </div>
        </body>
      </html>
    `);
    
    console.log(`✅ Admin privileges granted to: ${email} (UID: ${user.uid})`);
    
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    
    let errorMessage = 'Unknown error';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found. Please create the user in Firebase Authentication first.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format.';
    } else {
      errorMessage = error.message;
    }
    
    res.status(500).send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
              text-align: center;
            }
            .error {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #dc2626;
              margin: 0 0 1rem 0;
            }
            p {
              color: #666;
              margin: 0.5rem 0;
            }
            .message {
              background: #fef2f2;
              padding: 1rem;
              border-radius: 0.5rem;
              color: #991b1b;
              margin: 1rem 0;
              border: 1px solid #fecaca;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="error">❌</div>
            <h1>Error</h1>
            <div class="message">${errorMessage}</div>
            <p><strong>Email:</strong> ${email}</p>
          </div>
        </body>
      </html>
    `);
  }
});
