import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/State';

function HomePage() {
    const data = useSelector((state: RootState) => state.auth.token)
  return (
      <div>
          Hello<br/>
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
          a<br />
      </div>
  );
}

export default HomePage;