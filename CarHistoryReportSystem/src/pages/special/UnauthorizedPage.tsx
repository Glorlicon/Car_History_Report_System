import React from 'react';
import '../../styles/Unauthorized.css'

function UnauthorizedPage() {
  return (
      <div className="unauthorized-page">
          <h1>Unauthorized</h1>
          <p>You are not authorized to see content of this page.</p>
          <p>If you believe this is a mistake or if you want to appeal, please contact our support team.</p>
      </div>
  );
}

export default UnauthorizedPage;