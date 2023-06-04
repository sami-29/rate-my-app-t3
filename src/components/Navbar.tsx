import { SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Notification } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const user = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/explore?query=${searchQuery}`);
    }
  };

  const { data, error, failureReason } = useQuery({
    queryKey: ["Notifications"],
    queryFn: async () => {
      const res = await fetch(
        `/api/notifications?userId=${encodeURIComponent(user.user?.id!)}`,
        {
          method: "GET",
        }
      );
      const body = await res.json();
      console.log(body);
      return body as Notification[];
    },
  });

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
              <Link href={"/"}>Home</Link>
            </li>
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
          className="btn-ghost btn hidden text-2xl normal-case md:flex"
        >
          Rate My App
        </Link>
      </div>
      <div className="navbar-end">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search..."
            className="input-bordered input input-sm mr-2 md:input-md "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
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
                <div className={"indicator"}>
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
                  <span
                    className={`${
                      !data || data.length === 0
                        ? ""
                        : "btn-ghost btn-circle btn"
                    }  indicator-item mx-2`}
                  ></span>
                </div>
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 max-w-[5rem] bg-base-100 p-2 shadow"
              >
                {!data ||
                  (data.length === 0 && (
                    <li>
                      <a>There are no notifications for you</a>
                    </li>
                  ))}
                {data?.map((notif) => {
                  return (
                    <li>
                      <a className="truncate">{notif.content}</a>
                    </li>
                  );
                })}
              </ul>
            </button>
            <UserButton></UserButton>
          </>
        </SignedIn>
      </div>
    </div>
  );
}
