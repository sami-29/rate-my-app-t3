import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function About() {
  const user = useUser();
  return (
    <div className="space-y-52 p-12">
      <div>
        <h1 className="mb-16 text-center text-4xl font-bold ">
          About Rate My App
        </h1>
        <p className="mx-auto max-w-screen-sm">
          Welcome to Rate My App, the premier destination for app creators and
          enthusiasts to come together, collaborate, and foster innovation. Our
          diverse community comprises developers, UI/UX designers, tech gurus,
          and people who simply love apps, all passionate about the potential of
          technology to reshape our world.
        </p>
      </div>

      <div>
        <h2 className="mb-16 text-center text-3xl font-bold ">
          Unleashing the Power of Collective Wisdom
        </h2>
        <p className="mx-auto max-w-screen-sm">
          At Rate My App, we firmly believe in the transformative power of
          feedback. Our platform is designed to facilitate an enriching exchange
          of ideas, insights, and advice...
        </p>
      </div>

      <div>
        <h2 className="mb-16 text-center text-3xl font-bold ">
          Why You Should Be Part of Our Community
        </h2>
        <div className="mx-auto grid max-w-screen-sm grid-cols-2">
          <div>
            <h3 className=" mb-4 text-2xl font-bold  ">Developers</h3>
            <ul className="list-inside list-disc">
              <li>Showcase Your Work</li>
              <li>Constructive Critiques</li>
              <li>Learning Opportunities</li>
            </ul>
          </div>
          <div>
            <h3 className=" mb-4 text-2xl font-bold  ">Reviewers</h3>
            <ul className="list-inside list-disc">
              <li>Discover Innovation</li>
              <li>Influence Development</li>
              <li>Join a Passionate Community</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-16 text-center text-3xl font-bold ">
          Dive In Today!
        </h2>
        <p className="mx-auto max-w-screen-sm">
          The world of apps is constantly evolving, and we are at the forefront
          of this exciting journey. Are you ready to make your mark?
        </p>

        <div className=" flex justify-center gap-2">
          <Link className="btn-secondary btn" href={"/explore"}>
            Explore
          </Link>
          {!user.isSignedIn && (
            <SignInButton mode="modal">
              <button className="btn-primary btn">Sign In</button>
            </SignInButton>
          )}
        </div>

        <p className="mx-auto max-w-screen-sm">
          Don't just stand on the sidelines. Jump in and be part of our exciting
          community at Rate My App. Together, we'll make apps better, one review
          at a time. Join us today!
        </p>
      </div>
    </div>
  );
}
