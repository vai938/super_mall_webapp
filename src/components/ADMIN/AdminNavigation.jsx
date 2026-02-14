import React from "react";
import { NavLink } from "react-router-dom";

const navItemClass = ({ isActive }) =>
  `
  block px-4 py-3 mx-2 my-1 rounded-xl text-center
  text-white/80
  hover:text-white
  hover:bg-white/20
  transition-all duration-200
  ${isActive ? "bg-white/30 text-white font-semibold" : ""}
  `;

const AdminNavigation = () => {
  return (
    <div className="h-full bg-white/10 backdrop-blur-xl border-r border-white/20">
      <div className="p-4 space-y-2">
        <NavLink to="/admin" className={navItemClass}>
          Overview Admin Panel
        </NavLink>

        <NavLink to="/admin/create_shop" className={navItemClass}>
          Create Shop
        </NavLink>

        <NavLink to="/admin/list_of_all_shop" className={navItemClass}>
          View All Shops
        </NavLink>

        <NavLink to="/admin/view/floor" className={navItemClass}>
          View Floor-wise Shops
        </NavLink>

        <NavLink to="/admin/view/category" className={navItemClass}>
          View Category Shops
        </NavLink>

        <NavLink to="/admin/view/shop_owner" className={navItemClass}>
          View Shop Owner
        </NavLink>
      </div>
    </div>
  );
};

export default AdminNavigation;
