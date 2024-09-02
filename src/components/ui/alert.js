import React from 'react';

export const Alert = ({ children, className, ...props }) => (
  <div className={`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 ${className}`} role="alert" {...props}>
    {children}
  </div>
);

export const AlertTitle = ({ children, className, ...props }) => (
  <p className={`font-bold ${className}`} {...props}>{children}</p>
);

export const AlertDescription = ({ children, className, ...props }) => (
  <p className={className} {...props}>{children}</p>
);