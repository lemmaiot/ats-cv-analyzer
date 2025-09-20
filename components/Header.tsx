
import React from 'react';
import { NIGERIAN_GREEN } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <img src="https://mycv.ng/images/fav.png" alt="MyCv.ng Logo" className="h-10 w-10 mr-3" />
        <span className="text-2xl font-bold" style={{ color: NIGERIAN_GREEN }}>
          MyCv<span className="text-gray-500">.ng</span>
        </span>
      </div>
    </header>
  );
};

export default Header;
