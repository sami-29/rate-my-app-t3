import { SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const user = useUser();
  return (
    <div className="shadow-base-00 navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <ul className="menu menu-horizontal hidden px-1 md:flex">
          <li>
            <Link href={"/explore"}>Explore</Link>
          </li>
          <li>
            <Link href={"/about"}>About</Link>
          </li>
          {!!user.isSignedIn && (
            <li>
              <Link className=" text-primary" href={"/CreateApp"}>
                Create an App
              </Link>
            </li>
          )}
        </ul>
        <div className="dropdown md:hidden">
          <label tabIndex={0} className="btn-ghost btn-circle btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link href={"/explore"}>Explore</Link>
            </li>
            <li>
              <Link href={"/about"}>About</Link>
            </li>
            <li>
              <Link href={""}>Create an App</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link
          href={"/"}
          className="btn-ghost btn hidden text-xl normal-case lg:flex"
        >
          Rate My App
        </Link>
      </div>
      <div className="navbar-end">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search..."
            className="input-bordered input mr-2 "
          />
        </div>
        {!user.isSignedIn && (
          <div className="flex justify-center md:mr-2">
            <SignInButton mode="modal">
              <button className="btn-primary btn">Sign In</button>
            </SignInButton>
          </div>
        )}
        <SignedIn>
          <>
            <button className="dropdown dropdown-end btn-ghost btn-circle btn mx-2  ">
              <label tabIndex={0} className="cursor-pointer">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="badge-primary badge badge-xs indicator-item"></span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </button>
            <UserButton></UserButton>
          </>
        </SignedIn>
      </div>
    </div>
  );
}
