import React from 'react';
import '../../styles/Suspend.css'

function SuspendPage() {
  return (
      <div className="suspended-page">
          <h1>Account Suspended</h1>
          <p>Your account has been suspended due to violation of our terms of service.</p>
          <p>If you believe this is a mistake or if you want to appeal, please contact our support team.</p>
      </div>
  );
}

export default SuspendPage;