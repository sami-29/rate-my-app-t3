import { useUser } from "@clerk/nextjs";
export default function Profile() {
  const user = useUser();
  if (!user.isSignedIn) {
    return;
  }

  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }

  return <div>Profile</div>;
}
