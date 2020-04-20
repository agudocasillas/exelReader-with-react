import React from 'react';

const Container = ({children}) => (
  <div className="content">
    <div className="container">
      {children}
    </div>
  </div>
);

export default Container;