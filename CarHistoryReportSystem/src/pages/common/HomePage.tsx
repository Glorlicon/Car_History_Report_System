import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';

function HomePage() {
    const data = useSelector((state: RootState) => state.auth.token)
  return (
      <div>
          Hello<br/>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
      </div>
  );
}

export default HomePage;