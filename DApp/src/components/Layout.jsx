import React from 'react'

import { Outlet, Link } from "react-router-dom";


export default function Layout() {
    return (
        <div className='layout'>
          {/* A "layout route" is a good place to put markup you want to
              share across all the pages on your site, like navigation. */}
          <header>
            <div className='links'>
                <div>
                    <Link to="/">Owner</Link>
                </div>
                <div>
                    <Link to="/user">User</Link>
                </div>
            </div>

            
          </header>
          
    
    
          {/* An <Outlet> renders whatever child route is currently active,
              so you can think about this <Outlet> as a placeholder for
              the child routes we defined above. */}
          <Outlet />
        </div>
      );
}
