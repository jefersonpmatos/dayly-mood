import { Calendar1, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HelpButton } from "./help-button";
import { Login } from "./login";
import { authClient } from "@/lib/auth-client";

export const Topbar = () => {
  const session = authClient.useSession();

  const logout = async () => {
    await authClient.signOut().then(() => {
      window.location.href = "/";
    });
  };
  return (
    <div className="w-full bg-gray-700 text-white shadow-lg border border-border py-1 px-10 md:px-4">
      <div className=" max-w-screen-lg mx-auto flex items-center justify-between">
        <div className="flex gap-2">
          <Calendar1 className="size-12" />
          <div>
            <p className="font-heading text-xl uppercase">Annual Diary</p>
            <p className="font-base text-sm">{session.data?.user.email}</p>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="size-9 md:hidden ">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-fit">
            <div className="flex flex-col gap-2 mt-10">
              {session.data && (
                <Button
                  onClick={() => {
                    authClient.signOut();
                  }}
                >
                  Logout
                </Button>
              )}

              {!session.data && <Login />}
              <HelpButton />
            </div>
          </SheetContent>
        </Sheet>

        <div className=" hidden md:flex gap-2 ">
          <HelpButton />
          {session.data && <Button onClick={logout}>Logout</Button>}

          {!session.data && <Login />}
        </div>
      </div>
    </div>
  );
};
